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
	"bnsp2/server/structs"

	"github.com/gin-gonic/gin"
)

func CreateProduct(c *gin.Context) {

	// ambil title
	title := c.PostForm("title")
	if title == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "title is required",
		})
		return
	}

	// ambil description
	description := c.PostForm("description")

	// ambil price
	priceStr := c.PostForm("price")
	if priceStr == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "price is required",
		})
		return
	}
	price, err := strconv.Atoi(priceStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid price format",
		})
		return
	}

	stockStr := c.PostForm("stock")
	if stockStr == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "stock is required",
		})
		return
	}
	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid stock format",
		})
		return
	}
	guaranteeStr := c.PostForm("guarantee")
	if guaranteeStr == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "guarantee is required",
		})
		return
	}

	guarantee, err := strconv.Atoi(guaranteeStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid guarantee format",
		})
		return
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

	// ambil field_values (optional)
	fieldValuesStr := c.PostForm("field_values")
	var fieldValuesJSON []byte

	if fieldValuesStr != "" {
		var fieldValues map[string]interface{}

		if err := json.Unmarshal([]byte(fieldValuesStr), &fieldValues); err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "invalid field_values format",
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
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "failed to save image",
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

	id := c.Param("id")

	var product models.Product

	userId := c.MustGet("user_id").(uint)

	if err := database.DB.Where("id = ? AND user_id = ?", id, userId).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found",
		})
		return
	}
	// ambil title
	title := c.PostForm("title")
	if title == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "title is required",
		})
		return
	}

	// ambil description
	description := c.PostForm("description")

	// ambil price
	priceStr := c.PostForm("price")
	if priceStr == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "price is required",
		})
		return
	}
	price, err := strconv.Atoi(priceStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid price format",
		})
		return
	}

	stockStr := c.PostForm("stock")
	if stockStr == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "stock is required",
		})
		return
	}
	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid stock format",
		})
		return
	}
	guaranteeStr := c.PostForm("guarantee")
	if guaranteeStr == "" {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "guarantee is required",
		})
		return
	}

	guarantee, err := strconv.Atoi(guaranteeStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "invalid guarantee format",
		})
		return
	}

	// ambil field_values (optional)
	fieldValuesStr := c.PostForm("field_values")
	var fieldValuesJSON []byte

	if fieldValuesStr != "" {
		var fieldValues map[string]interface{}

		if err := json.Unmarshal([]byte(fieldValuesStr), &fieldValues); err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "invalid field_values format",
			})
			return
		}

		fieldValuesJSON, _ = json.Marshal(fieldValues)
		product.FieldValues = fieldValuesJSON
	}

	remove_imageStr := c.PostForm("remove_image")
	remove_image := false

	if remove_imageStr != "" {
		var err error
		remove_image, err = strconv.ParseBool(remove_imageStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "invalid remove_image format",
			})
			return
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
		// simpan image lama dulu (jangan dihapus sekarang)
		oldImage = product.Image

		// set image baru ke product
		product.Image = filename

	} else if remove_image {
		oldImage = product.Image
		product.Image = ""
	}

	product.Title = title
	product.Description = description
	product.Price = price
	product.Stock = stock
	product.Guarantee = guarantee

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

	if oldImage != "" {
		_ = os.Remove("./images/products/" + oldImage)
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product successfully updated",
		Data:    product,
	})

}
