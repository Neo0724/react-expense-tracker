package middleware

import (
	"net/http"

	"github.com/Neo0724/intermediateExpenseTracker/internal/model"
	"github.com/Neo0724/intermediateExpenseTracker/internal/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, model.Response{
				Success: false,
				Error:   "Token not found",
			})
			return
		}

		claims, err := utils.Validate(accessToken)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, model.Response{
				Success: false,
				Error:   "Token is invalid or expired",
			})
			return
		}

		c.Set("userId", claims.UserId)
		c.Set("username", claims.Username)

		c.Next()
	}
}
