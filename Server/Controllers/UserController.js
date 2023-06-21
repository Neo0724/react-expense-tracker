const UserModel = require("../Models/UserSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRegister = async (req, res) => {
  const { username, password } = req.body;

  const existed = await UserModel.findOne({ username: username });

  if (existed) {
    return res.status(400).json(existed);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "Register Success" });
  } catch (err) {
    console.log(err);
  }
};

const UserLogin = async (req, res) => {
  const { username, password } = req.body;

  const userExist = await UserModel.findOne({ username });

  if (!userExist) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, userExist.password);

  if (passwordMatch) {
    const token = jwt.sign({ id: userExist._id }, "secret");
    return res.json({ token, userID: userExist._id, userName: username });
  }

  return res.status(400).json({ message: "Password does not match" });
};

const VerifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401)
  }
};

exports.VerifyToken = VerifyToken
exports.UserRegister = UserRegister;
exports.UserLogin = UserLogin;
