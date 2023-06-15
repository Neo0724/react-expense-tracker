const express = require("express");
const UserRouter = express.Router();
const { UserRegister } = require("../Controllers/UserController.js")
const { UserLogin } = require("../Controllers/UserController.js")

UserRouter.post("/register", UserRegister);

UserRouter.post("/login", UserLogin);

module.exports = UserRouter;
