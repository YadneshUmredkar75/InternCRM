// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },

    category: {
      type: String,
      enum: ["Travel", "Food", "Office Supplies", "Accommodation","Training","Miscellaneous", "Other"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    date: { type: Date, required: true },

    receipt: {
      type: String, // URL or file path
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },

    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    paidAt: { type: Date },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },

    rejectionReason: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);