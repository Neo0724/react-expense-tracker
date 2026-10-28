package utils

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type UserJWTClaims struct {
	UserId   string
	Username string
	jwt.RegisteredClaims
}

func getSecret() (string, error) {
	if err := godotenv.Load(); err != nil {
		log.Fatal("No .env file found or error reading it:", err)
		return "", err
	}

	var secret string = ""

	if secret = os.Getenv("JWT_SECRET"); secret == "" {
		log.Fatal("You must provide a JWT Secret")
		return "", errors.New("JWT_SECRET environment variable is not set")
	}

	return secret, nil
}

func CreateJWTToken(username string, userId string, exp time.Duration) (string, error) {
	claims := UserJWTClaims{
		userId,
		username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(exp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "server",
			Subject:   "jwt_token",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secret, err := getSecret()

	if err != nil {
		return "", err
	}

	return token.SignedString([]byte(secret))
}

func Validate(tokenString string) (*UserJWTClaims, error) {
	secret, err := getSecret()

	if err != nil {
		return nil, err
	}

	token, err := jwt.ParseWithClaims(tokenString, &UserJWTClaims{}, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil {
		return nil, err
	}

	claims := token.Claims.(*UserJWTClaims)

	return claims, nil
}

func SetTokenCookie(c *gin.Context, refreshToken string, accessToken string) {
	c.SetCookie(
		"refresh_token",
		refreshToken,
		604800,
		"/api/v1/auth/refresh",
		"localhost",
		true,
		true,
	)
	c.SetCookie(
		"access_token",
		accessToken,
		1800,
		"/api/v1/",
		"localhost",
		true,
		true,
	)
}

func UnsetTokenCookie(c *gin.Context) {
	c.SetCookie(
		"refresh_token",
		"",
		-1,
		"/api/v1/auth/refresh",
		"localhost",
		true,
		true,
	)
	c.SetCookie(
		"access_token",
		"",
		-1,
		"/api/v1/",
		"localhost",
		true,
		true,
	)
}
