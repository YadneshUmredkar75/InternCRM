// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: String,
  date: { type: Date, required: true },
  clockIn: Date,
  clockOut: Date,
  hoursWorked: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Present", "Absent", "Half Day", "Late"],
    default: "Present",
  },
  location: {
  name: { type: String, default: "Office" },
  coordinates: {
    type: [Number],   
    required: true
  },
  distanceFromOffice: { type: Number, default: 0 }
},

}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Correct: Add as a METHOD (instance method)
attendanceSchema.methods.calculateHours = function() {
  if (!this.clockIn || !this.clockOut) return 0;

  const diffMs = this.clockOut - this.clockIn;
  const diffHours = diffMs / (1000 * 60 * 60); // milliseconds to hours
  return Math.round(diffHours * 100) / 100; // round to 2 decimal places
};

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;