package controllers

import (
	"bnsp2/server/database"
	"bnsp2/server/helpers"
	"bnsp2/server/models"
	"bnsp2/server/structs"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

	id := c.Param("id")

	var user models.User

	// cek user
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "User not found",
		})
		return
	}

	// ambil data dari form
	name := c.PostForm("name")
	username := c.PostForm("username")
	address := c.PostForm("address")
	bank := c.PostForm("bank")
	accountNumber := c.PostForm("account_number")
	gender := c.PostForm("gender")
	birthday := c.PostForm("birthday")

	if name != "" {
		user.Name = name
	}

	if username != "" {
		user.Username = username
	}

	if address != "" {
		user.Address = address
	}

	if bank != "" {
		user.Bank = bank
	}

	if accountNumber != "" {
		user.AccountNumber = accountNumber
	}

	if gender != "" {
		user.Gender = gender
	}

	if birthday != "" {
		parsedDate, err := time.Parse("2006-01-02", birthday)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid date format"})
			return
		}
		user.Birthday = parsedDate
	}

	file, err := c.FormFile("picture")
	if err == nil {
		if user.Picture != "" && user.Picture != "default.png" {

			oldPath := "images/users/" + user.Picture

			if err := os.Remove(oldPath); err != nil {
				// optional: hanya log jika gagal hapus
				fmt.Println("failed delete old image:", err)
			}
		}

		// buat nama file unik
		filename := fmt.Sprintf(
			"user-%s-%d%s",
			id,
			time.Now().Unix(),
			filepath.Ext(file.Filename),
		)

		path := "images/users/" + filename

		// simpan file
		if err := c.SaveUploadedFile(file, path); err != nil {
			c.JSON(500, gin.H{
				"error": "Failed to upload picture",
			})
			return
		}

		user.Picture = filename
	}

	// save database
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(500, gin.H{
			"message": "Failed to update user",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "User updated successfully",
		"data":    user,
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

func VerifyPassword(c *gin.Context) {
	var req structs.VerifyPasswordRequest

	// bind request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// ambil user dari context (misalnya dari middleware JWT)
	userID := c.MustGet("user_id").(uint)

	var user models.User

	// ambil user dari database
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User tidak ditemukan",
		})
		return
	}

	// compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Invalid Password",
			Errors: map[string]string{
				"Password": "Wrong password",
			},
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Password Verified",
	})
}

func ChangePassword(c *gin.Context) {
	var req structs.ChangePasswordRequest

	// bind request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// ambil user dari context (misalnya dari middleware JWT)
	userID := c.MustGet("user_id").(uint)

	var user models.User

	// ambil user dari database
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User tidak ditemukan",
		})
		return
	}

	user.Password = helpers.HashPassword(req.NewPassword)
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Password Updated Successfully",
	})
}
