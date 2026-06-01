package middlewares

import (
	"bnsp2/server/config"
	"bnsp2/server/helpers"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = config.GetJWTKey()

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Token is required",
			})
			c.Abort()
			return
		}

		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		claims := &helpers.JWTClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {

			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserId)
		c.Set("role", claims.Role)

		c.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {

		roleValue, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Role not found",
			})
			c.Abort()
			return
		}

		role, ok := roleValue.(string)
		if !ok || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Access denied. Admin only.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
func OwnerOrAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {

		paramID := c.Param("id")
		id, _ := strconv.Atoi(paramID)

		user_id, _ := c.Get("user_id")
		role, _ := c.Get("role")

		if role != "admin" && uint(id) != user_id.(uint) {
			c.JSON(403, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		c.Next()
	}
}
