package auth

import "github.com/gin-gonic/gin"

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/login", h.login)
	rg.POST("/register", h.register)
}

func (h *Handler) login(c *gin.Context) {

}

func (h *Handler) register(c *gin.Context) {

}
