// src/controllers/salaryController.js
import Employee from "../models/employeeModel.js";
import Salary from "../models/salaryModel.js";

export const paySalary = async (req, res) => {
  const { id } = req.params; // employee ID
  const { amount, month, year, notes } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valid amount required" });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if salary already paid for this month
    const existingSalary = await Salary.findOne({
      employeeId: id,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear()
    });

    if (existingSalary) {
      return res.status(400).json({ message: "Salary already paid for this month" });
    }

    if (amount > employee.pendingSalary) {
      return res.status(400).json({ message: "Amount exceeds pending salary" });
    }

    // Update employee salary fields
    employee.paidSalary += amount;
    employee.pendingSalary -= amount;
    await employee.save();

    // Create salary payment record
    const salaryRecord = await Salary.create({
      employeeId: id,
      employeeName: employee.name,
      amount: amount,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      status: "Paid",
      paidAt: new Date(),
      notes: notes || ""
    });

    res.json({
      message: "Salary paid successfully",
      employee: {
        name: employee.name,
        paidSalary: employee.paidSalary,
        pendingSalary: employee.pendingSalary
      },
      salaryRecord: salaryRecord
    });
  } catch (err) {
    console.error("Pay salary error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get salary history for an employee
export const getSalaryHistory = async (req, res) => {
  const { id } = req.params; // employee ID

  try {
    const salaryHistory = await Salary.find({ employeeId: id })
      .sort({ createdAt: -1 })
      .lean();
    
    // Add employee details to each record
    const employee = await Employee.findById(id).select('name email position');
    const historyWithEmployee = salaryHistory.map(record => ({
      ...record,
      employee: employee
    }));

    res.json(historyWithEmployee);
  } catch (err) {
    console.error("Get salary history error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all salary records with filters
export const getAllSalaryRecords = async (req, res) => {
  try {
    const { month, year, status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;

    const salaryRecords = await Salary.find(filter)
      .populate('employeeId', 'name email position department')
      .sort({ paidAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Salary.countDocuments(filter);

    res.json({
      salaryRecords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error("Get all salary records error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get salary record by ID
export const getSalaryRecordById = async (req, res) => {
  const { id } = req.params; // salary record ID

  try {
    const salaryRecord = await Salary.findById(id)
      .populate('employeeId', 'name email position department phone joiningDate')
      .lean();

    if (!salaryRecord) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.json(salaryRecord);
  } catch (err) {
    console.error("Get salary record error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update salary record
export const updateSalaryRecord = async (req, res) => {
  const { id } = req.params; // salary record ID
  const { amount, month, year, status, notes } = req.body;

  try {
    const salaryRecord = await Salary.findById(id);
    if (!salaryRecord) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    // If amount is being updated, adjust employee's salary records
    if (amount && amount !== salaryRecord.amount) {
      const employee = await Employee.findById(salaryRecord.employeeId);
      if (employee) {
        const amountDiff = amount - salaryRecord.amount;
        
        if (salaryRecord.status === "Paid") {
          employee.paidSalary += amountDiff;
          employee.pendingSalary -= amountDiff;
        } else {
          employee.pendingSalary += amountDiff;
        }
        
        await employee.save();
      }
    }

    // Update salary record
    const updatedRecord = await Salary.findByIdAndUpdate(
      id,
      {
        amount: amount || salaryRecord.amount,
        month: month || salaryRecord.month,
        year: year || salaryRecord.year,
        status: status || salaryRecord.status,
        notes: notes !== undefined ? notes : salaryRecord.notes
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email position department');

    res.json({
      message: "Salary record updated successfully",
      salaryRecord: updatedRecord
    });
  } catch (err) {
    console.error("Update salary record error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete salary record
export const deleteSalaryRecord = async (req, res) => {
  const { id } = req.params; // salary record ID

  try {
    const salaryRecord = await Salary.findById(id);
    if (!salaryRecord) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    // Adjust employee's salary records if the record was paid
    if (salaryRecord.status === "Paid") {
      const employee = await Employee.findById(salaryRecord.employeeId);
      if (employee) {
        employee.paidSalary -= salaryRecord.amount;
        employee.pendingSalary += salaryRecord.amount;
        await employee.save();
      }
    }

    await Salary.findByIdAndDelete(id);

    res.json({ message: "Salary record deleted successfully" });
  } catch (err) {
    console.error("Delete salary record error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get salary statistics
export const getSalaryStatistics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Total paid this month
    const monthlyTotal = await Salary.aggregate([
      {
        $match: {
          year: currentYear,
          month: currentMonth,
          status: "Paid"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Total paid this year
    const yearlyTotal = await Salary.aggregate([
      {
        $match: {
          year: currentYear,
          status: "Paid"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Monthly breakdown for current year
    const monthlyBreakdown = await Salary.aggregate([
      {
        $match: {
          year: currentYear,
          status: "Paid"
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      monthlyTotal: monthlyTotal[0]?.total || 0,
      yearlyTotal: yearlyTotal[0]?.total || 0,
      monthlyBreakdown
    });
  } catch (err) {
    console.error("Get salary statistics error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get pending salaries
export const getPendingSalaries = async (req, res) => {
  try {
    // Get employees with pending salaries
    const employeesWithPendingSalaries = await Employee.find({
      pendingSalary: { $gt: 0 }
    }).select('name email position department pendingSalary paidSalary salary');

    // Get pending salary records
    const pendingSalaryRecords = await Salary.find({
      status: "Pending"
    }).populate('employeeId', 'name email position');

    res.json({
      success: true,
      count: employeesWithPendingSalaries.length,
      employees: employeesWithPendingSalaries,
      pendingRecords: pendingSalaryRecords
    });
  } catch (err) {
    console.error('Error fetching pending salaries:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching pending salaries",
      error: err.message
    });
  }
};