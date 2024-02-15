const User = require("../model/userModel");
const Account = require("../model/accountModel");
const bcrypt = require("bcryptjs");
const {
  generateAccountNumber,
  generatePin,
  generateToken,
} = require("../utils/helper");
const jwt = require("jsonwebtoken");
const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });

    // create the account
    // user

    const account = await Account.create({
      user: user._id,
      accountNumber: generateAccountNumber(),
      pin: generatePin(),
    });
    // set cookie after registering the user
    const token = generateToken(user._id);
    res.cookie("jwt", token);
    res.status(201).json({ user, account });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

// clear users
const clearUsers = async (req, res) => {
  await User.deleteMany();

  res.json({ message: "databbase cleared" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    // compare the  password
    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // set cookies
    res.cookie("jwt", token);
    // send back user
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

const logoutUser = (req, res) => {
  res.cookie("jwt", " ", { maxAge: 1 });
  return res.json({ message: "user logged out" });
};

const getProfile = (req, res) => {
  res.json(req.user);
};
module.exports = {
  getUsers,
  createUser,
  clearUsers,
  loginUser,
  logoutUser,
  getProfile,
};
