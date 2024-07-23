const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

const SECRET = "bearer"; // This should be in the dotenv file, rn I am keeping it here.

loginRouter.post("/login", async (request, response) => {
  try {
    const { emailOrPhone, password } = request.body;
    console.log(request.body);
    var user = await User.findOne({ email: emailOrPhone });
    if (user == null) {
      user = await User.findOne({ phoneNumber: emailOrPhone });
    }
    console.log("Received credentials:", emailOrPhone, password);
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "Invalid email or password",
      });
    }

    const userForToken = {
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstname: user.firstName,
      lastname: user.lastName,
      image: user.image,
    };

    const token = jwt.sign(userForToken, SECRET);

    response.status(200).send({ token, id: user._id });
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = loginRouter;
