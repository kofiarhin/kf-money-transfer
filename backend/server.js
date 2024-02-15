const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const transferRoutes = require("./routes/transferRoutes");
const accountRoutes = require("./routes/accountRoutes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// conect to database
connectDB();
app.use(cookieParser());
// setup middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up routes
app.use("/users", userRoutes);
app.use("/transfer", transferRoutes);
app.use("/accounts", accountRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server started"));
