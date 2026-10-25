package expense

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/Neo0724/intermediateExpenseTracker/internal/model"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func RegisterRoutes(rg *gin.RouterGroup) {

}

func (h *Handler) addExpense(c *gin.Context) {

}

func (h *Handler) deleteExpense(c *gin.Context) {

}

// "/get-expense/:id/:month/:year/:type",
func (h *Handler) getExpense(c *gin.Context) {
	expenseDb := h.db.Collection("expenses")

	id := c.Param("id")
	month := c.Param("month")
	year := c.Param("year")
	expenseType := c.Param("type")

	userHexId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   "Invalid UserID",
		})
		return
	}

	loc, err := time.LoadLocation("Asia/Kuala_Lumpur")

	if err != nil {
		log.Fatalf("Failed to load location: %v", err)
		c.JSON(http.StatusInternalServerError, model.Response{
			Success: false,
			Data:    nil,
			Error:   "Failed to load location",
		})
		return
	}

	var startMonth int
	var startYear int
	var endMonth int
	var endYear int

	parsedMonth, monthErr := strconv.Atoi(month)
	parsedYear, yearErr := strconv.Atoi(year)

	expenseFilter := bson.D{{Key: "$and", Value: bson.A{
		bson.D{{Key: "userOwner", Value: userHexId}},
	}}}

	var dateFilter bson.D = bson.D{}

	if monthErr == nil && yearErr == nil {
		// Handle filter by month and year
		startDate := time.Date(
			parsedYear,
			time.Month(parsedMonth),
			1,
			0,
			0,
			0,
			0,
			loc,
		)
		endDate := startDate.AddDate(0, 1, 0)

		startStr := startDate.In(loc).Format(time.RFC3339)
		endStr := endDate.In(loc).Format(time.RFC3339)

		dateFilter = append(dateFilter, bson.E{
			Key: "date",
			Value: bson.D{
				{Key: "$gte", Value: startStr},
				{Key: "$lte", Value: endStr},
			},
		})


	} else if (monthErr != nil && yearErr == nil) {
		// Do not filter by month, only filter by year
		// All month and specific year
		startDate := time.Date(parsedYear, 1, 1, 0, 0, 0, 0, loc)
		endDate := startDate.AddDate(1, 0, 0)

		startStr := startDate.In(loc).Format(time.RFC3339)
		endStr := endDate.In(loc).Format(time.RFC3339)

		dateFilter = append(dateFilter, bson.E{
			Key: "date",
			Value: bson.D{
				{Key: "$gte", Value: startStr},
				{Key: "$lt", Value: endStr},
			},
		})
	}  else if (monthErr == nil && yearErr != nil) {
		// Do not filter by year, only filter by month
		// All year and specific month
		dateFilter = append(dateFilter, bson.E{
			Key: "$expr",
			Value: bson.D{
				{Key: "$eq", Value: bson.A{
					bson.D{
						{Key: "$month", Value: bson.D{
							{Key: "date", Value: bson.D{
								{Key: "$dateFromString", Value: bson.D{
									{Key: "dateString", Value: "$" + "date"},
								}},
							}},
							{Key: "timezone", Value: "+08:00"},
						}},
					},
					parsedMonth, 
				}},
			},
		})

	}


	var expenseResult model.Expense

	err = expenseDb.FindOne(context.TODO(), expenseFilter).Decode(&expenseResult)

	if err != nil {
		c.JSON(http.StatusBadRequest, model.Response{
			Success: false,
			Data:    nil,
			Error:   err.Error(),
		})
		return
	}

}

// "/get-history/:id/:month/:year",
func (h *Handler) getExpenseHistory(c *gin.Context) {

}
