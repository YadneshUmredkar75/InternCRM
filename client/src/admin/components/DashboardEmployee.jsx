import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

const DashboardEmployee = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const menuItems = [
    { path: "/employee/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/employee/students", label: "Students", icon: "🎓" },
    { path: "/employee/courses", label: "Courses", icon: "📚" },
    { path: "/employee/attendance", label: "Attendance", icon: "✅" },
    { path: "/employee/grading", label: "Grading", icon: "📝" },
    { path: "/employee/schedule", label: "Schedule", icon: "📅" },
    { path: "/employee/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-purple-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Employee Portal</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-purple-700">
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center p-4 hover:bg-purple-700 ${location.pathname === item.path ? "bg-purple-900" : ""}`}>
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || "Employee Dashboard"}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Dr. Smith (Professor)</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<EmployeeOverview />} />
            <Route path="/dashboard" element={<EmployeeOverview />} />
            <Route path="/students" element={<EmployeeStudents />} />
            <Route path="/courses" element={<EmployeeCourses />} />
            <Route path="/attendance" element={<EmployeeAttendance />} />
            <Route path="/grading" element={<EmployeeGrading />} />
            <Route path="/schedule" element={<EmployeeSchedule />} />
            <Route path="/settings" element={<EmployeeSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Employee Dashboard Components
const EmployeeOverview = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Employee Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Total Students</h3>
        <p className="text-3xl font-bold text-blue-600">120</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Courses Teaching</h3>
        <p className="text-3xl font-bold text-green-600">4</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-600">Pending Grading</h3>
        <p className="text-3xl font-bold text-orange-600">23</p>
      </div>
    </div>
  </div>
);

const EmployeeStudents = () => <div><h2 className="text-2xl font-bold mb-6">Student Management</h2></div>;
const EmployeeCourses = () => <div><h2 className="text-2xl font-bold mb-6">Course Management</h2></div>;
const EmployeeAttendance = () => <div><h2 className="text-2xl font-bold mb-6">Attendance Management</h2></div>;
const EmployeeGrading = () => <div><h2 className="text-2xl font-bold mb-6">Grading System</h2></div>;
const EmployeeSchedule = () => <div><h2 className="text-2xl font-bold mb-6">Teaching Schedule</h2></div>;
const EmployeeSettings = () => <div><h2 className="text-2xl font-bold mb-6">Employee Settings</h2></div>;

export default DashboardEmployee;