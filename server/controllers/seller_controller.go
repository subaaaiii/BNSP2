package controllers

import (
	"bnsp2/server/database"
	"bnsp2/server/helpers"
	"bnsp2/server/models"
	"bnsp2/server/structs"
	"fmt"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// RegisterSeller menangani proses registrasi seller baru
func RegisterSeller(c *gin.Context) {

	identityNumber := c.PostForm("identity_number")
	if identityNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "identity number is required",
		})
		return
	}

	identityImage, err := c.FormFile("identity_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Failed to retrieve identity image",
		})
		return
	}
	uploadPath := "images/sellers/identities"
	if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create upload directory",
		})
		return
	}

	filename := fmt.Sprintf("seller-%d%s", time.Now().Unix(), filepath.Ext(identityImage.Filename))
	filepath := path.Join(uploadPath, filename)

	if err := c.SaveUploadedFile(identityImage, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to save identity image",
		})
		return
	}

	userId := c.MustGet("user_id").(uint)

	// Buat data seller baru
	seller := models.Seller{
		IdentityNumber: identityNumber,
		IdentityImage:  filename,
		UserId:         userId,
	}

	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "User not found",
		})
		return
	}

	// ambil data dari form
	name := c.PostForm("name")
	address := c.PostForm("address")
	gender := c.PostForm("gender")
	birthday := c.PostForm("birthday")

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Name is required",
		})
		return
	}
	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Address is required",
		})
		return
	}
	if gender == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Gender is required",
		})
		return
	}

	if birthday == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Birthday is required",
		})
		return
	}

	if birthday != "" {
		parsedDate, err := time.Parse("2006-01-02", birthday)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid date format"})
			return
		}
		user.Birthday = parsedDate
	}

	user.Name = name
	user.Address = address
	user.Gender = gender

	// save database
	tx := database.DB.Begin()
	if err := tx.Model(&user).Updates(user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create user",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}
	if err := tx.Create(&seller).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create seller",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}
	tx.Commit()

	// Jika berhasil, kirimkan response sukses
	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Seller created successfully",
		Data: structs.SellerResponse{
			Id:             seller.Id,
			IdentityNumber: seller.IdentityNumber,
			IdentityImage:  seller.IdentityImage,
			UserId:         seller.UserId,
			Status:         "pending",
			User: structs.UserProfileResponse{
				Name:     user.Name,
				Address:  user.Address,
				Gender:   user.Gender,
				Birthday: user.Birthday.Format("2006-01-02"),
			},
		},
	})
}

func GetSellerByUserId(c *gin.Context) {
	userId := c.MustGet("user_id").(uint)

	var seller models.Seller
	if err := database.DB.Preload("User").Where("user_id = ?", userId).First(&seller).Error; err != nil {
		c.JSON(200, gin.H{
			"data": nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Seller found",
		Data: structs.SellerResponse{
			Id:             seller.Id,
			IdentityNumber: seller.IdentityNumber,
			IdentityImage:  seller.IdentityImage,
			UserId:         seller.UserId,
			Status:         seller.Status,
			User: structs.UserProfileResponse{
				Name:     seller.User.Name,
				Address:  seller.User.Address,
				Gender:   seller.User.Gender,
				Birthday: seller.User.Birthday.Format("2006-01-02"),
			},
		},
	})
}

func GetSellers(c *gin.Context) {

	var sellers []models.Seller
	if err := database.DB.Preload("User").Find(&sellers).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create user",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	var result []structs.SellerResponse

	for _, seller := range sellers {
		result = append(result, structs.SellerResponse{
			Id:             seller.Id,
			IdentityNumber: seller.IdentityNumber,
			IdentityImage:  seller.IdentityImage,
			UserId:         seller.UserId,
			Status:         seller.Status,
			User: structs.UserProfileResponse{
				Name:     seller.User.Name,
				Address:  seller.User.Address,
				Gender:   seller.User.Gender,
				Birthday: seller.User.Birthday.Format("2006-01-02"),
			},
		})
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Seller found",
		Data:    result,
	})
}

func UpdateSellerStatus(c *gin.Context) {
	var req structs.UpdateSellerStatusRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Invalid request body",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	tx := database.DB.Begin()

	// 1. Update seller status
	if err := tx.Model(&models.Seller{}).
		Where("id IN ?", req.Ids).
		Update("status", req.Status).Error; err != nil {

		tx.Rollback()
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to update seller status",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// 2. Kalau approved → update role user
	if req.Status == "approved" {

		// ambil user_id dari sellers
		var userIds []uint
		if err := tx.Model(&models.Seller{}).
			Where("id IN ?", req.Ids).
			Pluck("user_id", &userIds).Error; err != nil {

			tx.Rollback()
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "Failed to get user ids",
				Errors:  helpers.TranslateErrorMessage(err),
			})
			return
		}

		// update role user jadi seller
		if err := tx.Model(&models.User{}).
			Where("id IN ?", userIds).
			Update("role", "seller").Error; err != nil {

			tx.Rollback()
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "Failed to update user role",
				Errors:  helpers.TranslateErrorMessage(err),
			})
			return
		}
	}

	// commit kalau semua sukses
	tx.Commit()

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Status updated successfully",
	})
}
