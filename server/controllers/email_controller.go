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

func SendEmailOTP(c *gin.Context) {

	var req = structs.UserVerifyEmailRequest{}
	var user = models.User{}

	// Validasi input dari request body menggunakan ShouldBindJSON
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	// ambil user dari database
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User tidak ditemukan",
		})
		return
	}

	// generate OTP
	otp := helpers.GenerateOTP()

	// set expired OTP
	expired := time.Now().Add(5 * time.Minute)

	// simpan OTP ke database
	user.EmailOTP = otp
	user.OTPExpiresAt = expired

	database.DB.Save(&user)

	// kirim OTP ke email
	err := helpers.SendOTPEmail(req.Email, otp)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Gagal kirim OTP",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "OTP dikirim ke email",
	})
}

type VerifyEmailRequest struct {
	OTP   string `json:"otp"`
	Email string `json:"email"`
}

func VerifyEmailOTP(c *gin.Context) {
	var req VerifyEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"message": "Request tidak valid"})
		return
	}

	var user models.User

	// cari user berdasarkan email
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User tidak ditemukan",
		})
		return
	}

	// cek OTP
	if user.EmailOTP != req.OTP {
		c.JSON(400, gin.H{
			"message": "OTP salah",
		})
		return
	}

	// cek expired
	if time.Now().After(user.OTPExpiresAt) {
		c.JSON(400, gin.H{
			"message": "OTP expired",
		})
		return
	}

	// update email (optional tergantung flow)
	user.EmailOTP = ""
	user.OTPExpiresAt = time.Time{} // reset
	user.EmailVerified = true

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(500, gin.H{
			"message": "Gagal update user",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Email berhasil diverifikasi",
	})
}

func SendChangeEmailOTP(c *gin.Context) {

	userID := c.MustGet("user_id").(uint)

	var user models.User

	// ambil user dari database
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User tidak ditemukan",
		})
		return
	}

	// generate OTP
	otp := helpers.GenerateOTP()

	// set expired OTP
	expired := time.Now().Add(5 * time.Minute)

	// simpan OTP ke database
	user.EmailOTP = otp
	user.OTPExpiresAt = expired

	database.DB.Save(&user)

	// kirim OTP ke email lama
	err := helpers.SendOTPEmail(user.Email, otp)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Gagal kirim OTP",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "OTP dikirim ke email lama",
	})
}

type VerifyOTPRequest struct {
	OTP      string `json:"otp"`
	NewEmail string `json:"new_email"`
}

func VerifyChangeEmailOTP(c *gin.Context) {

	userID := c.MustGet("user_id").(uint)

	var req VerifyOTPRequest
	c.ShouldBindJSON(&req)

	var user models.User

	database.DB.First(&user, userID)

	// cek OTP
	if user.EmailOTP != req.OTP {
		c.JSON(400, gin.H{
			"message": "OTP salah",
		})
		return
	}

	// cek expired
	if time.Now().After(user.OTPExpiresAt) {
		c.JSON(400, gin.H{
			"message": "OTP expired",
		})
		return
	}

	// update email
	user.Email = req.NewEmail
	user.EmailOTP = ""

	database.DB.Save(&user)

	c.JSON(200, gin.H{
		"message": "Email berhasil diubah",
	})
}
