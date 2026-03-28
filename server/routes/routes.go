package routes

import (
	"bnsp2/server/controllers"
	"bnsp2/server/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	//initialize gin
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:  []string{"*"},
		AllowMethods:  []string{"GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
	}))

	// route register
	router.Static("/images", "./images")
	router.POST("/api/register", controllers.Register)
	router.GET("/api/me", middlewares.AuthMiddleware(), controllers.Me)
	router.POST("/api/login", controllers.Login)
	// router.GET("/api/users", controllers.FindUsers)
	router.GET("/api/users", middlewares.AuthMiddleware(), middlewares.AdminOnly(), controllers.FindUsers)
	router.GET("/api/users/:id", middlewares.AuthMiddleware(), middlewares.OwnerOrAdmin(), controllers.FindUserById)
	router.PATCH("/api/users/:id", middlewares.AuthMiddleware(), middlewares.OwnerOrAdmin(), controllers.UpdateUser)
	router.DELETE("/api/users/:id", middlewares.AuthMiddleware(), middlewares.OwnerOrAdmin(), controllers.DeleteUser)
	router.POST("/send-otp-change-email", middlewares.AuthMiddleware(), controllers.SendChangeEmailOTP)
	router.POST("/send-otp-verify-email", controllers.SendEmailOTP)
	router.POST("/verify-email", controllers.VerifyEmailOTP)
	router.POST("/verify-otp-change-email", middlewares.AuthMiddleware(), controllers.VerifyChangeEmailOTP)
	router.POST("/verify-password", middlewares.AuthMiddleware(), controllers.VerifyPassword)
	router.POST("/change-password", middlewares.AuthMiddleware(), controllers.ChangePassword)
	admin := router.Group("/api/admin")
	{
		admin.POST("/games", controllers.CreateGame)
		admin.GET("/games", controllers.GetGames)
		admin.GET("/games/:id", middlewares.AuthMiddleware(), controllers.GetGameByID)
		admin.PUT("/games/:id", controllers.UpdateGame)
		admin.DELETE("/games/:id", controllers.DeleteGame)
	}
	router.POST("/api/products", middlewares.AuthMiddleware(), controllers.CreateProduct)
	return router
}
