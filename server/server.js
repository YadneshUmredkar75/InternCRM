// server.js or index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Counter from "./models/counter.js"; // ← Must import

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import salaryRoute from "./routes/salaryRoute.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentRoutes from "./routes/student.routes.js";
import Course from "./routes/courses.js";
import clientRoutes from "./routes/clientRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

dotenv.config();

// CONNECT DB FIRST
connectDB();

// INITIALIZE COUNTER AFTER DB IS CONNECTED
const initCounter = async () => {
  try {
    const counter = await Counter.findOne({ _id: "client_project_number" });
    if (!counter) {
      await Counter.create({ _id: "client_project_number", seq: 1000 });
      console.log("Counter initialized → Next project: PROJ-000001");
    } else {
      console.log(`Counter exists → Next project: PROJ-${String(counter.seq + 1).padStart(6, "0")}`);
    }
  } catch (err) {
    console.error("Failed to initialize counter:", err);
  }
};

initCounter(); // ← Now safe to call

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/lead", leadRoutes);
app.use("/api/salary", salaryRoute);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/courses", Course);
app.use("/api/expenses", expenseRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/leaves", leaveRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});