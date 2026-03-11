package middlewares

import (
	"bnsp2/server/config"  // Mengambil konfigurasi dari file .env
	"bnsp2/server/helpers" // Mengambi
	"net/http"             // Untuk membuat response HTTP
	"strconv"
	"strings" // Untuk manipulasi string

	"github.com/gin-gonic/gin"     // Framework Gin untuk HTTP routing
	"github.com/golang-jwt/jwt/v5" // Library JWT untuk membuat dan memverifikasi token
)

// Ambil secret key dari environment variable
// Jika tidak ada, gunakan default "secret_key"
var jwtKey = config.GetJWTKey()

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		// Ambil header Authorization dari request
		tokenString := c.GetHeader("Authorization")

		// Jika token kosong, kembalikan respons 401 Unauthorized
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Token is required",
			})
			c.Abort()
			return
		}

		// Hapus prefix "Bearer " dari token
		// Header biasanya berbentuk: "Bearer <token>"
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		// Buat struct untuk menampung klaim token
		claims := &helpers.JWTClaims{}

		// Parse token dan verifikasi tanda tangan dengan jwtKey
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Kembalikan kunci rahasia untuk memverifikasi token
			return jwtKey, nil
		})

		// Jika token tidak valid atau terjadi error saat parsing
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			c.Abort() // Hentikan request
			return
		}

		// Simpan klaim "sub" (username) ke dalam context
		c.Set("user_id", claims.UserId)
		c.Set("role", claims.Role)

		// Lanjut ke handler berikutnya
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
