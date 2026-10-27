package main

import (
	"context"
	"log"
	"os"

	"github.com/Neo0724/intermediateExpenseTracker/internal/auth"
	"github.com/Neo0724/intermediateExpenseTracker/internal/expense"
	"github.com/Neo0724/intermediateExpenseTracker/internal/income"
	"github.com/Neo0724/intermediateExpenseTracker/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func initializeDb() *mongo.Client {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error reading it:", err)
		// We log a warning instead of fatal because in production (Docker, Kubernetes, Heroku)
		// variables are often passed via the OS directly, not via a .env file.
	}

	var url string = ""

	if url = os.Getenv("MONGODB_URL"); url == "" {
		log.Fatal("You must set the MONGODB_URL env")
		return nil
	}

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	opts := options.Client().ApplyURI(url).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(opts)

	if err != nil {
		panic(err)
	}

	return client
}

func main() {
	mongoClient := initializeDb()

	if mongoClient != nil {
		log.Println("Connected to DB")
	}

	defer func() {
		if err := mongoClient.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	r := gin.Default()

	api := r.Group("/api/v1")

	authHandler := auth.NewHandler(mongoClient)
	authHandler.RegisterRoutes(api.Group("/auth"))

	expenseHandler := expense.NewHandler(mongoClient)
	expenseHandler.RegisterRoutes(api.Group("/expense").Use(middleware.AuthMiddleware()))

	incomeHandler := income.NewHandler(mongoClient)
	incomeHandler.RegisterRoutes(api.Group("/income").Use(middleware.AuthMiddleware()))

	r.Run()
}
