package auth

import (
	"log"
	"net/http"
	"time"

	"github.com/Neo0724/intermediateExpenseTracker/internal/middleware"
	"github.com/Neo0724/intermediateExpenseTracker/internal/model"
	"github.com/Neo0724/intermediateExpenseTracker/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/login", h.login)
	rg.POST("/register", h.register)
	rg.Use(middleware.AuthMiddleware()).GET("/refresh", h.refresh)
}

func (h *Handler) login(c *gin.Context) {
	userDb := h.db.Collection("users")

	var req model.User

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	var user model.User

	res := userDb.FindOne(c.Request.Context(), bson.D{{Key: "username", Value: req.Username}})

	if res.Err() != nil {
		if res.Err() == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, model.Response{
				Success: false,
				Error:   "Username not found",
			})
		} else {
			c.JSON(http.StatusNotFound, model.Response{
				Success: false,
				Error:   res.Err().Error(),
			})
		}
		return
	}

	decodeErr := res.Decode(&user)

	if decodeErr != nil {
		c.JSON(http.StatusNotFound, model.Response{
			Success: false,
			Error:   decodeErr.Error(),
		})
		return
	}

	passwordMatched := utils.ValidatePasswordHash(req.Password, user.Password)

	if !passwordMatched {
		c.JSON(http.StatusNotFound, model.Response{
			Success: false,
			Error:   "Password not matched",
		})
		return
	}

	log.Println(user)

	accessToken, err := utils.CreateJWTToken(user.Username, user.ID.Hex(), 30*time.Minute)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	refreshToken, err := utils.CreateJWTToken(user.Username, user.ID.Hex(), 24*7*time.Hour)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.SetCookie(
		"refresh_token",
		refreshToken,
		604800,
		"/api/v1/auth",
		"localhost",
		true,
		true,
	)

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data: model.LoginUser{
			Username:    user.Username,
			AccessToken: accessToken,
		},
	})
}

func (h *Handler) register(c *gin.Context) {
	userDb := h.db.Collection("users")

	var req model.User

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	// Check for duplicated username
	res := userDb.FindOne(c.Request.Context(), bson.D{{Key: "username", Value: req.Username}})

	// Username exists
	if res.Err() == nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   "Duplicated username",
		})
		return
	}

	hashedPass, err := utils.HashPassword(req.Password)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	req.Password = hashedPass

	newUser, insertErr := userDb.InsertOne(c.Request.Context(), req)

	if insertErr != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   insertErr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data:    newUser,
	})
}

func (h *Handler) refresh(c *gin.Context) {
	userId := c.GetString("userId")
	username := c.GetString("username")

	newAccessToken, err := utils.CreateJWTToken(username, userId, 30*time.Minute)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	newRefreshToken, err := utils.CreateJWTToken(username, userId, 24*7*time.Hour)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	utils.SetRefreshCookie(c, newRefreshToken)

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data: model.NewTokens{
			AccessToken: newAccessToken,
		},
	})
}
