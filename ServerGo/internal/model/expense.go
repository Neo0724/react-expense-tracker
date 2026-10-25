package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Expense struct {
	ID          bson.ObjectID `bson:"_id,omitempty"`
	Title       string        `bson:"title,omitempty"`
	Amount      float64       `bson:"amount,omitempty"`
	Type        string        `bson:"type,omitempty"`
	Date        string        `bson:"date,omitempty"`
	Category    string        `bson:"category,omitempty"`
	Description string        `bson:"description,omitempty"`
	UserOwner   bson.ObjectID `bson:"userOwner,omitempty"`
	CreatedAt   time.Time     `bson:"createdAt,omitempty"`
	UpdatedAt   time.Time     `bson:"updatedAt,omitempty"`
}
