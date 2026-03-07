import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ----------------- DATABASE CONNECTION ----------------- */
connectDB();

/* ----------------- MIDDLEWARE ----------------- */
app.use(cors());
app.use(express.json());

/* ----------------- ROUTES ----------------- */

app.get("/", (req, res) => {
  res.send("Home page");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send("Welcome to home page");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  res.json({ msg: "Successfully Registered" });
});

/* ----------------- 404 HANDLER ----------------- */

app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

/* ----------------- SERVER ----------------- */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});