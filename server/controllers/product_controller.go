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
	"bnsp2/server/helpers"
	"bnsp2/server/models"
	"bnsp2/server/structs"

	"github.com/gin-gonic/gin"
)

func CreateProduct(c *gin.Context) {
	errors := make(map[string]string)
	// ambil title
	title := c.PostForm("title")
	if title == "" {
		errors["Title"] = "title is required"
	}

	// ambil description
	description := c.PostForm("description")

	// ambil price
	priceStr := c.PostForm("price")
	var price int

	if priceStr == "" {
		errors["Price"] = "price is required"
	} else {
		p, err := strconv.Atoi(priceStr)
		if err != nil {
			errors["Price"] = "invalid price format"
		} else if p < 0 {
			errors["Price"] = "price must be a positive number"
		}
		price = p
	}

	stockStr := c.PostForm("stock")
	var stock int
	if stockStr == "" {
		errors["Stock"] = "stock is required"
	} else {
		s, err := strconv.Atoi(stockStr)
		if err != nil {
			errors["Stock"] = "invalid stock format"
		} else if s <= 0 {
			errors["Stock"] = "stock must be a positive number"
		}
		stock = s
	}

	guaranteeStr := c.PostForm("guarantee")
	var guarantee int
	if guaranteeStr == "" {
		errors["Guarantee"] = "guarantee is required"
	} else {
		g, err := strconv.Atoi(guaranteeStr)
		if err != nil {
			errors["Guarantee"] = "invalid guarantee format"
		} else if g < 0 {
			errors["Guarantee"] = "guarantee must be a positive number"
		}
		guarantee = g
	}

	// ambil game_id
	gameIdStr := c.PostForm("game_id")
	gameIdInt, err := strconv.Atoi(gameIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid game_id format",
		})
		return
	}
	gameId := uint(gameIdInt)

	userId := c.MustGet("user_id").(uint)

	var game models.Game
	if err := database.DB.First(&game, gameId).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "game not found",
		})
		return
	}

	// setelah ambil game
	fieldValuesStr := c.PostForm("field_values")

	var fieldValues map[string]interface{}
	var fieldValuesJSON []byte

	if fieldValuesStr != "" {
		if err := json.Unmarshal([]byte(fieldValuesStr), &fieldValues); err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "invalid field_values format",
			})
			return
		}
		fieldValuesJSON, _ = json.Marshal(fieldValues)
	} else {
		fieldValues = make(map[string]interface{})
	}

	// VALIDATION DARI HELPER
	fieldErrors := helpers.ValidateFieldValues(game.FieldSchema, fieldValues)
	for k, v := range fieldErrors {
		errors[k] = v
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
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "failed to save image",
			})
			return
		}
	}

	if len(errors) > 0 {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "validation error",
			Errors:  errors,
		})
		return
	}

	product := models.Product{
		GameId:      gameId,
		UserId:      userId,
		Price:       price,
		Title:       title,
		Description: description,
		Status:      "available",
		Image:       filename,
		Stock:       stock,
		Guarantee:   guarantee,
		FieldValues: fieldValuesJSON,
	}
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to create product",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product successfully created",
		Data:    product,
	})
}

func GetProducts(c *gin.Context) {

	userId := c.MustGet("user_id").(uint)
	var products []models.Product
	if err := database.DB.Where("user_id = ?", userId).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to get products",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Products retrieved successfully",
		Data:    products,
	})
}

func GetProductByID(c *gin.Context) {

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid product id format",
		})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product retrieved successfully",
		Data:    product,
	})
}

