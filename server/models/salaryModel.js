// src/models/salaryModel.js
import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Paid"
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "Cash", "Cheque", "Online"],
    default: "Bank Transfer"
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, { 
  timestamps: true 
});

// Compound index for unique salary per employee per month
salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

// Check if model already exists before compiling
const Salary = mongoose.models.Salary || mongoose.model("Salary", salarySchema);

export default Salary;