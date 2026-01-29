"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for impression and traffic
const impressionData = [
  { month: "Jan", impressions: 180, traffic: 45 },
  { month: "Feb", impressions: 195, traffic: 38 },
  { month: "Mar", impressions: 160, traffic: 52 },
  { month: "Apr", impressions: 175, traffic: 48 },
  { month: "May", impressions: 185, traffic: 42 },
  { month: "Jun", impressions: 170, traffic: 55 },
  { month: "Jul", impressions: 210, traffic: 58 },
  { month: "Aug", impressions: 230, traffic: 68 },
  { month: "Sep", impressions: 225, traffic: 75 },
  { month: "Oct", impressions: 215, traffic: 82 },
  { month: "Nov", impressions: 240, traffic: 95 },
  { month: "Dec", impressions: 250, traffic: 105 },
];

// Mock data for traffic stats
const trafficStatsData = {
  today: {
    subscribers: { value: "567K", change: "+3.85%", isPositive: true, sparkline: [45, 52, 48, 61, 55, 58, 62] },
    conversion: { value: "276K", change: "-5.39%", isPositive: false, sparkline: [82, 78, 85, 80, 75, 72, 70] },
    bounce: { value: "285", change: "+2.1%", isPositive: true, sparkline: [280, 282, 279, 283, 285, 287, 285] },
  },
  week: {
    subscribers: { value: "2.1M", change: "+5.2%", isPositive: true, sparkline: [45, 52, 48, 61, 55, 58, 62] },
    conversion: { value: "1.5M", change: "-3.1%", isPositive: false, sparkline: [82, 78, 85, 80, 75, 72, 70] },
    bounce: { value: "298", change: "+1.5%", isPositive: true, sparkline: [280, 282, 279, 283, 285, 287, 285] },
  },
  month: {
    subscribers: { value: "8.9M", change: "+7.8%", isPositive: true, sparkline: [45, 52, 48, 61, 55, 58, 62] },
    conversion: { value: "6.2M", change: "-2.5%", isPositive: false, sparkline: [82, 78, 85, 80, 75, 72, 70] },
    bounce: { value: "312", change: "+3.2%", isPositive: true, sparkline: [280, 282, 279, 283, 285, 287, 285] },
  },
};

export default function MarketingPage() {
  const router = useRouter();
  const [trafficFilter, setTrafficFilter] = useState<"today" | "week" | "month">("today");

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  const currentStats = trafficStatsData[trafficFilter];

  // Mini sparkline component
  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg width="100" height="30" viewBox="0 0 100 100" preserveAspectRatio="none" className="ml-auto">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Marketing Analytics</h1>
            <p className="text-gray-600 mt-1">Track your marketing performance and engagement metrics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Client Rating</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-gray-900">7.8<span className="text-lg text-gray-600">/10</span></h3>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <span>+20%</span>
                  <span className="text-xs text-gray-500">Vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instagram Followers</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-gray-900">5,934</h3>
                <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                  <span>-3.59%</span>
                  <span className="text-xs text-gray-500">Vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-gray-900">$9,758</h3>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <span>+15%</span>
                  <span className="text-xs text-gray-500">Vs last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Impression & Data Traffic Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Impression & Data Traffic</h2>
                  <p className="text-sm text-gray-600 mt-1">Jun 1, 2024 - Dec 1, 2025</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$9,758.00</p>
                    <p className="text-sm text-green-600 font-medium">+7.96% <span className="text-gray-600">Total Revenue</span></p>
                  </div>
                </div>
              </div>

              {/* Area Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={impressionData}>
                    <defs>
                      <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorImpressions)"
                      name="Impressions"
                    />
                    <Area
                      type="monotone"
                      dataKey="traffic"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTraffic)"
                      name="Traffic"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Stats Panel */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Traffic Stats</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setTrafficFilter("today")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    trafficFilter === "today"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTrafficFilter("week")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    trafficFilter === "week"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTrafficFilter("month")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    trafficFilter === "month"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Month
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-6">
                {/* New Subscribers */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">New Subscribers</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{currentStats.subscribers.value}</h3>
                      <p className={`text-sm font-medium mt-1 ${
                        currentStats.subscribers.isPositive ? "text-green-600" : "text-red-600"
                      }`}>
                        {currentStats.subscribers.change} <span className="text-gray-500">then last Week</span>
                      </p>
                    </div>
                    <Sparkline data={currentStats.subscribers.sparkline} color="#10b981" />
                  </div>
                </div>

                {/* Conversion Rate */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{currentStats.conversion.value}</h3>
                      <p className={`text-sm font-medium mt-1 ${
                        currentStats.conversion.isPositive ? "text-green-600" : "text-red-600"
                      }`}>
                        {currentStats.conversion.change} <span className="text-gray-500">then last Week</span>
                      </p>
                    </div>
                    <Sparkline data={currentStats.conversion.sparkline} color="#ef4444" />
                  </div>
                </div>

                {/* Page Bounce Rate */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Page Bounce Rate</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{currentStats.bounce.value}</h3>
                      <p className={`text-sm font-medium mt-1 ${
                        currentStats.bounce.isPositive ? "text-green-600" : "text-red-600"
                      }`}>
                        {currentStats.bounce.change} <span className="text-gray-500">then last Week</span>
                      </p>
                    </div>
                    <Sparkline data={currentStats.bounce.sparkline} color="#10b981" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
