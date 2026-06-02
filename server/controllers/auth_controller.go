package controllers

import (
	"bnsp2/server/database"
	"bnsp2/server/helpers"
	"bnsp2/server/models"
	"bnsp2/server/structs"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var req = structs.UserCreateRequest{}

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validasi Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}

	user := models.User{
		Name:     req.Name,
		Username: req.Username,
		Email:    req.Email,
		Password: helpers.HashPassword(req.Password),
		Picture:  "default.png",
	}

	if err := database.DB.Create(&user).Error; err != nil {

		if helpers.IsDuplicateEntryError(err) {

			c.JSON(http.StatusConflict, structs.ErrorResponse{
				Success: false,
				Message: "Duplicate entry error",
				Errors:  helpers.TranslateErrorMessage(err),
			})
		} else {

			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "Failed to create user",
				Errors:  helpers.TranslateErrorMessage(err),
			})
		}
		return
	}

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "User created successfully",
		Data: structs.UserResponse{
			Id:        user.Id,
			Name:      user.Name,
			Username:  user.Username,
			Email:     user.Email,
			Role:      user.Role,
			Picture:   user.Picture,
			CreatedAt: user.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: user.UpdatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func Login(c *gin.Context) {

	var req = structs.UserLoginRequest{}
	var user = models.User{}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err),
		})
		return
	}
	println("hey")

	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Wrong username or password",
			Errors: map[string]string{
				"Error": "Wrong username or password",
			},
		})
		println("hey")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Wrong username or password",
			Errors: map[string]string{
				"Error": "Wrong username or password",
			},
		})
		return
	}

	accessToken := helpers.GenerateAccessToken(user.Id, user.Role)
	refreshToken := helpers.GenerateRefreshToken(user.Id, user.Role)

	c.SetCookie(
		"access_token",
		accessToken,
		900,
		"/",
		"",
		false,
		true,
	)

	c.SetCookie(
		"refresh_token",
		refreshToken,
		604800,
		"/api/auth/refresh",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Login Success",
		Data: structs.UserResponse{
			Id:        user.Id,
			Name:      user.Name,
			Username:  user.Username,
			Email:     user.Email,
			CreatedAt: user.CreatedAt.String(),
			UpdatedAt: user.UpdatedAt.String(),
			Role:      user.Role,
			Picture:   user.Picture,
		},
	})
}

func Logout(c *gin.Context) {

	c.SetCookie(
		"access_token",
		"",
		-1,
		"/",
		"",
		false,
		true,
	)

	c.SetCookie(
		"refresh_token",
		"",
		-1,
		"/api/auth/refresh",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Logout success",
	})
}
