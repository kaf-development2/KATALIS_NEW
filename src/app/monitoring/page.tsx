"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Project {
  id: string;
  name: string;
  phase: string;
  projectOwner?: string;
  startDate?: string;
  endDate?: string;
  subTasks?: Array<{
    id: string;
    name: string;
    assignee: string;
    status: string;
  }>;
}

export default function MonitoringPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All Projects");


  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }

    // Load projects from localStorage
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error("Failed to parse projects from localStorage:", error);
      }
    }
  }, [router]);

  // Calculate statistics
  const totalProjects = projects.length;
  const deployCount = projects.filter(p => p.phase === "Deploy").length;

  const getOwnerColor = (owner: string) => {
    if (!owner) return "hsl(210 20% 60%)";
    let hash = 0;
    for (let i = 0; i < owner.length; i += 1) {
      hash = (hash + owner.charCodeAt(i) * (i + 1)) % 2147483647;
    }
    const hue = hash % 360;
    return `hsl(${hue} 72% 52%)`;
  };

  const buildPhaseDonut = (phase: string) => {
    const phaseProjects = projects.filter(p => p.phase === phase);
    const ownerTotals = phaseProjects.reduce<Record<string, number>>((acc, project) => {
      const owner = project.projectOwner || "Unknown";
      acc[owner] = (acc[owner] || 0) + 1;
      return acc;
    }, {});
    const ownerEntries = Object.entries(ownerTotals).sort((a, b) => b[1] - a[1]);
    const ownerTotalCount = ownerEntries.reduce((sum, [, count]) => sum + count, 0);
    const segments = ownerEntries.map(([owner, count]) => ({
      owner,
      count,
      color: getOwnerColor(owner),
      percent: ownerTotalCount > 0 ? (count / ownerTotalCount) * 100 : 0,
    }));
    return { ownerTotalCount, segments };
  };

  // Calculate project owners statistics
  const ownerStats: { [key: string]: number } = {};
  projects.forEach(project => {
    const owner = project.projectOwner || "Unknown";
    ownerStats[owner] = (ownerStats[owner] || 0) + 1;
  });

  // Calculate overall progress (mock data for now)
  const overallProgress = totalProjects > 0 ? Math.round((deployCount / totalProjects) * 100) : 0;

  // Calculate total days elapsed (mock calculation)
  const calculateTotalDays = () => {
    if (projects.length === 0) return 0;
    let totalDays = 0;
    projects.forEach(project => {
      if (project.startDate) {
        const start = new Date(project.startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
    });
    return Math.round(totalDays / projects.length);
  };

  const totalDaysElapsed = calculateTotalDays();

  // Mock idle time by phase data
  const idleTimeData = [
    { phase: "Ureq", days: 57, percentage: 100 },
    { phase: "SysD", days: 34, percentage: 60 },
    { phase: "Dev", days: 29, percentage: 51 },
    { phase: "UAT", days: 10, percentage: 18 },
    { phase: "Deploy", days: 0, percentage: 0 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Monitoring Project</h1>
            <p className="text-gray-600 mt-1">Track and monitor all projects progress</p>
          </div>

          {/* Phase Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col items-center justify-center min-h-[240px]">
              <h2 className="text-center text-lg font-bold text-gray-800 mb-3">Total Project</h2>
              <div className="text-center text-4xl font-bold text-gray-900">{totalProjects}</div>
            </div>
            {["User Requirement", "System Design", "Development", "UAT", "Deploy"].map((phase) => {
              const { ownerTotalCount, segments } = buildPhaseDonut(phase);
              return (
                <div key={phase} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-800">{phase}</h3>
                    <span className="text-xs text-gray-500">By owner</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative w-36 h-36">
                      <svg className="w-36 h-36" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="22" />
                        {segments.length === 1 && ownerTotalCount > 0 ? (
                          <circle
                            cx="100"
                            cy="100"
                            r="70"
                            fill="none"
                            stroke={segments[0].color}
                            strokeWidth="22"
                          />
                        ) : (
                          (() => {
                            let startAngle = -90;
                            return segments.map((segment) => {
                              const angle = (segment.percent / 100) * 360;
                              const endAngle = startAngle + angle;
                              const largeArc = angle > 180 ? 1 : 0;
                              const start = {
                                x: 100 + 70 * Math.cos((Math.PI / 180) * startAngle),
                                y: 100 + 70 * Math.sin((Math.PI / 180) * startAngle),
                              };
                              const end = {
                                x: 100 + 70 * Math.cos((Math.PI / 180) * endAngle),
                                y: 100 + 70 * Math.sin((Math.PI / 180) * endAngle),
                              };
                              const pathData = `M ${start.x} ${start.y} A 70 70 0 ${largeArc} 1 ${end.x} ${end.y}`;
                              startAngle = endAngle;
                              return (
                                <path
                                  key={`${phase}-${segment.owner}`}
                                  d={pathData}
                                  stroke={segment.color}
                                  strokeWidth="22"
                                  fill="none"
                                  strokeLinecap="butt"
                                />
                              );
                            });
                          })()
                        )}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-base font-bold text-gray-900">Total {ownerTotalCount}</div>
                        <div className="text-xs font-semibold text-gray-500">Projects</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-gray-600">
                      {segments.length > 0 ? (
                        segments.map((segment) => (
                          <div key={`${phase}-${segment.owner}-legend`} className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }}></span>
                            <span className="font-medium text-gray-700">{segment.owner}</span>
                            <span className="text-gray-500">{segment.count}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500">No projects</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Owner and Overall Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Project Owner */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Project Owner
              </h2>
              <div className="space-y-3">
                {Object.entries(ownerStats).length > 0 ? (
                  Object.entries(ownerStats).map(([owner, count]) => (
                    <div key={owner} className="flex items-center gap-3">
                      <div className="font-bold text-gray-800 w-16">{owner}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                        <div 
                          className="bg-orange-400 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ width: `${Math.max((count / totalProjects) * 100, 10)}%` }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No projects with owners</div>
                )}
              </div>
            </div>

            {/* Overall Project Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Overall Project Progress
                </h2>
                <select 
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option>All Projects</option>
                  <option>Active Projects</option>
                  <option>Completed Projects</option>
                </select>
              </div>

              {/* Overall Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-lg font-bold text-blue-600">{overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Days Elapsed */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Total Days Elapsed</div>
                <div className="text-2xl font-bold text-gray-800">{totalDaysElapsed} days</div>
              </div>

              {/* Idle Time by Phase */}
              <div>
                <div className="text-sm text-gray-600 mb-3">Idle Time by Phase</div>
                <div className="flex items-end gap-1 h-32 mb-2">
                  {idleTimeData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="text-xs text-red-500 mb-1">{item.days}d</div>
                      <div 
                        className="w-full bg-orange-500 rounded-t transition-all duration-300"
                        style={{ height: `${item.percentage}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {idleTimeData.map((item, index) => (
                    <div key={index} className="flex-1 text-center text-xs text-gray-600">
                      {item.phase}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team Workload and Budget Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Workload */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Team Workload</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3"></th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-600">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-orange-200 border border-orange-400"></div>
                          Project
                        </div>
                      </th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-600">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-blue-200 border border-blue-400"></div>
                          Subtask
                        </div>
                      </th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Egi", "Luthfi", "Mila", "Indah", "Alicia", "Ka Rey", "Zulfikar", "Mawar", "Fara", "Firhan"].map((developer) => {
                      // Calculate workload from projects
                      // Count projects where developer has at least one subtask assigned
                      const projectCount = projects.filter(project => 
                        project.subTasks && project.subTasks.some((st: any) => st.assignee === developer)
                      ).length;
                      
                      const subtaskCount = projects.reduce((count, project) => {
                        if (project.subTasks) {
                          return count + project.subTasks.filter((st: any) => st.assignee === developer).length;
                        }
                        return count;
                      }, 0);

                      return (
                        <tr key={developer} className="border-b border-gray-100">
                          <td className="py-3 px-3 font-semibold text-gray-800">{developer}</td>
                          <td className="py-3 px-3">
                            <div className="bg-orange-200 text-center py-1 px-2 rounded font-semibold text-gray-800">
                              {projectCount}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="bg-blue-200 text-center py-1 px-2 rounded font-semibold text-gray-800">
                              {subtaskCount}
                            </div>
                          </td>
                          <td className="py-3 px-3"></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
