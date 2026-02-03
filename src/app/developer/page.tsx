"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Project Phase types
type ProjectPhase = "User Requirement" | "System Design" | "Development" | "UAT" | "Deploy";

interface Project {
  id: string;
  name: string;
  phase: ProjectPhase;
  status: "complete" | "overdue" | "on-track";
  daysInfo?: string;
  projectType?: string;
  projectOwner?: string;
  projectLevel?: string;
  startDate?: string;
  endDate?: string;
  actualCost?: string;
  budgetPlan?: string;
  subTasks?: SubTask[];
}

interface SubTask {
  id: string;
  name: string;
  assignee: string;
  isEditing: boolean;
  status: "On Develop" | "Done" | "Pending";
}

export default function DeveloperPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All Projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "New Project",
    projectOwner: "",
    startDate: "",
    endDate: "",
    projectLevel: "Medium",
    actualCost: "",
    budgetPlan: "",
    subTasks: [] as SubTask[],
  });

  const developers = ["Egi", "Luthfi", "Mila", "Indah", "Alicia", "Ka Rey", "Zulfikar", "Mawar", "Fara", "Firhan"];

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
        console.log("Loaded projects from localStorage:", parsedProjects);
      } catch (error) {
        console.error("Failed to parse projects from localStorage:", error);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects));
      console.log("Saved projects to localStorage:", projects);
    }
  }, [projects]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      projectName: project.name,
      projectType: project.projectType || "New Project",
      projectOwner: project.projectOwner || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      projectLevel: project.projectLevel || "Medium",
      actualCost: project.actualCost || "",
      budgetPlan: project.budgetPlan || "",
      subTasks: project.subTasks || [],
    });
    setIsEditMode(false);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
    setIsEditMode(false);
    // Reset form
    setFormData({
      projectName: "",
      projectType: "New Project",
      projectOwner: "",
      startDate: "",
      endDate: "",
      projectLevel: "Medium",
      actualCost: "",
      budgetPlan: "",
      subTasks: [],
    });
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const updatedProject: Project = {
      ...selectedProject,
      name: formData.projectName,
      projectType: formData.projectType,
      projectOwner: formData.projectOwner,
      startDate: formData.startDate,
      endDate: formData.endDate,
      projectLevel: formData.projectLevel,
      actualCost: formData.actualCost,
      budgetPlan: formData.budgetPlan,
      subTasks: formData.subTasks,
    };

    setProjects(prevProjects => 
      prevProjects.map(p => p.id === selectedProject.id ? updatedProject : p)
    );

    setIsEditMode(false);
    handleCloseDetailModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted - Current projects:", projects);
    console.log("Form data:", formData);
    
    // Create new project
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.projectName,
      phase: "User Requirement",
      status: "on-track",
      projectType: formData.projectType,
      projectOwner: formData.projectOwner,
      projectLevel: formData.projectLevel,
      startDate: formData.startDate,
      endDate: formData.endDate,
      actualCost: formData.actualCost,
      budgetPlan: formData.budgetPlan,
      subTasks: formData.subTasks,
    };
    
    console.log("New project created:", newProject);
    
    // Add project to state
    setProjects(prevProjects => {
      const updatedProjects = [...prevProjects, newProject];
      console.log("Updated projects:", updatedProjects);
      return updatedProjects;
    });
    
    // Reset form
    setFormData({
      projectName: "",
      projectType: "New Project",
      projectOwner: "",
      startDate: "",
      endDate: "",
      projectLevel: "Medium",
      actualCost: "",
      budgetPlan: "",
      subTasks: [],
    });
    
    // Close modal
    setIsModalOpen(false);
  };

  const handleAddSubTask = () => {
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      name: "",
      assignee: "",
      isEditing: true,
      status: "On Develop",
    };
    setFormData({
      ...formData,
      subTasks: [...formData.subTasks, newSubTask],
    });
  };

  const handleChangeSubTaskStatus = (projectId: string, subTaskId: string, newStatus: "On Develop" | "Done" | "Pending", e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update projects state
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            subTasks: project.subTasks?.map(task =>
              task.id === subTaskId ? { ...task, status: newStatus } : task
            ),
          };
        }
        return project;
      })
    );
    
    // Update formData to reflect the change in the modal
    setFormData(prevFormData => ({
      ...prevFormData,
      subTasks: prevFormData.subTasks.map(task =>
        task.id === subTaskId ? { ...task, status: newStatus } : task
      ),
    }));
    
    setShowStatusDropdown(null);
  };

  const handleMoveToNextPhase = () => {
    if (!selectedProject) return;
    
    const phaseOrder: ProjectPhase[] = ["User Requirement", "System Design", "Development", "UAT", "Deploy"];
    const currentIndex = phaseOrder.indexOf(selectedProject.phase);
    
    if (currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1];
      
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id ? { ...project, phase: nextPhase } : project
        )
      );
      
      handleCloseDetailModal();
    }
  };

  const isDoneButtonEnabled = () => {
    return formData.subTasks.some(task => 
      task.status === "Done" || task.status === "Pending"
    );
  };

  const handleSaveSubTask = (id: string) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.map(task => 
        task.id === id ? { ...task, isEditing: false } : task
      ),
    });
  };

  const handleEditSubTask = (id: string) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.map(task => 
        task.id === id ? { ...task, isEditing: true } : task
      ),
    });
  };

  const handleCancelSubTask = (id: string) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.filter(task => task.id !== id),
    });
  };

  const handleSubTaskChange = (id: string, name: string) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.map(task => 
        task.id === id ? { ...task, name } : task
      ),
    });
  };

  const handleAssigneeChange = (id: string, assignee: string) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.map(task => 
        task.id === id ? { ...task, assignee } : task
      ),
    });
    setShowAssigneeDropdown(null);
  };

  // Group projects by phase
  const getProjectsByPhase = (phase: ProjectPhase) => {
    return projects.filter((p) => p.phase === phase);
  };

  const phases: { name: string; key: ProjectPhase }[] = [
    { name: "User Requirement", key: "User Requirement" },
    { name: "System Design", key: "System Design" },
    { name: "Development", key: "Development" },
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
              <h1 className="text-2xl font-bold text-gray-800">Project Board Management</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, (Name of Developer) 👋 
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
              {/*<div className="flex gap-3">
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
                  Add SubTask
                </button>
              </div>*/}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {phases.map((phase) => {
                const phaseProjects = getProjectsByPhase(phase.key);
                return (
                  <div key={phase.key} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">{phase.name}</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{phaseProjects.length}</div>
                    <div className="text-sm text-gray-500 mb-4">Projects</div>
                    
                    {phase.key === "User Requirement" && (
                      <button 
                        onClick={handleAddProject}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm mb-4"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Project
                      </button>
                    )}
                    
                    <div className="space-y-3 gap-1">
                      {phaseProjects.map((project) => (
                        <div 
                          key={project.id} 
                          onClick={() => handleOpenProjectDetail(project)}
                          className="bg-white border border-gray-300 text-gray-800 rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold flex-1">{project.name}</h4>
                          </div>
                          
                          {project.projectOwner && (
                            <div className="text-xs text-gray-600 mb-1">
                              <span className="font-medium">Owner:</span> {project.projectOwner}
                            </div>
                          )}
                          
                          {project.projectType && (
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {project.projectType}
                              </span>
                              {project.projectLevel && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  project.projectLevel === "Easy" 
                                    ? "bg-teal-100 text-teal-700"
                                    : project.projectLevel === "Medium"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {project.projectLevel}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {project.status === "complete" && (
                            <div className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 rounded w-fit">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Complete
                            </div>
                          )}
                          {project.status === "on-track" && (
                            <div className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded w-fit">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              On Track
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

          {/* List Project Details Table */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded"></div>
              List Project Details
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assignee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project Owner</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project Level</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 ? (
                    projects.map((project) => {
                      // Get unique assignees from subtasks
                      const assignees = project.subTasks
                        ? Array.from(new Set(project.subTasks
                            .filter(task => task.assignee)
                            .map(task => task.assignee)))
                        : [];
                      
                      // Calculate duration
                      const calculateDuration = () => {
                        if (!project.startDate || !project.endDate) return "Not set";
                        const start = new Date(project.startDate);
                        const end = new Date(project.endDate);
                        const diffTime = Math.abs(end.getTime() - start.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return `${diffDays} days`;
                      };

                      return (
                        <tr 
                          key={project.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => handleOpenProjectDetail(project)}
                        >
                          <td className="py-3 px-4 text-sm text-gray-800 font-medium">{project.name}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {project.projectType || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {assignees.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {assignees.map((assignee, idx) => (
                                  <span key={idx} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                    {assignee}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">No assignee</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{project.projectOwner || "N/A"}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              project.projectLevel === "Easy" 
                                ? "bg-teal-100 text-teal-700"
                                : project.projectLevel === "Medium"
                                ? "bg-blue-100 text-blue-700"
                                : project.projectLevel === "Hard"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {project.projectLevel || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              project.phase === "Deploy"
                                ? "bg-green-100 text-green-700"
                                : project.phase === "UAT"
                                ? "bg-yellow-100 text-yellow-700"
                                : project.phase === "Development"
                                ? "bg-orange-100 text-orange-700"
                                : project.phase === "System Design"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {project.phase}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{calculateDuration()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                        No projects available. Click "Add Project" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Add Project</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Project Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Project Type and Project Owner */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="projectType"
                          value="New Project"
                          checked={formData.projectType === "New Project"}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">New Project</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="projectType"
                          value="CR"
                          checked={formData.projectType === "CR"}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">CR</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Owner
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={formData.projectOwner}
                      onChange={(e) => setFormData({ ...formData, projectOwner: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Project Level */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Level <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLevel: "Easy" })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.projectLevel === "Easy"
                            ? "border-teal-500 bg-teal-500 bg-opacity-10"
                            : "border-gray-600 bg-gray-800 hover:border-teal-500"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-white font-bold text-lg mb-1">Easy</div>
                          <div className="text-gray-400 text-xs">5 days/phase</div>
                          <div className="text-gray-400 text-xs">30 days total</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLevel: "Medium" })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.projectLevel === "Medium"
                            ? "border-blue-500 bg-blue-500 bg-opacity-10"
                            : "border-gray-600 bg-gray-800 hover:border-blue-500"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-white font-bold text-lg mb-1">Medium</div>
                          <div className="text-gray-400 text-xs">10 days/phase</div>
                          <div className="text-gray-400 text-xs">60 days total</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLevel: "Hard" })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.projectLevel === "Hard"
                            ? "border-red-500 bg-red-500 bg-opacity-10"
                            : "border-gray-600 bg-gray-800 hover:border-red-500"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-white font-bold text-lg mb-1">Hard</div>
                          <div className="text-gray-400 text-xs">15 days/phase</div>
                          <div className="text-gray-400 text-xs">90 days total</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actual Cost and Budget Plan */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Cost
                    </label>
                    <input
                      type="text"
                      placeholder="Enter actual cost"
                      value={formData.actualCost}
                      onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Plan
                    </label>
                    <input
                      type="text"
                      placeholder="Enter budget plan"
                      value={formData.budgetPlan}
                      onChange={(e) => setFormData({ ...formData, budgetPlan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Sub Task */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Task
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Subtask
                  </button>
                  
                  {formData.subTasks.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {formData.subTasks.map((task) => (
                        <div key={task.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                          {task.isEditing ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Task name or type / for commands"
                                  value={task.name}
                                  onChange={(e) => handleSubTaskChange(task.id, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                {/* People Button */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === task.id ? null : task.id)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 text-sm"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {task.assignee || "Assign"}
                                  </button>
                                  {showAssigneeDropdown === task.id && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                                      {developers.map((dev) => (
                                        <button
                                          key={dev}
                                          type="button"
                                          onClick={() => handleAssigneeChange(task.id, dev)}
                                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm first:rounded-t-lg last:rounded-b-lg"
                                        >
                                          {dev}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1"></div>

                                {/* Cancel Button */}
                                <button
                                  type="button"
                                  onClick={() => handleCancelSubTask(task.id)}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                                >
                                  Cancel
                                </button>

                                {/* Save Button */}
                                <button
                                  type="button"
                                  onClick={() => handleSaveSubTask(task.id)}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                                >
                                  Save
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-800">{task.name}</div>
                                {task.assignee && (
                                  <div className="text-xs text-gray-500 mt-1">Assigned to: {task.assignee}</div>
                                )}
                              </div>
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleEditSubTask(task.id)}
                                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2"
                  >
                    Submit
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {isDetailModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
              
              <form onSubmit={handleUpdateProject}>
                {/* Project Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.projectName}</div>
                  )}
                </div>

                {/* Project Type and Project Owner */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    {isEditMode ? (
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="projectType"
                            value="New Project"
                            checked={formData.projectType === "New Project"}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">New Project</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="projectType"
                            value="CR"
                            checked={formData.projectType === "CR"}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">CR</span>
                        </label>
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.projectType}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Owner
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        placeholder="Enter first name"
                        value={formData.projectOwner}
                        onChange={(e) => setFormData({ ...formData, projectOwner: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.projectOwner}</div>
                    )}
                  </div>
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.startDate || "Not set"}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.endDate || "Not set"}</div>
                    )}
                  </div>
                </div>

                {/* Project Level */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Level <span className="text-red-500">*</span>
                  </label>
                  {isEditMode ? (
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, projectLevel: "Easy" })}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.projectLevel === "Easy"
                              ? "border-teal-500 bg-teal-500 bg-opacity-10"
                              : "border-gray-600 bg-gray-800 hover:border-teal-500"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-white font-bold text-lg mb-1">Easy</div>
                            <div className="text-gray-400 text-xs">5 days/phase</div>
                            <div className="text-gray-400 text-xs">30 days total</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, projectLevel: "Medium" })}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.projectLevel === "Medium"
                              ? "border-blue-500 bg-blue-500 bg-opacity-10"
                              : "border-gray-600 bg-gray-800 hover:border-blue-500"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-white font-bold text-lg mb-1">Medium</div>
                            <div className="text-gray-400 text-xs">10 days/phase</div>
                            <div className="text-gray-400 text-xs">60 days total</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, projectLevel: "Hard" })}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.projectLevel === "Hard"
                              ? "border-red-500 bg-red-500 bg-opacity-10"
                              : "border-gray-600 bg-gray-800 hover:border-red-500"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-white font-bold text-lg mb-1">Hard</div>
                            <div className="text-gray-400 text-xs">15 days/phase</div>
                            <div className="text-gray-400 text-xs">90 days total</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                        formData.projectLevel === "Easy" 
                          ? "bg-teal-100 text-teal-700"
                          : formData.projectLevel === "Medium"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {formData.projectLevel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actual Cost and Budget Plan */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Cost
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        placeholder="Enter actual cost"
                        value={formData.actualCost}
                        onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.actualCost || "Not set"}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Plan
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        placeholder="Enter budget plan"
                        value={formData.budgetPlan}
                        onChange={(e) => setFormData({ ...formData, budgetPlan: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.budgetPlan || "Not set"}</div>
                    )}
                  </div>
                </div>

                {/* Sub Task */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Task
                  </label>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleAddSubTask}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm mb-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Subtask
                    </button>
                  )}
                  
                  {formData.subTasks.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {formData.subTasks.map((task) => (
                        <div key={task.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                          {task.isEditing && isEditMode ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Task name or type / for commands"
                                  value={task.name}
                                  onChange={(e) => handleSubTaskChange(task.id, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === task.id ? null : task.id)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 text-sm"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {task.assignee || "Assign"}
                                  </button>
                                  {showAssigneeDropdown === task.id && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                                      {developers.map((dev) => (
                                        <button
                                          key={dev}
                                          type="button"
                                          onClick={() => handleAssigneeChange(task.id, dev)}
                                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm first:rounded-t-lg last:rounded-b-lg"
                                        >
                                          {dev}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1"></div>

                                <button
                                  type="button"
                                  onClick={() => handleCancelSubTask(task.id)}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSaveSubTask(task.id)}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                                >
                                  Save
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${
                                  task.status === "Done" ? "line-through text-gray-500" : "text-gray-800"
                                }`}>
                                  {task.name}
                                </div>
                                {task.assignee && (
                                  <div className="text-xs text-gray-500 mt-1">Assigned to: {task.assignee}</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {task.assignee && (
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowStatusDropdown(showStatusDropdown === task.id ? null : task.id);
                                      }}
                                      className={`px-3 py-1.5 rounded transition text-sm font-medium flex items-center gap-1 ${
                                        task.status === "Done" 
                                          ? "bg-green-500 text-white hover:bg-green-600"
                                          : task.status === "Pending"
                                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                          : "bg-blue-500 text-white hover:bg-blue-600"
                                      }`}
                                    >
                                      {task.status}
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                    {showStatusDropdown === task.id && (
                                      <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[140px]">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            if (selectedProject) {
                                              handleChangeSubTaskStatus(selectedProject.id, task.id, "On Develop", e);
                                            }
                                          }}
                                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm first:rounded-t-lg flex items-center gap-2"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                          On Develop
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            if (selectedProject) {
                                              handleChangeSubTaskStatus(selectedProject.id, task.id, "Done", e);
                                            }
                                          }}
                                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm flex items-center gap-2"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          Done
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            if (selectedProject) {
                                              handleChangeSubTaskStatus(selectedProject.id, task.id, "Pending", e);
                                            }
                                          }}
                                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm last:rounded-b-lg flex items-center gap-2"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                          Pending
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {isEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => handleEditSubTask(task.id)}
                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm flex items-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No subtasks added</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isEditMode ? (
                    <>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2"
                      >
                        Save Changes
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Cancel Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleMoveToNextPhase}
                        disabled={!isDoneButtonEnabled()}
                        className={`flex-1 px-6 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                          isDoneButtonEnabled()
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Done - Move to Next Phase
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseDetailModal}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
