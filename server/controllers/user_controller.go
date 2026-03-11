package controllers

import (
	"bnsp2/server/database"
	"bnsp2/server/helpers"
	"bnsp2/server/models"
	"bnsp2/server/structs"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func FindUsers(c *gin.Context) {

	// Inisialisasi slice untuk menampung data user
	var users []models.User

	// Ambil data user dari database
	database.DB.Find(&users)

	// Kirimkan response sukses dengan data user
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Lists Data Users",
		Data:    users,
	})
}

func FindUserById(c *gin.Context) {

	// Ambil ID user dari parameter URL
	id := c.Param("id")

	// Inisialisasi user
	var user models.User

	// Cari user berdasarkan ID
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User not found",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// Kirimkan response sukses dengan data user
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "User Found",
		Data: structs.UserProfileResponse{
			Id:            user.Id,
			Name:          user.Name,
			Username:      user.Username,
			Email:         user.Email,
			Birthday:      user.Birthday.Format("2006-01-02"),
			Gender:        user.Gender,
			AccountNumber: user.AccountNumber,
			Bank:          user.Bank,
			Address:       user.Address,
			Picture:       user.Picture,
			CreatedAt:     user.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt:     user.UpdatedAt.Format("2006-01-02 15:04:05"),
		},
	})

}

func UpdateUser(c *gin.Context) {

	// Ambil ID user dari parameter URL
	id := c.Param("id")

	// Inisialisasi user
	var user models.User

	// Cari user berdasarkan ID
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User not found",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	//struct user request
	var req = structs.UserUpdateRequest{}

	// Bind JSON request ke struct UserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// Update user dengan data baru
	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.Username != nil {
		if *req.Username == "" {
			c.JSON(400, gin.H{"error": "Username cannot be empty"})
			return
		}

		// cek duplicate di database
		user.Username = *req.Username
	}

	if req.Email != nil {
		if *req.Email == "" {
			c.JSON(400, gin.H{"error": "Email cannot be empty"})
			return
		}

		user.Email = *req.Email
	}
	if req.Address != nil {
		user.Address = *req.Address
	}
	if req.Picture != nil {
		user.Picture = *req.Picture
	}
	if req.Bank != nil {
		user.Bank = *req.Bank
	}
	if req.AccountNumber != nil {
		user.AccountNumber = *req.AccountNumber
	}
	if req.Birthday != nil {
		parsedDate, err := time.Parse("2006-01-02", *req.Birthday)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
			return
		}
		user.Birthday = parsedDate
	}
	if req.Gender != nil {
		user.Gender = *req.Gender
	}

	// Simpan perubahan ke database
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to update user",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// Kirimkan response sukses
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "User updated successfully",
		Data: structs.UserProfileResponse{
			Id:            user.Id,
			Name:          user.Name,
			Username:      user.Username,
			Email:         user.Email,
			Birthday:      user.Birthday.Format("2006-01-02"),
			Gender:        user.Gender,
			AccountNumber: user.AccountNumber,
			Bank:          user.Bank,
			Address:       user.Address,
			Picture:       user.Picture,
			CreatedAt:     user.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt:     user.UpdatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func DeleteUser(c *gin.Context) {

	// Ambil ID user dari parameter URL
	id := c.Param("id")

	// Inisialisasi user
	var user models.User

	// Cari user berdasarkan ID
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User not found",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// Hapus user dari database
	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to delete user",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// Kirimkan response sukses
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "User deleted successfully",
	})
}

func Me(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	var user models.User

	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Data user",
		Data: structs.UserResponse{
			Id:       user.Id,
			Name:     user.Name,
			Username: user.Username,
			Email:    user.Email,
			Picture:  user.Picture,
		},
	})
}
