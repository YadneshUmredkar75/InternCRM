// src/admin/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";

// SVG Icons
const DashboardIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10" />
    </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BookIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CurrencyIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
);

const ProjectIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
);

const ClientIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ChartIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const BellIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.11 1 1 0 00-.68-1.15 1 1 0 00-1.22.7A7.97 7.97 0 008 12a7.97 7.97 0 004.38 7.13 1 1 0 001.35-.63 1 1 0 00-.56-1.3 5.99 5.99 0 01-3.93-8.64z" />
    </svg>
);

// Graph Components with error handling
const BarChart = ({ data, title, color = "blue" }) => {
    // Add default data if not provided
    const chartData = data || { labels: [], values: [] };
    const maxValue = Math.max(...(chartData.values.length ? chartData.values : [1]));
    const colors = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500"
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-end justify-between h-48">
                {chartData.labels.map((label, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="text-xs text-gray-600 mb-2 text-center">{label}</div>
                        <div
                            className={`w-full ${colors[color]} rounded-t transition-all duration-500 hover:opacity-80`}
                            style={{ height: `${(chartData.values[index] / maxValue) * 90}%` }}
                        ></div>
                        <div className="text-xs font-semibold text-gray-800 mt-2">
                            {chartData.values[index]}
                        </div>
                    </div>
                ))}
                {chartData.labels.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

const LineChart = ({ data, title, color = "blue" }) => {
    const chartData = data || { labels: [], values: [] };
    const maxValue = Math.max(...(chartData.values.length ? chartData.values : [1]));
    const points = chartData.values.map((value, index) => ({
        x: (index / (chartData.values.length - 1 || 1)) * 100,
        y: 100 - (value / maxValue) * 100
    }));

    const pathData = points.map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    const strokeColors = {
        blue: "#3B82F6",
        green: "#10B981",
        purple: "#8B5CF6",
        orange: "#F97316"
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="h-48 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="#E5E7EB"
                            strokeWidth="0.5"
                        />
                    ))}
                    {/* Line */}
                    {chartData.values.length > 0 && (
                        <path
                            d={pathData}
                            fill="none"
                            stroke={strokeColors[color]}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    )}
                    {/* Points */}
                    {points.map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="1.5"
                            fill={strokeColors[color]}
                        />
                    ))}
                    {/* Labels */}
                    {chartData.labels.map((label, index) => (
                        <text
                            key={index}
                            x={(index / ((chartData.labels.length - 1) || 1)) * 100}
                            y="98"
                            textAnchor="middle"
                            fontSize="4"
                            fill="#6B7280"
                        >
                            {label}
                        </text>
                    ))}
                </svg>
                {chartData.labels.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

const PieChart = ({ data, title }) => {
    const chartData = data || { labels: [], values: [] };
    const total = chartData.values.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;

    const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F97316", "#EC4899", "#06B6D4"];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-center justify-center">
                {chartData.values.length > 0 ? (
                    <>
                        <div className="relative w-40 h-40">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                {chartData.values.map((value, index) => {
                                    const percentage = (value / total) * 100;
                                    const angle = (percentage / 100) * 360;
                                    const largeArcFlag = percentage > 50 ? 1 : 0;

                                    const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
                                    const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
                                    const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
                                    const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);

                                    const pathData = [
                                        `M 50 50`,
                                        `L ${x1} ${y1}`,
                                        `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                        `Z`
                                    ].join(' ');

                                    currentAngle += angle;

                                    return (
                                        <path
                                            key={index}
                                            d={pathData}
                                            fill={colors[index % colors.length]}
                                            stroke="#FFFFFF"
                                            strokeWidth="1"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-800">{total}</span>
                            </div>
                        </div>
                        <div className="ml-6 space-y-2">
                            {chartData.labels.map((label, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: colors[index % colors.length] }}
                                    ></div>
                                    <span className="text-sm text-gray-700">{label}</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        ({Math.round((chartData.values[index] / total) * 100)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-40 flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

const AreaChart = ({ data, title, color = "blue" }) => {
    const chartData = data || { labels: [], values: [] };
    const maxValue = Math.max(...(chartData.values.length ? chartData.values : [1]));
    const points = chartData.values.map((value, index) => ({
        x: (index / ((chartData.values.length - 1) || 1)) * 100,
        y: 100 - (value / maxValue) * 100
    }));

    const pathData = [
        `M 0 100`,
        ...points.map(point => `L ${point.x} ${point.y}`),
        `L 100 100`,
        `Z`
    ].join(' ');

    const fillColors = {
        blue: "url(#blueGradient)",
        green: "url(#greenGradient)",
        purple: "url(#purpleGradient)"
    };

    const strokeColors = {
        blue: "#3B82F6",
        green: "#10B981",
        purple: "#8B5CF6"
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="h-48 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="#E5E7EB"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Area */}
                    {chartData.values.length > 0 && (
                        <path
                            d={pathData}
                            fill={fillColors[color]}
                        />
                    )}

                    {/* Line */}
                    {chartData.values.length > 0 && (
                        <path
                            d={`M 0 100 ${points.map(point => `L ${point.x} ${point.y}`).join(' ')}`}
                            fill="none"
                            stroke={strokeColors[color]}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Labels */}
                    {chartData.labels.map((label, index) => (
                        <text
                            key={index}
                            x={(index / ((chartData.labels.length - 1) || 1)) * 100}
                            y="98"
                            textAnchor="middle"
                            fontSize="4"
                            fill="#6B7280"
                        >
                            {label}
                        </text>
                    ))}
                </svg>
                {chartData.labels.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        employees: 0,
        projects: 0,
        clients: 0,
        revenue: 0,
        attendance: 0,
        pendingFees: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [topPerformers, setTopPerformers] = useState([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const [chartData, setChartData] = useState({
        // Initialize with empty data to prevent undefined errors
        revenue: { labels: [], values: [] },
        enrollment: { labels: [], values: [] },
        performance: { labels: [], values: [] },
        attendance: { labels: [], values: [] },
        courseDistribution: { labels: [], values: [] },
        studentProgress: { labels: [], values: [] }
    });

    // Load data from localStorage
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        // Load students data
        const students = JSON.parse(localStorage.getItem("students") || "[]");
        const courses = JSON.parse(localStorage.getItem("courses") || "[]");
        const employees = JSON.parse(localStorage.getItem("employees") || "[]");
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        const clients = JSON.parse(localStorage.getItem("crm-clients") || "[]");
        const attendance = JSON.parse(localStorage.getItem("attendance") || "{}");

        // Calculate stats
        const totalStudents = students.length;
        const totalCourses = courses.length;
        const totalEmployees = employees.length;
        const totalProjects = projects.length;
        const totalClients = clients.length;

        const totalRevenue = courses.reduce((sum, course) => sum + (course.fee * course.enrolledStudents), 0);
        const pendingFees = students.reduce((sum, student) => sum + student.pendingFees, 0);

        // Calculate average attendance
        let totalAttendance = 0;
        let attendanceCount = 0;
        Object.values(attendance).forEach(studentAttendance => {
            Object.values(studentAttendance).forEach(status => {
                if (status === "present") totalAttendance++;
                attendanceCount++;
            });
        });
        const avgAttendance = attendanceCount > 0 ? Math.round((totalAttendance / attendanceCount) * 100) : 0;

        setStats({
            students: totalStudents,
            courses: totalCourses,
            employees: totalEmployees,
            projects: totalProjects,
            clients: totalClients,
            revenue: totalRevenue,
            attendance: avgAttendance,
            pendingFees: pendingFees
        });

        // Generate recent activities
        generateRecentActivities(students, courses, projects, clients);

        // Generate top performers
        generateTopPerformers(students, employees);

        // Generate upcoming deadlines
        generateUpcomingDeadlines(projects, courses);

        // Generate chart data
        generateChartData(students, courses, projects);
    };

    const generateRecentActivities = (students, courses, projects, clients) => {
        const activities = [
            ...students.slice(-3).map(student => ({
                type: "student",
                title: "New Student Enrollment",
                description: `${student.name} enrolled in a course`,
                time: "2 hours ago",
                icon: "👨‍🎓",
                color: "blue"
            })),
            ...projects.slice(-2).map(project => ({
                type: "project",
                title: "Project Started",
                description: `"${project.name}" project initiated`,
                time: "5 hours ago",
                icon: "📁",
                color: "green"
            })),
            ...clients.slice(-2).map(client => ({
                type: "client",
                title: "New Client Added",
                description: `${client.company} added to clients`,
                time: "1 day ago",
                icon: "👥",
                color: "purple"
            })),
            {
                type: "course",
                title: "Course Completed",
                description: "Web Development batch completed successfully",
                time: "2 days ago",
                icon: "🎓",
                color: "orange"
            }
        ];

        setRecentActivities(activities.slice(-6).reverse());
    };

    const generateTopPerformers = (students, employees) => {
        const studentPerformers = students
            .map(student => ({
                ...student,
                type: "student",
                performance: Math.random() * 100,
                metric: "Attendance"
            }))
            .sort((a, b) => b.performance - a.performance)
            .slice(0, 3);

        const employeePerformers = employees
            .map(employee => ({
                ...employee,
                type: "employee",
                performance: employee.performance,
                metric: "Performance"
            }))
            .sort((a, b) => b.performance - a.performance)
            .slice(0, 3);

        setTopPerformers([...studentPerformers, ...employeePerformers].slice(0, 5));
    };

    const generateUpcomingDeadlines = (projects, courses) => {
        const projectDeadlines = projects
            .filter(project => new Date(project.endDate) > new Date())
            .map(project => ({
                ...project,
                type: "project",
                deadline: project.endDate,
                priority: project.priority
            }));

        const courseDeadlines = courses
            .filter(course => new Date(course.startDate) > new Date())
            .map(course => ({
                ...course,
                type: "course",
                deadline: course.startDate,
                priority: "Medium"
            }));

        const allDeadlines = [...projectDeadlines, ...courseDeadlines]
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5);

        setUpcomingDeadlines(allDeadlines);
    };

    const generateChartData = (students, courses, projects) => {
        // Enhanced chart data with multiple datasets
        const newChartData = {
            revenue: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [65, 78, 90, 81, 96, 105]
            },
            enrollment: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [12, 19, 15, 25, 22, 30]
            },
            performance: {
                labels: ['Web Dev', 'Data Science', 'Marketing', 'Design'],
                values: [85, 92, 78, 88]
            },
            attendance: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                values: [85, 92, 78, 88, 95, 65]
            },
            courseDistribution: {
                labels: ['Web Dev', 'Data Science', 'Marketing', 'Design', 'Business', 'Others'],
                values: [35, 25, 15, 12, 8, 5]
            },
            studentProgress: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                values: [20, 35, 50, 65, 80, 95]
            }
        };

        setChartData(newChartData);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Urgent": return "text-red-600 bg-red-50 border-red-200";
            case "High": return "text-orange-600 bg-orange-50 border-orange-200";
            case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Low": return "text-green-600 bg-green-50 border-green-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const StatCard = ({ title, value, change, icon: Icon, color }) => (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
                    {change && (
                        <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                    <Icon className={`w-6 h-6 text-gray-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Students"
                        value={stats.students}
                        change={12}
                        icon={UserIcon}
                        color="#3B82F6"
                    />
                    <StatCard
                        title="Active Courses"
                        value={stats.courses}
                        change={8}
                        icon={BookIcon}
                        color="#10B981"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${(stats.revenue / 100000).toFixed(1)}L`}
                        change={15}
                        icon={CurrencyIcon}
                        color="#8B5CF6"
                    />
                    <StatCard
                        title="Avg Attendance"
                        value={`${stats.attendance}%`}
                        change={5}
                        icon={ChartIcon}
                        color="#F97316"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Employees"
                        value={stats.employees}
                        change={3}
                        icon={UserIcon}
                        color="#EC4899"
                    />
                    <StatCard
                        title="Active Projects"
                        value={stats.projects}
                        change={20}
                        icon={ProjectIcon}
                        color="#06B6D4"
                    />
                    <StatCard
                        title="Clients"
                        value={stats.clients}
                        change={10}
                        icon={ClientIcon}
                        color="#84CC16"
                    />
                    <StatCard
                        title="Pending Fees"
                        value={`₹${(stats.pendingFees / 1000).toFixed(1)}K`}
                        change={-5}
                        icon={BellIcon}
                        color="#EF4444"
                    />
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <BarChart
                        data={chartData.revenue}
                        title="Monthly Revenue (in ₹K)"
                        color="blue"
                    />
                    <LineChart
                        data={chartData.enrollment}
                        title="Student Enrollment Trend"
                        color="green"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <PieChart
                        data={chartData.courseDistribution}
                        title="Course Distribution"
                    />
                    <AreaChart
                        data={chartData.studentProgress}
                        title="Student Progress Over Time"
                        color="purple"
                    />
                </div>

                {/* Additional Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <BarChart
                        data={chartData.attendance}
                        title="Weekly Attendance Rate (%)"
                        color="orange"
                    />
                    <LineChart
                        data={chartData.performance}
                        title="Course Performance (%)"
                        color="blue"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Activities */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h2>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getPriorityColor(activity.color)}`}>
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Top Performers */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Performers</h2>
                            <div className="space-y-4">
                                {topPerformers.map((performer, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {performer.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm">{performer.name}</h3>
                                                <p className="text-xs text-gray-600 capitalize">{performer.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-green-600">{Math.round(performer.performance)}%</span>
                                            <p className="text-xs text-gray-600">{performer.metric}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Deadlines</h2>
                            <div className="space-y-4">
                                {upcomingDeadlines.map((deadline, index) => (
                                    <div key={index} className="p-3 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-800 text-sm">{deadline.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(deadline.priority)}`}>
                                                {deadline.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2 capitalize">{deadline.type}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>Due: {new Date(deadline.deadline).toLocaleDateString()}</span>
                                            <span>
                                                {Math.ceil((new Date(deadline.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Stats</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{stats.courses}</div>
                                    <div className="text-sm text-gray-600">Active Courses</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats.projects}</div>
                                    <div className="text-sm text-gray-600">Ongoing Projects</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats.clients}</div>
                                    <div className="text-sm text-gray-600">Active Clients</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{stats.employees}</div>
                                    <div className="text-sm text-gray-600">Team Members</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Course Performance */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Course Performance</h2>
                        <div className="space-y-4">
                            {chartData.performance?.labels?.map((label, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-800">{label}</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${chartData.performance?.values?.[index] || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800 w-8">
                                            {chartData.performance?.values?.[index] || 0}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">System Health</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-800">Storage Usage</span>
                                    <span className="text-sm text-gray-600">65%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-800">Database Performance</span>
                                    <span className="text-sm text-gray-600">92%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-800">Uptime</span>
                                    <span className="text-sm text-gray-600">99.9%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;