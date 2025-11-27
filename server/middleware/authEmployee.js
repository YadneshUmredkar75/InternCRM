// src/middleware/authEmployee.js
import jwt from "jsonwebtoken";
import Employee from "../models/employeeModel.js";

export const protectEmployee = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, no token provided" 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "employee_secret_key_2024");
      
      const employee = await Employee.findById(decoded.id).select("-password");
      if (!employee) {
        return res.status(401).json({ 
          success: false,
          message: "Not authorized, employee not found" 
        });
      }

      if (employee.status !== "Active") {
        return res.status(401).json({ 
          success: false,
          message: "Account is inactive. Please contact administrator." 
        });
      }

      req.employee = employee;
      req.employeeId = employee._id;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, invalid token" 
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error in authentication" 
    });
  }
};