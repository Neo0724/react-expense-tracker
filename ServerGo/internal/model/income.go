package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Income struct {
	ID           bson.ObjectID `json:"_id" bson:"_id,omitempty"`
	Title        string        `json:"title" bson:"title,omitempty"`
	Amount       float64       `json:"amount" bson:"amount,omitempty"`
	Type         string        `json:"type" bson:"type,omitempty"`
	Date         time.Time     `json:"date" bson:"date,omitempty"`
	Category     string        `json:"category" bson:"category,omitempty"`
	Description  string        `json:"description" bson:"description,omitempty"`
	UserOwner    bson.ObjectID `json:"userOwner" bson:"userOwner,omitempty"`
	UserOwnerStr string        `json:"userOwnerStr" bson:"userOwnerStr,omitempty"`
	CreatedAt    time.Time     `json:"createdAt" bson:"createdAt,omitempty"`
	UpdatedAt    time.Time     `json:"updatedAt" bson:"updatedAt,omitempty"`
}

type AddIncomeRequest struct {
	Title       string        `json:"title" binding:"required"`
	Amount      float64       `json:"amount" binding:"required"`
	Type        string        `json:"type"`
	Date        time.Time     `json:"date" binding:"required"`
	Category    string        `json:"category" binding:"required"`
	Description string        `json:"description"`
	UserOwner   bson.ObjectID `json:"userOwner"`
}
