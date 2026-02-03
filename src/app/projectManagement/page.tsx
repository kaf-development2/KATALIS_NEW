"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Project Phase types
type ProjectPhase = "Ureq" | "Sys Design" | "Dev" | "UAT" | "Deploy";

interface Project {
  id: string;
  name: string;
  phase: ProjectPhase;
  status: "complete" | "overdue" | "on-track";
  daysInfo?: string;
}

// Mock project data
const projects: Project[] = [];

export default function ProjectManagementPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All Projects");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  // Group projects by phase
  const getProjectsByPhase = (phase: ProjectPhase) => {
    return projects.filter((p) => p.phase === phase);
  };

  const phases: { name: string; key: ProjectPhase }[] = [
    { name: "Ureq", key: "Ureq" },
    { name: "Sys Design", key: "Sys Design" },
    { name: "Dev", key: "Dev" },
    { name: "UAT", key: "UAT" },
    { name: "Deploy", key: "Deploy" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, Admin! 👋 <span className="text-green-600">Last sync: 26/1/2026, 16.20.18</span>
              </p>
            </div>
          </div>

          {/* Project Phase Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Project Phase Distribution
              </h2>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Sync to DB
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Excel
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Project
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {phases.map((phase) => {
                const phaseProjects = getProjectsByPhase(phase.key);
                return (
                  <div key={phase.key} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">{phase.name}</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{phaseProjects.length}</div>
                    <div className="text-sm text-gray-500 mb-4">Projects</div>
                    
                    <div className="space-y-3 gap-1">
                      {phaseProjects.map((project) => (
                        <div key={project.id} className="bg-gray-300 text-gray-800 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium flex-1">{project.name}</h4>
                          </div>
                          {project.status === "complete" && (
                            <div className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 rounded w-fit">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Complete
                            </div>
                          )}
                          {project.daysInfo && (
                            <div className={`text-xs mt-2 ${
                              project.daysInfo.includes("overdue") 
                                ? "text-red-400" 
                                : "text-green-400"
                            }`}>
                              {project.daysInfo}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Project Progress & Budget Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Project Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Overall Project Progress
              </h2>

              <div className="mb-6">
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option>All Projects</option>
                  <option>Active Projects</option>
                  <option>Completed Projects</option>
                </select>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                  <span className="text-sm font-bold text-blue-600">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full" style={{ width: "12%" }}></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Days Elapsed</span>
                  <span className="text-sm font-bold text-blue-600">115 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Remaining Days</span>
                  <span className="text-sm font-bold text-orange-600">131 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: "55%" }}></div>
                </div>
              </div>

              {/* Timeline Visual */}
              <div className="relative pt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>57d</span>
                  <span>34d</span>
                  <span>28d</span>
                  <span>10d</span>
                  <span>0d</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex-1 bg-yellow-400 h-8 rounded-l flex items-center justify-center text-white text-xs font-medium">
                    5/8
                  </div>
                  <div className="flex-1 bg-orange-500 h-8 flex items-center justify-center text-white text-xs font-medium">
                    7/9
                  </div>
                  <div className="flex-1 bg-red-500 h-8 flex items-center justify-center text-white text-xs font-medium">
                    28d
                  </div>
                  <div className="flex-1 bg-blue-500 h-8 flex items-center justify-center text-white text-xs font-medium">
                    10d
                  </div>
                  <div className="flex-1 bg-teal-500 h-8 rounded-r flex items-center justify-center text-white text-xs font-medium">
                    0d
                  </div>
                </div>
              </div>

              {/* Issues Badge */}
              <div className="mt-6 flex items-center gap-2">
                <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                  N
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-semibold">3 Issues</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget & Resource Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Budget & Resource Analysis
                </h2>
              </div>

              {/* Budget Overview */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-700">Budget Overview</h3>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">Edit</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Total Budget</div>
                    <div className="text-xl font-bold text-gray-800">Rp 3.100.000.000</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Total Man-Days</div>
                    <div className="text-xl font-bold text-gray-800">2840</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Man Power</div>
                    <div className="text-xl font-bold text-gray-800">10 people</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Man-Day Cost</div>
                    <div className="text-xl font-bold text-gray-800">Rp 1.174.242</div>
                  </div>
                </div>
              </div>

              {/* Calculated Metrics */}
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-4">Calculated Metrics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Total Man-Days</div>
                    <div className="text-xl font-bold text-gray-800">2840</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Man-Day Cost</div>
                    <div className="text-xl font-bold text-gray-800">Rp 1.174.242</div>
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
