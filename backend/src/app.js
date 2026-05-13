import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"; // Import morgan
import jwt from "jsonwebtoken";
import connectDB from "./db/dbConnect.js";
import { config } from "./config.js";
import authRouter from "./routes/authRouter.js";
import { User as userModel } from "./models/user/user.model.js";
const app = express();

// middlewares

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Be explicit
  credentials: true, // This is very often the fix for auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev")); // Add morgan here for request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();



app.use("/api/auth", authRouter);

app.get("/api/user/me", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await userModel.findById(decoded.id).select("name email avatar role createdAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error("Error loading user profile:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/*name", (req, res) => { res.sendFile(path.join(__dirname, "../../frontend/dist/index.html")) });

app.listen(config.PORT, () => console.log(`Server on PORT: ${config.PORT}`));
