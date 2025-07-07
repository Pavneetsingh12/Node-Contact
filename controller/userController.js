const AsyncHandler = require("express-async-handler");
const user = require("../model/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//@des Register a user
//@route post /api/user/register
//@access Public
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate user input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  const accessToken = jwt.sign(
  {
    id: user.id,
    name: user.name,
    email: user.email,
  },
  process.env.ACCESS_TOKEN,
  { expiresIn: "1m" }
);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
  });
});


//@desc Get current user
//@route GET /api/user/current
//@access Private
const getCurrentUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
  });
}); 

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};