package routes

import (
	"bnsp2/server/controllers"
	"bnsp2/server/handlers"
	"bnsp2/server/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	//initialize gin
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// route register
	router.Static("/images", "./images")
	router.POST("/api/register", controllers.Register)
	router.GET("/api/me", middlewares.AuthMiddleware(), controllers.Me)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.Logout)
	router.POST("/api/auth/refresh", handlers.Refresh)
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
	router.POST("/api/sellers/register", middlewares.AuthMiddleware(), controllers.RegisterSeller)
	router.GET("/api/seller", middlewares.AuthMiddleware(), controllers.GetSellerByUserId)
	router.GET("/api/sellers", middlewares.AuthMiddleware(), controllers.GetSellers)
	router.PATCH("/api/sellers/status", middlewares.AuthMiddleware(), controllers.UpdateSellerStatus)
	router.POST("/api/forgot-password", controllers.SendResetPasswordEmail)
	router.POST("/api/reset-password", controllers.ResetPassword)
	admin := router.Group("/api/admin")
	{
		admin.POST("/games", controllers.CreateGame)
		admin.GET("/games", controllers.GetGames)
		admin.GET("/games/:id", controllers.GetGameByID)
		admin.PUT("/games/:id", controllers.UpdateGame)
		admin.DELETE("/games/:id", controllers.DeleteGame)
	}
	router.POST("/api/products", middlewares.AuthMiddleware(), controllers.CreateProduct)
	router.GET("/api/products", middlewares.AuthMiddleware(), controllers.GetProducts)
	router.GET("/api/products/:id", controllers.GetProductByID)
	router.PUT("/api/products/:id", middlewares.AuthMiddleware(), controllers.UpdateProduct)
	router.DELETE("/api/products/:id", middlewares.AuthMiddleware(), controllers.DeleteProduct)
	router.PATCH("/api/products/status", middlewares.AuthMiddleware(), controllers.ChangeProductStatus)
	router.GET("/api/products/public", controllers.GetProductsPublic)

	router.POST("/pusher/auth", middlewares.AuthMiddleware(), handlers.AuthHandler)
	router.POST("/api/chat/send", middlewares.AuthMiddleware(), handlers.SendMessage)
	router.GET("/api/chat/messages", middlewares.AuthMiddleware(), handlers.GetMessages)
	router.GET("/api/chat/list", middlewares.AuthMiddleware(), handlers.GetChatListHandler)
	router.POST("/api/payment/callback", middlewares.AuthMiddleware(), controllers.PaymentCallback)

	router.POST("/api/orders", middlewares.AuthMiddleware(), controllers.CreateOrder)
	router.GET("/api/orders/:id", middlewares.AuthMiddleware(), controllers.GetOrder)
	router.GET("/api/orders", middlewares.AuthMiddleware(), controllers.GetOrders)
	router.POST("/api/orders/status", middlewares.AuthMiddleware(), controllers.UpdateStatusOrder)
	router.GET("/api/orders/batch", middlewares.AuthMiddleware(), controllers.GetOrderBatch)
	router.GET("/api/products/batch", middlewares.AuthMiddleware(), controllers.GetProductBatch)
	return router
}
