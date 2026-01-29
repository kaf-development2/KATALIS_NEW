"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const monthlyData = [
  { month: "Jan", profit1: 180, profit2: 90 },
  { month: "Feb", profit1: 190, profit2: 70 },
  { month: "Mar", profit1: 170, profit2: 85 },
  { month: "Apr", profit1: 165, profit2: 95 },
  { month: "May", profit1: 175, profit2: 85 },
  { month: "Jun", profit1: 165, profit2: 75 },
  { month: "Jul", profit1: 170, profit2: 65 },
  { month: "Aug", profit1: 190, profit2: 80 },
  { month: "Sep", profit1: 210, profit2: 95 },
  { month: "Oct", profit1: 220, profit2: 110 },
  { month: "Nov", profit1: 230, profit2: 120 },
  { month: "Dec", profit1: 245, profit2: 135 },
];

export default function StatisticsChart() {
  const [activeTab, setActiveTab] = useState("monthly");

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
          <p className="text-sm text-gray-500">Target you've set for each month</p>
        </div>
        
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("quarterly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "quarterly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setActiveTab("annually")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "annually" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-3xl font-bold text-gray-900">$212,142.12</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-green-600">+23.2%</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Avg. Yearly Profit</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">$30,321.23</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-red-600">-12.3%</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Avg. Yearly Profit</div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorProfit1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#142b6f" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffd601" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#142b6f" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffd601" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="profit1" 
              stroke="#6366f1" 
              strokeWidth={2}
              fill="url(#colorProfit1)" 
            />
            <Area 
              type="monotone" 
              dataKey="profit2" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fill="url(#colorProfit2)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
