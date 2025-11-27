import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  selectedCourse: {
    type: String,
    required: [true, 'Course selection is required']
  },
  courseName: {
    type: String,
    required: true
  },
  totalFees: {
    type: Number,
    required: [true, 'Total fees is required'],
    min: 0
  },
  paidFees: {
    type: Number,
    default: 0,
    min: 0
  },
  pendingFees: {
    type: Number,
    default: 0,
    min: 0
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Calculate pending fees before saving
studentSchema.pre('save', function (next) {
  this.pendingFees = this.totalFees - this.paidFees;
  next();
});

// Static method to search students
studentSchema.statics.searchStudents = function (query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
      { courseName: { $regex: query, $options: 'i' } }
    ]
  });
};

export default mongoose.model('Student', studentSchema);