func UpdateProduct(c *gin.Context) {
	errors := make(map[string]string)

	id := c.Param("id")
	userId := c.MustGet("user_id").(uint)

	var product models.Product
	if err := database.DB.Where("id = ? AND user_id = ?", id, userId).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found",
		})
		return
	}

	if title, exists := c.GetPostForm("title"); exists {
		if title == "" {
			errors["Title"] = "title cannot be empty"
		} else {
			product.Title = title
		}
	}

	if description, exists := c.GetPostForm("description"); exists {
		product.Description = description
	}

	if priceStr, exists := c.GetPostForm("price"); exists {
		if priceStr == "" {
			errors["Price"] = "price cannot be empty"
		} else {
			price, err := strconv.Atoi(priceStr)
			if err != nil || price < 0 {
				errors["Price"] = "invalid price"
			} else {
				product.Price = price
			}
		}
	}

	if stockStr, exists := c.GetPostForm("stock"); exists {
		if stockStr == "" {
			errors["Stock"] = "stock cannot be empty"
		} else {
			stock, err := strconv.Atoi(stockStr)
			if err != nil || stock <= 0 {
				errors["Stock"] = "invalid stock"
			} else {
				product.Stock = stock
			}
		}
	}

	if guaranteeStr, exists := c.GetPostForm("guarantee"); exists {
		if guaranteeStr == "" {
			errors["Guarantee"] = "guarantee cannot be empty"
		} else {
			guarantee, err := strconv.Atoi(guaranteeStr)
			if err != nil || guarantee < 0 {
				errors["Guarantee"] = "invalid guarantee"
			} else {
				product.Guarantee = guarantee
			}
		}
	}

	var game models.Game
	if err := database.DB.First(&game, product.GameId).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "game not found",
		})
		return
	}

	if fieldValuesStr, exists := c.GetPostForm("field_values"); exists {
		var fieldValues map[string]interface{}

		if fieldValuesStr != "" {
			if err := json.Unmarshal([]byte(fieldValuesStr), &fieldValues); err != nil {
				errors["FieldValues"] = "invalid field_values format"
			}
		} else {
			fieldValues = make(map[string]interface{})
		}

		// validasi pakai helper
		fieldErrors := helpers.ValidateFieldValues(game.FieldSchema, fieldValues)

		for k, v := range fieldErrors {
			errors[k] = v
		}

		if len(fieldErrors) == 0 {
			fieldValuesJSON, _ := json.Marshal(fieldValues)
			product.FieldValues = fieldValuesJSON
		}
	}

	removeImage := false
	if removeStr, exists := c.GetPostForm("remove_image"); exists {
		val, err := strconv.ParseBool(removeStr)
		if err != nil {
			errors["RemoveImage"] = "invalid remove_image format"
		} else {
			removeImage = val
		}
	}

	file, err := c.FormFile("image")
	var filename string
	var oldImage string

	if err == nil {
		uploadPath := "./images/products/"
		os.MkdirAll(uploadPath, os.ModePerm)

		filename = fmt.Sprintf("%d%s", time.Now().Unix(), filepath.Ext(file.Filename))
		filepath := path.Join(uploadPath, filename)

		if err := c.SaveUploadedFile(file, filepath); err != nil {
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "failed to save image",
			})
			return
		}

		oldImage = product.Image
		product.Image = filename

	} else if removeImage {
		oldImage = product.Image
		product.Image = ""
	}

	if len(errors) > 0 {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "validation error",
			Errors:  errors,
		})
		return
	}

	if err := database.DB.Save(&product).Error; err != nil {
		if filename != "" {
			_ = os.Remove("./images/products/" + filename)
		}

		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "failed to update product",
		})
		return
	}

	// hapus image lama kalau ada
	if oldImage != "" {
		_ = os.Remove("./images/products/" + oldImage)
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product successfully updated",
		Data:    product,
	})
}

func DeleteProduct(c *gin.Context) {

	id := c.Param("id")
	var product models.Product

	userId := c.MustGet("user_id").(uint)

	if err := database.DB.Where("id = ? AND user_id = ? ", id, userId).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found",
		})
		return
	}
	if err := database.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to delete product",
		})
		return
	}
	if product.Image != "" {
		_ = os.Remove("./images/products/" + product.Image)
	}
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product successfully deleted",
	})
}
