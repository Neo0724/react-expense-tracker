package middleware

import (
	"net/http"
	"strings"

	"github.com/Neo0724/intermediateExpenseTracker/internal/model"
	"github.com/Neo0724/intermediateExpenseTracker/internal/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorizationHeader := c.Request.Header.Get("Authorization")

		tokenArr := strings.Split(authorizationHeader, " ")

		if len(tokenArr) < 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, model.Response{
				Success: false,
				Error:   "Token is invalid",
			})
			return
		}

		token := tokenArr[1]

		claims, err := utils.Validate(token)

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
