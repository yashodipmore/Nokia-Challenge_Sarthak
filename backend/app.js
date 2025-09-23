import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors({
origin: process.env.FRONTEND_URL,
credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
res.json({
message: "Welcome to Loan Application API",
version: "1.0.0",
endpoints: {
user: {
register: "POST /api/auth/register",
login: "POST /api/auth/login",
profile: "GET /api/auth/profile",
submitApplication: "POST /api/applications/submit",
myApplications: "GET /api/applications/my-applications"
},
admin: {
login: "POST /api/admin/login",
dashboard: "GET /api/admin/dashboard/stats",
allApplications: "GET /api/applications/admin/all",
users: "GET /api/admin/users"
}
}
});
});

// Error handler
app.use(errorHandler);

export default app;
