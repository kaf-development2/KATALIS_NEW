"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import StatisticsChart from "@/components/StatisticsChart";
import RevenueChart from "@/components/RevenueChart";
import ProgressBar from "@/components/ProgressBar";

export default function CRMPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
            <p className="text-gray-600">Customer Relationship Management Overview</p>
          </div>

          {/* Right Side */}
        <div className="flex items-center gap-4 ml-6">
           <h1 className="text-2xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
            <p className="text-gray-600">Customer Relationship Management Overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <StatsCard
              title="Active Deal"
              value="$120,369"
              change="+20%"
              changeLabel="From last month"
              isPositive={true}
            />
            <StatsCard
              title="Revenue Total"
              value="$234,210"
              change="+9.0%"
              changeLabel="From last month"
              isPositive={true}
            />
            <StatsCard
              title="Closed Deals"
              value="874"
              change="-4.5%"
              changeLabel="From last month"
              isPositive={false}
            />
            <StatsCard
              title="Closed Deals"
              value="874"
              change="-4.5%"
              changeLabel="From last month"
              isPositive={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Statistics Chart */}
            <div className="lg:col-span-2">
              <StatisticsChart />
            </div>

            {/* Revenue Chart */}
            <div className="lg:col-span-1">
              <RevenueChart />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Marketing Performance</h3>
              <ProgressBar label="Marketing" value={30569} percentage={85} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
              <ProgressBar label="Sales" value={20486} percentage={55} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
