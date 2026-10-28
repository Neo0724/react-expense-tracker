package main

import (
	"context"
	"log"
	"os"

	"github.com/Neo0724/intermediateExpenseTracker/internal/auth"
	"github.com/Neo0724/intermediateExpenseTracker/internal/expense"
	"github.com/Neo0724/intermediateExpenseTracker/internal/income"
	"github.com/Neo0724/intermediateExpenseTracker/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func initializeDb() *mongo.Client {
	if loadErr := godotenv.Load(); loadErr != nil {
		log.Println("No .env file found or error reading it in initializeDb():", loadErr)
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

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:5173", "http://expense-tracker-frontend:5173"} // Your React app origin
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true

	r.Use(cors.New(config))

	api := r.Group("/api/v1")

	authHandler := auth.NewHandler(mongoClient)
	authHandler.RegisterRoutes(api.Group("/auth"))

	expenseHandler := expense.NewHandler(mongoClient)
	expenseHandler.RegisterRoutes(api.Group("/expense").Use(middleware.AuthMiddleware()))

	incomeHandler := income.NewHandler(mongoClient)
	incomeHandler.RegisterRoutes(api.Group("/income").Use(middleware.AuthMiddleware()))

	r.Run()
}
