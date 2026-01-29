"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for user access logs
const weeklyData = [
  { day: "Mon", users: 45 },
  { day: "Tue", users: 52 },
  { day: "Wed", users: 48 },
  { day: "Thu", users: 61 },
  { day: "Fri", users: 55 },
  { day: "Sat", users: 38 },
  { day: "Sun", users: 32 },
];

const monthlyData = [
  { month: "Week 1", users: 320 },
  { month: "Week 2", users: 385 },
  { month: "Week 3", users: 410 },
  { month: "Week 4", users: 395 },
];

const yearlyData = [
  { month: "Jan", users: 1250 },
  { month: "Feb", users: 1420 },
  { month: "Mar", users: 1580 },
  { month: "Apr", users: 1690 },
  { month: "May", users: 1820 },
  { month: "Jun", users: 1950 },
  { month: "Jul", users: 2100 },
  { month: "Aug", users: 2050 },
  { month: "Sep", users: 2180 },
  { month: "Oct", users: 2300 },
  { month: "Nov", users: 2250 },
  { month: "Dec", users: 2450 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">("weekly");

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  const getChartData = () => {
    switch (filter) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const getXAxisKey = () => {
    switch (filter) {
      case "weekly":
        return "day";
      case "monthly":
        return "month";
      case "yearly":
        return "month";
      default:
        return "day";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Monitor your portal user activities and statistics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Users"
              value="2,458"
              change="+12.5%"
              changeLabel="From last month"
              isPositive={true}
            />
            <StatsCard
              title="Active Today"
              value="342"
              change="+8.2%"
              changeLabel="From yesterday"
              isPositive={true}
            />
            <StatsCard
              title="New Users"
              value="156"
              change="+23.1%"
              changeLabel="This month"
              isPositive={true}
            />
            <StatsCard
              title="Avg. Session"
              value="24m"
              change="-5.3%"
              changeLabel="From last week"
              isPositive={false}
            />
          </div>

          {/* User Access Log Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">User Access Logs</h2>
                <p className="text-sm text-gray-600 mt-1">Track portal access patterns over time</p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() => setFilter("weekly")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "weekly"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setFilter("monthly")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "monthly"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setFilter("yearly")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "yearly"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey={getXAxisKey()}
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    label={{ value: "Users", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">Peak Access</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filter === "weekly" ? "61" : filter === "monthly" ? "410" : "2,450"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {filter === "weekly" ? "Thursday" : filter === "monthly" ? "Week 3" : "December"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Average Access</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filter === "weekly" ? "47" : filter === "monthly" ? "378" : "1,920"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per {filter === "weekly" ? "day" : filter === "monthly" ? "week" : "month"}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Access</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filter === "weekly" ? "331" : filter === "monthly" ? "1,510" : "23,040"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This {filter === "weekly" ? "week" : filter === "monthly" ? "month" : "year"}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent User Activity</h2>
            <div className="space-y-3">
              {[
                { name: "Admin", action: "Logged in", time: "2 minutes ago", status: "success" },
                { name: "John Doe", action: "Accessed CRM module", time: "15 minutes ago", status: "info" },
                { name: "Jane Smith", action: "Updated profile", time: "1 hour ago", status: "info" },
                { name: "Mike Johnson", action: "Logged out", time: "2 hours ago", status: "default" },
                { name: "Sarah Williams", action: "Logged in", time: "3 hours ago", status: "success" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === "success" ? "bg-green-500" :
                      activity.status === "info" ? "bg-blue-500" : "bg-gray-400"
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{activity.name}</p>
                      <p className="text-xs text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
