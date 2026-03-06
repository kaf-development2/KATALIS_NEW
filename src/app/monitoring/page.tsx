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
  const newProjectCount = projects.filter(p => p.phase === "User Requirement").length;
  const crCount = totalProjects - newProjectCount;

  // Phase color mapping - different colors for New Project vs CR
  const getPhaseColor = (phase: string, isNewProject: boolean) => {
    if (isNewProject) {
      // Project phase distribution colors (for New Project) - excluding SIT
      const newProjectColorMap: Record<string, string> = {
        "User Requirement": "#84CC16",  // green
        "System Design": "#EAB308",     // yellow
        "Development": "#3B82F6",       // blue
      };
      return newProjectColorMap[phase] || "#6B7280";
    } else {
      // CR Project phase distribution colors (for CR)
      const crColorMap: Record<string, string> = {
        "User Requirement": "#6366F1",  // indigo/blue
        "System Design": "#A855F7",     // purple (Analysis)
        "Development": "#EC4899",       // pink
        "UAT": "#8B5CF6",               // purple
        "Deploy": "#10B981",            // emerald/green
      };
      return crColorMap[phase] || "#6B7280";
    }
  };

  // Get unique project owners
  const projectOwners = Array.from(new Set(projects.map(p => p.projectOwner).filter(Boolean))) as string[];

  // Build phase distribution for each owner
  const buildOwnerPhaseData = (owner: string, isNewProject: boolean) => {
    const ownerProjects = projects.filter(p => {
      const matchOwner = p.projectOwner === owner;
      const matchType = isNewProject 
        ? p.phase === "User Requirement"
        : p.phase !== "User Requirement";
      return matchOwner && matchType;
    });

    const phaseCount: Record<string, number> = {};
    ownerProjects.forEach(p => {
      phaseCount[p.phase] = (phaseCount[p.phase] || 0) + 1;
    });

    const total = ownerProjects.length;
    const phases = Object.entries(phaseCount);
    
    return {
      total,
      phases: phases.map(([phase, count]) => ({
        phase,
        count,
        percent: total > 0 ? (count / total) * 100 : 0,
        color: getPhaseColor(phase, isNewProject),
      }))
    };
  };

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

          {/* Phase Legend */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-4">
            <div className="flex items-center justify-center gap-12">
              {/* Project Phase Distribution (New Project) */}
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-gray-600 mb-1">Project Phase Distribution</div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#84CC16" }}></span>
                    <span className="text-sm text-gray-700">User Requirement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#EAB308" }}></span>
                    <span className="text-sm text-gray-700">System Design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3B82F6" }}></span>
                    <span className="text-sm text-gray-700">Development</span>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-l border-gray-300 h-12"></div>
              
              {/* CR Project Phase Distribution */}
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-gray-600 mb-1">CR Project Phase Distribution</div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6366F1" }}></span>
                    <span className="text-sm text-gray-700">User Requirement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A855F7" }}></span>
                    <span className="text-sm text-gray-700">Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#EC4899" }}></span>
                    <span className="text-sm text-gray-700">Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10B981" }}></span>
                    <span className="text-sm text-gray-700">Deploy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col items-center justify-center">
              <h2 className="text-center text-lg font-bold text-gray-800 mb-4">Total Project</h2>
              <div className="text-center text-4xl font-bold text-gray-900 mb-6">{totalProjects}</div>
              <div className="w-full flex justify-around gap-4 px-2">
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{newProjectCount}</div>
                  <div className="text-xs font-medium text-gray-600">New Project</div>
                </div>
                <div className="border-l border-gray-300 h-12"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{crCount}</div>
                  <div className="text-xs font-medium text-gray-600">CR</div>
                </div>
              </div>
            </div>
            
            {/* Project Owner Cards */}
            {projectOwners.map((owner) => {
              const newProjectData = buildOwnerPhaseData(owner, true);
              const crData = buildOwnerPhaseData(owner, false);
              
              const renderDonut = (data: any, label: string) => {
                const { total, phases } = data;
                
                return (
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="22" />
                        {total > 0 && (() => {
                          let startAngle = -90;
                          return phases.map((phase: any, idx: number) => {
                            const angle = (phase.percent / 100) * 360;
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
                            const pathData = angle === 360 
                              ? "" 
                              : `M ${start.x} ${start.y} A 70 70 0 ${largeArc} 1 ${end.x} ${end.y}`;
                            
                            startAngle = endAngle;
                            
                            if (angle === 360) {
                              return (
                                <circle
                                  key={idx}
                                  cx="100"
                                  cy="100"
                                  r="70"
                                  fill="none"
                                  stroke={phase.color}
                                  strokeWidth="22"
                                />
                              );
                            }
                            
                            return (
                              <path
                                key={idx}
                                d={pathData}
                                stroke={phase.color}
                                strokeWidth="22"
                                fill="none"
                                strokeLinecap="butt"
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-gray-900">{total}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 font-medium">{label}</div>
                  </div>
                );
              };

              return (
                <div key={owner} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">{owner}</h3>
                    <span className="text-xs text-gray-500">By Developer</span>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    {renderDonut(newProjectData, "New Project")}
                    {renderDonut(crData, "CR")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Owner and Overall Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
          </div>
        </main>
      </div>
    </div>
  );
}
