const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const bcryptjs = require("bcryptjs");
const bodyParser = require("body-parser");
const usersRouter = require("./routers/usersRouter");
const paymentRouter = require("./routers/paymentRouter");
const userModel = require("./models/user.model");
const statictisRouter = require("./routers/statictisRouter");
dotenv.config();
connectDB();

const app = express();
// Xử lý CORS
app.use(cors());

// Xử lý JSON và form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/payments", paymentRouter);
app.use("api/statictis", statictisRouter);


app.use("/api/all",async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại!" });
      }
})
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});