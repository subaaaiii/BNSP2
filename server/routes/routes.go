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
		AllowMethods:  []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
	}))

	// route register
	router.POST("/api/register", controllers.Register)
	router.GET("/api/me", middlewares.AuthMiddleware(), controllers.Me)
	router.POST("/api/login", controllers.Login)
	// router.GET("/api/users", controllers.FindUsers)
	router.GET("/api/users", middlewares.AuthMiddleware(), middlewares.AdminOnly(), controllers.FindUsers)
	router.GET("/api/users/:id", middlewares.AuthMiddleware(), middlewares.OwnerOrAdmin(), controllers.FindUserById)
	router.PATCH("/api/users/:id", middlewares.AuthMiddleware(), middlewares.OwnerOrAdmin(), controllers.UpdateUser)
	router.DELETE("/api/users/:id", middlewares.AuthMiddleware(), middlewares.OwnerOrAdmin(), controllers.DeleteUser)

	return router
}
