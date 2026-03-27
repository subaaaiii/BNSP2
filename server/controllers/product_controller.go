package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"time"

	"bnsp2/server/database"
	"bnsp2/server/models"

	"github.com/gin-gonic/gin"
)

func CreateProduct(c *gin.Context) {

	// ambil title
	title := c.PostForm("title")
	if title == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "title is required",
		})
		return
	}

	// ambil description
	description := c.PostForm("description")

	// ambil price
	priceStr := c.PostForm("price")
	if priceStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "price is required",
		})
		return
	}
	price, err := strconv.Atoi(priceStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "invalid price format",
		})
		return
	}

	// ambil game_id
	gameIdStr := c.PostForm("game_id")
	gameIdInt, err := strconv.Atoi(gameIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "invalid game_id format",
		})
		return
	}
	gameId := uint(gameIdInt)

	userId := c.MustGet("user_id").(uint)

	// ambil field_values (optional)
	fieldValuesStr := c.PostForm("field_values")
	var fieldValuesJSON []byte

	if fieldValuesStr != "" {
		var fieldValues map[string]interface{}

		if err := json.Unmarshal([]byte(fieldValuesStr), &fieldValues); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "invalid field_values format",
			})
			return
		}

		fieldValuesJSON, _ = json.Marshal(fieldValues)
	}

	// ambil file (optional)
	file, err := c.FormFile("image")
	var filename string
	if err == nil {
		uploadPath := "./images/products/"
		os.MkdirAll(uploadPath, os.ModePerm)
		filename = fmt.Sprintf("%d%s", time.Now().Unix(), filepath.Ext(file.Filename))
		filepath := path.Join(uploadPath, filename)
		if err := c.SaveUploadedFile(file, filepath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "failed to save image",
			})
			return
		}
	}

	product := models.Product{
		GameId:      gameId,
		UserId:      userId,
		Price:       price,
		Title:       title,
		Description: description,
		Status:      "available",
		Image:       filename,
		FieldValues: fieldValuesJSON,
	}
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "failed to create product",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    product,
	})
}
