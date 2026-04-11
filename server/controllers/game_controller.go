package controllers

import (
	"encoding/json"
	"net/http"

	"errors"
	"fmt"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"bnsp2/server/database"
	"bnsp2/server/models"
	"bnsp2/server/structs"

	"github.com/gin-gonic/gin"
)

func CreateGame(c *gin.Context) {

	errors := map[string]string{}

	// ambil name
	name := c.PostForm("name")
	if name == "" {
		errors["Name"] = "Name is required"
	}

	// ambil fields (optional)
	fieldsStr := c.PostForm("fields")

	var fields []map[string]interface{}

	if fieldsStr != "" {
		if err := json.Unmarshal([]byte(fieldsStr), &fields); err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "invalid fields format",
			})
			return
		}
	}

	// defaultFields := []map[string]interface{}{
	// 	{"label": "Title", "name": "title", "type": "text", "required": true},
	// 	{"label": "Description", "name": "description", "type": "text", "required": true},
	// 	{"label": "Price", "name": "price", "type": "text", "required": true},
	// 	{"label": "Cover", "name": "cover", "type": "text", "required": false},
	// }

	// // 🔥 cek field yang sudah ada
	// existing := map[string]bool{}
	// for _, f := range fields {
	// 	if name, ok := f["name"].(string); ok {
	// 		existing[name] = true
	// 	}
	// }

	// // 🔥 tambahkan default fields di BELAKANG (tanpa duplicate)
	// for _, df := range defaultFields {
	// 	name := df["name"].(string)
	// 	if !existing[name] {
	// 		fields = append(fields, df)
	// 	}
	// }

	file, err := c.FormFile("image")
	if file == nil {
		errors["Image"] = "Image is required"
	} else if err != nil {
		errors["Image"] = "Failed to retrieve image"
	}

	if len(errors) > 0 {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  errors,
		})
		return
	}

	uploadPath := "./images/games/covers/"
	os.MkdirAll(uploadPath, os.ModePerm)

	filename := fmt.Sprintf("%d%s", time.Now().Unix(), filepath.Ext(file.Filename))
	filepath := path.Join(uploadPath, filename)

	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to save image",
		})
		return
	}
	fieldJSON, err := json.Marshal(fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to parse fields",
		})
		os.Remove(filepath)
		return
	}

	game := models.Game{
		Name:        name,
		Image:       filename,
		FieldSchema: fieldJSON,
	}

	if err := database.DB.Create(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to create game",
		})
		os.Remove(filepath)
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Game successfully created",
		Data:    game,
	})
}

func GetGames(c *gin.Context) {
	var games []models.Game

	if err := database.DB.Find(&games).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to fetch games",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Games successfully fecthed",
		Data:    games,
	})
}

func GetGameByID(c *gin.Context) {
	id := c.Param("id")

	var game models.Game
	if err := database.DB.First(&game, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "game not found",
		})
		return
	}

	// parse JSON schema biar enak di frontend
	var fields []map[string]interface{}
	json.Unmarshal(game.FieldSchema, &fields)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Data: gin.H{
			"id":     game.ID,
			"name":   game.Name,
			"image":  game.Image,
			"fields": fields,
		},
	})
}

func UpdateGame(c *gin.Context) {

	id := c.Param("id")

	var game models.Game

	// cek game
	if err := database.DB.First(&game, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Game not found",
		})
		return
	}

	// ambil name
	name := c.PostForm("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "name is required",
		})
		return
	}
	game.Name = name

	// ambil fields (optional)
	fieldsStr := c.PostForm("fields")

	var fields []map[string]interface{}

	if fieldsStr != "" {
		if err := json.Unmarshal([]byte(fieldsStr), &fields); err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "invalid fields format",
			})
			return
		}
		fieldsJSON, _ := json.Marshal(fields)
		game.FieldSchema = fieldsJSON
	}

	file, err := c.FormFile("image")
	if err != nil {
		if !errors.Is(err, http.ErrMissingFile) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file upload"})
			return
		}
	} else {
		ext := strings.ToLower(filepath.Ext(file.Filename))

		if ext != ".jpg" && ext != ".png" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file type"})
			return
		}

		if game.Image != "" {
			oldPath := "images/games/covers/" + game.Image
			_ = os.Remove(oldPath)
		}

		filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
		path := "images/games/covers/" + filename

		if err := c.SaveUploadedFile(file, path); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload picture"})
			return
		}

		game.Image = filename
	}

	// save database
	if err := database.DB.Save(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to update game",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Game updated successfully",
		Data:    game,
	})
}

func DeleteGame(c *gin.Context) {
	id := c.Param("id")
	var game models.Game
	if err := database.DB.First(&game, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Game not found",
		})
		return
	}
	if game.Image != "" {
		oldPath := "images/games/covers/" + game.Image
		_ = os.Remove(oldPath)
	}
	if err := database.DB.Delete(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to delete game, server error",
		})
	}
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Game deleted successfully",
	})
}
