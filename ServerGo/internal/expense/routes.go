package expense

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
	rg.GET("/get-expense/:month/:year/:type", h.getExpense)
	rg.GET("/get-history/:month/:year", h.getExpenseHistory)
	rg.DELETE("/delete-expense/:id", h.deleteExpense)
	rg.POST("/add-expense", h.addExpense)
}

func (h *Handler) addExpense(c *gin.Context) {
	ctx := c.Request.Context()

	expenseDb := h.db.Collection("expenses")
	userDb := h.db.Collection("users")

	var req model.AddExpenseRequest

	if err := c.ShouldBindJSON(&req); err != nil {
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

	user := userDb.FindOne(ctx, bson.D{{Key: "_id", Value: userId}})

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

	expense := model.Expense{
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

	res, err := expenseDb.InsertOne(ctx, expense)

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

// "/delete-expense/:id"
func (h *Handler) deleteExpense(c *gin.Context) {
	ctx := c.Request.Context()

	expenseDb := h.db.Collection("expenses")

	id := c.Param("id")

	objId, err := bson.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   "Invalid expense ID",
		})
		return
	}

	filter := bson.D{
		{Key: "_id", Value: objId},
	}

	res, err := expenseDb.DeleteOne(ctx, filter)

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

func (h *Handler) getExpense(c *gin.Context) {
	ctx := c.Request.Context()
	expenseDb := h.db.Collection("expenses")

	month := c.Param("month")
	year := c.Param("year")
	expenseType := c.Param("type")

	userId, err := bson.ObjectIDFromHex(c.GetString("userId"))

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   "Invalid UserID",
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

	if expenseType != "all" {
		typeFilter = bson.E{
			Key:   "category",
			Value: expenseType,
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

	var userIdToStringFilter bson.D = bson.D{{
		Key: "$set",
		Value: bson.D{
			{
				Key: "userOwnerStr",
				Value: bson.D{
					{
						Key:   "$toString",
						Value: "$userOwner",
					},
				},
			},
		},
	}}

	sort := bson.D{
		{Key: "$sort", Value: bson.D{
			{Key: "date", Value: -1},
		}},
	}

	expenseFilterPipeline = append(expenseFilterPipeline, matchFilter, userIdToStringFilter, sort)

	cursor, err := expenseDb.Aggregate(ctx, expenseFilterPipeline)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	var expenseResults []model.Expense

	if err = cursor.All(ctx, &expenseResults); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data:    expenseResults,
	})

}

func (h *Handler) getExpenseHistory(c *gin.Context) {
	ctx := c.Request.Context()
	expenseDb := h.db.Collection("expenses")

	month := c.Param("month")
	year := c.Param("year")

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
		log.Fatalf("E")
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	var joinIncomeFilter bson.D = bson.D{
		bson.E{
			Key: "$unionWith",
			Value: bson.D{
				bson.E{
					Key:   "coll",
					Value: "incomes",
				},
			},
		},
	}

	var userIdToStringFilter bson.D = bson.D{{
		Key: "$set",
		Value: bson.D{
			{
				Key: "userOwnerStr",
				Value: bson.D{
					{
						Key:   "$toString",
						Value: "$userOwner",
					},
				},
			},
		},
	}}

	var dateFilter bson.E = utils.GetFilterDateBson(month, year, loc)

	matchCriterias := bson.A{
		bson.D{{Key: "userOwner", Value: userId}},
	}

	if dateFilter != (bson.E{}) {
		matchCriterias = append(matchCriterias, bson.D{dateFilter})
	}

	matchFilter := bson.D{
		{Key: "$match", Value: bson.D{
			{
				Key:   "$and",
				Value: matchCriterias,
			},
		}},
	}

	sort := bson.D{
		{Key: "$sort", Value: bson.D{
			{
				Key:   "date",
				Value: -1,
			},
		}},
	}

	limit := bson.D{
		{Key: "$limit", Value: 3},
	}

	var historyFilterPipeline mongo.Pipeline

	historyFilterPipeline = append(historyFilterPipeline, joinIncomeFilter, matchFilter, userIdToStringFilter, sort, limit)

	log.Println(historyFilterPipeline)

	cursor, err := expenseDb.Aggregate(ctx, historyFilterPipeline)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	var historyResults []model.Expense = []model.Expense{}

	if err = cursor.All(ctx, &historyResults); err != nil {
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.Response{
		Success: true,
		Data:    historyResults,
	})
}
