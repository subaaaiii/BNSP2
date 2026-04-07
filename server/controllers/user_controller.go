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
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "No User found",
		})
		return
	}

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
		})
		return
	}

	// Kirimkan response sukses dengan data user
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "User Found",
		Data: structs.UserProfileResponse{
			Name:     user.Name,
			Birthday: user.Birthday.Format("2006-01-02"),
			Gender:   user.Gender,
			Address:  user.Address,
			Picture:  user.Picture,
		},
	})

}

func UpdateUser(c *gin.Context) {

	id := c.Param("id")

	var user models.User

	// cek user
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	// ambil data dari form
	name := c.PostForm("name")
	address := c.PostForm("address")
	gender := c.PostForm("gender")
	birthday := c.PostForm("birthday")

	if name != "" {
		user.Name = name
	}
	if address != "" {
		user.Address = address
	}
	if gender != "" {
		user.Gender = gender
	}
	if birthday != "" {
		parsedDate, err := time.Parse("2006-01-02", birthday)
		if err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "Invalid date format"})
			return
		}
		user.Birthday = parsedDate
	}

	file, err := c.FormFile("picture")
	if err == nil {
		if user.Picture != "" && user.Picture != "default.png" {

			oldPath := "images/users/" + user.Picture

			if err := os.Remove(oldPath); err != nil {
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
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "Failed to upload picture",
			})
			return
		}

		user.Picture = filename
	}

	// save database
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to update user",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: false,
		Message: "User updated successfully",
		Data:    user,
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
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var user models.User

	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Data user",
		Data: structs.UserResponse{
			Id:            user.Id,
			Name:          user.Name,
			Username:      user.Username,
			Email:         user.Email,
			Picture:       user.Picture,
			Role:          user.Role,
			EmailVerified: user.EmailVerified,
			CreatedAt:     user.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt:     user.UpdatedAt.Format("2006-01-02 15:04:05"),
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
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User tidak ditemukan",
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
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "User tidak ditemukan",
		})
		return
	}

	user.Password = helpers.HashPassword(req.NewPassword)
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false, Message: "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Password Updated Successfully",
	})
}

func SendResetPasswordEmail(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	var user models.User

	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Email not registered",
		})
		return
	}

	token := helpers.GenerateResetToken(user.Id)
	user.ResetToken = token
	user.ResetTokenExpiresAt = time.Now().Add(10 * time.Minute)
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to generate reset token",
		})
		return
	}

	if err := helpers.SendResetPasswordEmail(user.Email, token); err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to send reset email",
		})
		return
	}
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Email for password sent successfully",
	})

}

func ResetPassword(c *gin.Context) {
	var req struct {
		Token    string `json:"token" binding:"required"`
		Password string `json:"password" binding:"required,min=8"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	var user models.User

	if err := database.DB.Where("reset_token = ?", req.Token).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Invalid reset token",
		})
		return
	}

	if time.Now().After(user.ResetTokenExpiresAt) {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Reset Password token has expired",
		})
		return
	}

	user.Password = helpers.HashPassword(req.Password)
	user.ResetToken = ""
	user.ResetTokenExpiresAt = time.Time{}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to reset password",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Password reset successfully",
	})

}
