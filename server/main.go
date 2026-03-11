package main

import (
	"bnsp2/server/config"
	"bnsp2/server/database"
	"bnsp2/server/routes"
)

func main() {

	//load config .env
	config.LoadEnv()
	database.InitDB()

	r := routes.SetupRouter()

	//mulai server
	r.Run(":" + config.GetEnv("APP_PORT", "3000"))
}
