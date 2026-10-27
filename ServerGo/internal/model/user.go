package model

import "go.mongodb.org/mongo-driver/v2/bson"

type LoginUser struct {
	Username string `json:"username" binding:"required" bson:"username,omitempty"`
	NewTokens
}

type User struct {
	ID       bson.ObjectID `bson:"_id"`
	Username string        `json:"username" binding:"required" bson:"username,omitempty"`
	Password string        `json:"password" binding:"required" bson:"password,omitempty"`
}
