package utils

import (
	"fmt"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

func RetrieveLocation() (*time.Location, error) {
	loc, err := time.LoadLocation("Asia/Kuala_Lumpur")

	if err != nil {
		return nil, fmt.Errorf("failed to load location: %w", err)
	}

	return loc, err
}

func GetFilterDateBson(month string, year string, loc *time.Location) bson.E {
	var dateFilter bson.E

	parsedMonth, monthErr := strconv.Atoi(month)
	parsedYear, yearErr := strconv.Atoi(year)

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

		dateFilter = bson.E{
			Key: "date",
			Value: bson.D{
				{Key: "$gte", Value: startDate},
				{Key: "$lte", Value: endDate},
			},
		}

	} else if monthErr != nil && yearErr == nil {
		// All month and specific year
		dateFilter = bson.E{
			Key: "$expr",
			Value: bson.D{
				{
					Key: "$eq",
					Value: bson.A{
						bson.D{
							{Key: "$year", Value: "$date"},
						},
						parsedYear,
					},
				},
			},
		}
	} else if monthErr == nil && yearErr != nil {
		// All year and specific month
		dateFilter = bson.E{
			Key: "$expr",
			Value: bson.D{
				{Key: "$eq", Value: bson.A{
					bson.D{
						{Key: "$month", Value: "$date"},
					},
					parsedMonth,
				}},
			},
		}
	}

	return dateFilter
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func ValidatePasswordHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func ExpenseIncomeProjection() bson.D {
	return bson.D{
		{
			Key: "$project", Value: bson.D{
				{Key: "_id", Value: 1},
				{Key: "title", Value: 1},
				{Key: "amount", Value: 1},
				{Key: "type", Value: 1},
				{Key: "date", Value: 1},
				{Key: "category", Value: 1},
				{Key: "description", Value: 1},
			},
		},
	}
}
