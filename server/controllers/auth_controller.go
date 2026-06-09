package controllers

import (
	"bnsp2/server/database"
	"bnsp2/server/helpers"
	"bnsp2/server/models"
	"bnsp2/server/redis"
	"bnsp2/server/structs"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

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

func handleFailedLogin(ctx context.Context, ip string, username string) {
	key := fmt.Sprintf(
		"login_fail:%s:%s",
		ip,
		username,
	)

	count, _ := redis.RedisClient.Incr(ctx, key).Result()

	if count == 1 {
		redis.RedisClient.Expire(ctx, key, 15*time.Minute)
	}

	if count >= 3 {
		redis.RedisClient.Set(
			ctx,
			fmt.Sprintf(
				"captcha_required:%s:%s",
				ip,
				username,
			),
			"1",
			15*time.Minute,
		)
	}
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

	ctx := c.Request.Context()
	ip := c.ClientIP()

	key := fmt.Sprintf(
		"captcha_required:%s:%s",
		ip,
		req.Username,
	)
	captchaRequired, err := redis.RedisClient.Exists(
		ctx,
		key,
	).Result()

	if err != nil {
		log.Println(err)
	}

	if captchaRequired > 0 {
		if req.CaptchaToken == "" {
			c.JSON(http.StatusForbidden, structs.ErrorResponse{
				Success: false,
				Message: "Captcha required",
				Errors: map[string]string{
					"Error":   "Captcha required",
					"captcha": "Captcha required",
				},
			})
			return
		}

		valid, err := helpers.VerifyTurnstile(req.CaptchaToken)

		if err != nil || !valid {
			c.JSON(http.StatusForbidden, structs.ErrorResponse{
				Success: false,
				Message: "Invalid captcha",
				Errors: map[string]string{
					"Error":   "Invalid captcha",
					"captcha": "Invalid captcha",
				},
			})
			return
		}
	}

	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Wrong username or password",
			Errors: map[string]string{
				"Error": "Wrong username or password",
			},
		})
		handleFailedLogin(ctx, ip, req.Username)
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
		handleFailedLogin(ctx, ip, req.Username)
		return
	}

	redis.RedisClient.Del(
		ctx,
		fmt.Sprintf(
			"login_fail:%s:%s",
			ip,
			req.Username,
		),
	)

	redis.RedisClient.Del(
		ctx,
		key,
	)

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
