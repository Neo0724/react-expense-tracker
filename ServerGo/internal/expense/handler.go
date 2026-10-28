package expense

import (
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Handler struct {
	db *mongo.Database
}

func NewHandler(db *mongo.Client) *Handler {
	return &Handler{db: db.Database("expenseTracker")}
}
