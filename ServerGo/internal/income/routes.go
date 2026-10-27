package income

import (
	"log"
	"net/http"
	"time"

	"github.com/Neo0724/intermediateExpenseTracker/internal/model"
	"github.com/Neo0724/intermediateExpenseTracker/internal/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func (h *Handler) RegisterRoutes(rg gin.IRoutes) {
	rg.POST("/add-income", h.addIncome)
	rg.GET("/get-income/:month/:year/:type", h.getIncome)
	rg.DELETE("/delete-income/:id", h.deleteIncome)
}

func (h *Handler) addIncome(c *gin.Context) {
	incomeDb := h.db.Collection("incomes")
	userDb := h.db.Collection("users")

	var req model.AddIncomeRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	if req.Type == "" {
		req.Type = "expenses"
	}

	if req.Description == "" {
		req.Description = "-"
	}

	userId, err := bson.ObjectIDFromHex(c.GetString("userId"))

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	user := userDb.FindOne(c.Request.Context(), bson.D{{Key: "_id", Value: userId}})

	if user.Err() != nil {
		if user.Err() == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, model.Response{
				Success: false,
				Error:   "UserID not found",
			})
			return
		}
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   user.Err().Error(),
		})
		return
	}

	income := model.Income{
		Title:       req.Title,
		Category:    req.Category,
		Amount:      req.Amount,
		Type:        req.Type,
		Date:        req.Date,
		Description: req.Description,
		UserOwner:   userId,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	res, err := incomeDb.InsertOne(c.Request.Context(), income)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data:    res,
	})

}

func (h *Handler) getIncome(c *gin.Context) {
	ctx := c.Request.Context()
	incomeDb := h.db.Collection("incomes")

	month := c.Param("month")
	year := c.Param("year")
	incomeType := c.Param("type")

	userId, err := bson.ObjectIDFromHex(c.GetString("userId"))

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	loc, err := utils.RetrieveLocation()

	if err != nil {
		log.Fatalf(err.Error())
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	var expenseFilterPipeline mongo.Pipeline

	var dateFilter bson.E = utils.GetFilterDateBson(month, year, loc)
	var typeFilter bson.E

	if incomeType != "all" {
		typeFilter = bson.E{
			Key:   "category",
			Value: incomeType,
		}
	}

	matchCriteria := bson.D{
		{Key: "userOwner", Value: userId},
	}

	if dateFilter != (bson.E{}) {
		matchCriteria = append(matchCriteria, dateFilter)
	}

	if typeFilter != (bson.E{}) {
		matchCriteria = append(matchCriteria, typeFilter)
	}

	matchFilter := bson.D{
		{Key: "$match", Value: matchCriteria},
	}

	userIdToStringFilter := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "userOwnerStr", Value: bson.D{
				{Key: "$toString", Value: "$userOwner"},
			}},
		}},
	}

	sort := bson.D{
		{Key: "$sort", Value: bson.D{
			{Key: "date", Value: -1},
		}},
	}

	expenseFilterPipeline = append(expenseFilterPipeline, matchFilter, userIdToStringFilter, sort)

	log.Println(expenseFilterPipeline)

	cursor, err := incomeDb.Aggregate(ctx, expenseFilterPipeline)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	var incomeResults []model.Income = []model.Income{}

	if err = cursor.All(ctx, &incomeResults); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data:    incomeResults,
	})
}

func (h *Handler) deleteIncome(c *gin.Context) {
	ctx := c.Request.Context()

	incomeDb := h.db.Collection("incomes")

	id := c.Param("id")

	objId, err := bson.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   "Invalid income ID",
		})
		return
	}

	filter := bson.D{
		{Key: "_id", Value: objId},
	}

	res, err := incomeDb.DeleteOne(ctx, filter)

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data:    res,
	})
}
