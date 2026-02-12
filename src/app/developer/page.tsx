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
  status: "Deploy" | "Development" | "System Design" | "User Requirement" | "UAT";
  duration: string;
  phaseStatus: "On Develop" | "Pending" | "Done";
  createdAt: string;
  doneAt?: string | null;
  statusHistory?: { status: "Deploy" | "Development" | "System Design" | "User Requirement" | "UAT"; changedAt: string }[];
}

export default function DeveloperPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All Projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailModalContext, setDetailModalContext] = useState<"phaseDistribution" | "listDetails">("phaseDistribution");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [showPhaseStatusDropdown, setShowPhaseStatusDropdown] = useState<string | null>(null);
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

  // Function to calculate project status automatically
  const calculateProjectStatus = (phase: ProjectPhase, endDate?: string): { status: "complete" | "overdue" | "on-track"; daysInfo?: string } => {
    // If project is in Deploy phase, it's complete
    if (phase === "Deploy") {
      return { status: "complete" };
    }

    // If no end date, default to on-track
    if (!endDate) {
      return { status: "on-track" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // If today is after end date, project is overdue
    if (today > end) {
      const diffTime = Math.abs(today.getTime() - end.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { 
        status: "overdue", 
        daysInfo: `${diffDays} days`
      };
    }

    // Otherwise, project is on-track
    return { status: "on-track" };
  };

  const normalizeSubTasks = (subTasks: SubTask[] = []) => {
    return subTasks.map((task) => {
      const createdAt = task.createdAt || new Date().toISOString();
      const statusHistory = task.statusHistory && task.statusHistory.length > 0
        ? task.statusHistory
        : [{ status: task.status || "User Requirement", changedAt: createdAt }];
      return {
        ...task,
        status: task.status || "User Requirement",
        phaseStatus: task.phaseStatus || "Pending",
        createdAt,
        doneAt: task.doneAt ?? null,
        statusHistory,
      };
    });
  };

  const appendStatusHistory = (task: SubTask, newStatus: SubTask["status"]) => {
    const history = task.statusHistory || [];
    const lastStatus = history.length > 0 ? history[history.length - 1].status : null;
    if (lastStatus === newStatus) {
      return { ...task, status: newStatus };
    }
    return {
      ...task,
      status: newStatus,
      statusHistory: [...history, { status: newStatus, changedAt: new Date().toISOString() }],
    };
  };

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Fix old daysInfo format that may contain "overdue" word
        const fixedProjects = parsedProjects.map((project: Project) => {
          const normalizedSubTasks = normalizeSubTasks(project.subTasks || []);
          if (project.daysInfo && project.daysInfo.includes("overdue")) {
            // Remove "overdue" from daysInfo
            const fixedDaysInfo = project.daysInfo.replace(/\s*overdue\s*/gi, '').trim();
            return { ...project, daysInfo: fixedDaysInfo, subTasks: normalizedSubTasks };
          }
          return { ...project, subTasks: normalizedSubTasks };
        });
        setProjects(fixedProjects);
        console.log("Loaded projects from localStorage:", fixedProjects);
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

  useEffect(() => {
    if (!isDetailModalOpen || detailModalContext !== "phaseDistribution") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isEditMode) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      handleCloseDetailModal();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isDetailModalOpen, detailModalContext, isEditMode]);

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenProjectDetail = (project: Project, context: "phaseDistribution" | "listDetails") => {
    const normalizedProject = {
      ...project,
      subTasks: normalizeSubTasks(project.subTasks || []),
    };
    setSelectedProject(normalizedProject);
    setDetailModalContext(context);
    setFormData({
      projectName: normalizedProject.name,
      projectType: normalizedProject.projectType || "New Project",
      projectOwner: normalizedProject.projectOwner || "",
      startDate: normalizedProject.startDate || "",
      endDate: normalizedProject.endDate || "",
      projectLevel: normalizedProject.projectLevel || "Medium",
      actualCost: normalizedProject.actualCost || "",
      budgetPlan: normalizedProject.budgetPlan || "",
      subTasks: normalizedProject.subTasks || [],
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

    // Calculate status automatically based on current phase and end date
    const { status, daysInfo } = calculateProjectStatus(selectedProject.phase, formData.endDate);

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
      subTasks: normalizeSubTasks(formData.subTasks),
      status: status,
      daysInfo: daysInfo,
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

    // Calculate status automatically
    const { status, daysInfo } = calculateProjectStatus("User Requirement", formData.endDate);

    // Create new project
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.projectName,
      phase: "User Requirement",
      status: status,
      daysInfo: daysInfo,
      projectType: formData.projectType,
      projectOwner: formData.projectOwner,
      projectLevel: formData.projectLevel,
      startDate: formData.startDate,
      endDate: formData.endDate,
      actualCost: formData.actualCost,
      budgetPlan: formData.budgetPlan,
      subTasks: normalizeSubTasks(formData.subTasks),
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
    const createdAt = new Date().toISOString();
    const currentPhase = selectedProject?.phase || "User Requirement";
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      name: "",
      assignee: "",
      isEditing: true,
      status: currentPhase,
      duration: "",
      phaseStatus: "Pending",
      createdAt,
      doneAt: null,
      statusHistory: [{ status: currentPhase, changedAt: createdAt }],
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      subTasks: [...prevFormData.subTasks, newSubTask],
    }));
  };

  const handleChangeSubTaskStatus = (projectId: string, subTaskId: string, newStatus: "Deploy" | "Development" | "System Design" | "User Requirement" | "UAT", e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update projects state
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            subTasks: project.subTasks?.map(task =>
              task.id === subTaskId ? appendStatusHistory(task, newStatus) : task
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
        task.id === subTaskId ? appendStatusHistory(task, newStatus) : task
      ),
    }));
    
    setShowStatusDropdown(null);
  };

  const handleSubTaskStatusChangeInFormData = (subTaskId: string, newStatus: SubTask["status"]) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      subTasks: prevFormData.subTasks.map(task =>
        task.id === subTaskId ? appendStatusHistory(task, newStatus) : task
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
      
      // Calculate new status based on the new phase
      const { status, daysInfo } = calculateProjectStatus(nextPhase, selectedProject.endDate);
      
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id ? { ...project, phase: nextPhase, status, daysInfo } : project
        )
      );
      
      handleCloseDetailModal();
    }
  };

  const isDoneButtonEnabled = () => {
    return formData.subTasks.length > 0 && formData.subTasks.every(task => task.phaseStatus === "Done");
  };

  const handleSaveSubTask = (id: string) => {
    setFormData((prevFormData) => {
      const updatedSubTasks = prevFormData.subTasks.map(task =>
        task.id === id ? { ...task, isEditing: false } : task
      );

      if (selectedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === selectedProject.id
              ? { ...project, subTasks: updatedSubTasks }
              : project
          )
        );
        setSelectedProject(prevSelected =>
          prevSelected ? { ...prevSelected, subTasks: updatedSubTasks } : prevSelected
        );
      }

      return {
        ...prevFormData,
        subTasks: updatedSubTasks,
      };
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

  const handleSubTaskChange = (id: string, field: 'name' | 'duration', value: string) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.map(task => 
        task.id === id ? { ...task, [field]: value } : task
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
    if (selectedProject) {
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id
            ? {
                ...project,
                subTasks: project.subTasks?.map(task =>
                  task.id === id ? { ...task, assignee } : task
                ),
              }
            : project
        )
      );
    }
    setShowAssigneeDropdown(null);
  };

  const handlePhaseStatusChange = (projectId: string, subTaskId: string, newStatus: "On Develop" | "Pending" | "Done") => {
    const doneAt = newStatus === "Done" ? new Date().toISOString() : null;
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            subTasks: project.subTasks?.map(task =>
              task.id === subTaskId ? { ...task, phaseStatus: newStatus, doneAt } : task
            ),
          };
        }
        return project;
      })
    );

    setFormData(prevFormData => ({
      ...prevFormData,
      subTasks: prevFormData.subTasks.map(task =>
        task.id === subTaskId ? { ...task, phaseStatus: newStatus, doneAt } : task
      ),
    }));

    setShowPhaseStatusDropdown(null);
  };

  const handlePhaseStatusChangeInFormData = (subTaskId: string, newStatus: "On Develop" | "Pending" | "Done") => {
    const doneAt = newStatus === "Done" ? new Date().toISOString() : null;
    setFormData(prevFormData => ({
      ...prevFormData,
      subTasks: prevFormData.subTasks.map(task =>
        task.id === subTaskId ? { ...task, phaseStatus: newStatus, doneAt } : task
      ),
    }));
    setShowPhaseStatusDropdown(null);
  };

  const getSubTaskDuration = (task: SubTask) => {
    if (!task.createdAt) return "Not set";
    if (!task.doneAt) return "Not done";
    const start = new Date(task.createdAt);
    const end = new Date(task.doneAt);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yy = String(date.getFullYear()).slice(-2);
      return `${dd}/${mm}/${yy}`;
    };
    return `${formatDate(start)} - ${formatDate(end)} · ${diffDays} days`;
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
                    
                    <div className="space-y-3 gap-1 max-h-[400px] overflow-y-auto pr-1">
                      {phaseProjects.map((project) => (
                        <div 
                          key={project.id} 
                          onClick={() => handleOpenProjectDetail(project, "phaseDistribution")}
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
                          {project.status === "overdue" && (
                            <div className="flex items-center gap-1 text-xs bg-red-600 text-white px-2 py-1 rounded w-fit">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Overdue {project.daysInfo && `(${project.daysInfo})`}
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
                          onClick={() => handleOpenProjectDetail(project, "listDetails")}
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
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, projectLevel: "Easy" })}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.projectLevel === "Easy"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 bg-white hover:border-teal-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`font-bold text-lg mb-1 ${
                          formData.projectLevel === "Easy" ? "text-teal-700" : "text-gray-800"
                        }`}>Easy</div>
                        <div className="text-gray-600 text-xs">5 days/phase</div>
                        <div className="text-gray-600 text-xs">30 days total</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, projectLevel: "Medium" })}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.projectLevel === "Medium"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white hover:border-blue-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`font-bold text-lg mb-1 ${
                          formData.projectLevel === "Medium" ? "text-blue-700" : "text-gray-800"
                        }`}>Medium</div>
                        <div className="text-gray-600 text-xs">10 days/phase</div>
                        <div className="text-gray-600 text-xs">60 days total</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, projectLevel: "Hard" })}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.projectLevel === "Hard"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-white hover:border-red-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`font-bold text-lg mb-1 ${
                          formData.projectLevel === "Hard" ? "text-red-700" : "text-gray-800"
                        }`}>Hard</div>
                        <div className="text-gray-600 text-xs">15 days/phase</div>
                        <div className="text-gray-600 text-xs">90 days total</div>
                      </div>
                    </button>
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
                                  placeholder="Enter task name"
                                  value={task.name}
                                  onChange={(e) => handleSubTaskChange(task.id, 'name', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Assignee Dropdown */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === task.id ? null : task.id)}
                                    className="px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm bg-purple-100 text-purple-700"
                                  >
                                    {task.assignee || "Assign person"}
                                  </button>
                                  {showAssigneeDropdown === task.id && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[160px] max-h-56 overflow-y-auto">
                                      {developers.map((dev) => (
                                        <button
                                          key={dev}
                                          type="button"
                                          onClick={() => handleAssigneeChange(task.id, dev)}
                                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
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
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    task.status === "Deploy" 
                                      ? "bg-green-100 text-green-700"
                                      : task.status === "UAT"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : task.status === "Development"
                                      ? "bg-orange-100 text-orange-700"
                                      : task.status === "System Design"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}>
                                    {task.status}
                                  </span>
                                  {task.duration && (
                                    <span className="text-xs text-gray-500">• {task.duration}</span>
                                  )}
                                </div>
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

      {/* Project Detail Modal - Phase Distribution */}
      {isDetailModalOpen && selectedProject && detailModalContext === "phaseDistribution" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            if (!isEditMode) {
              handleCloseDetailModal();
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Project Details</h2>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2 text-sm"
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
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">{formData.projectName}</div>
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
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">{formData.projectType}</div>
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
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">{formData.projectOwner}</div>
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
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">{formData.startDate || "Not set"}</div>
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
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">{formData.endDate || "Not set"}</div>
                    )}
                  </div>
                </div>

                {/* Project Level */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Level <span className="text-red-500">*</span>
                  </label>
                  {isEditMode ? (
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLevel: "Easy" })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.projectLevel === "Easy"
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-300 bg-white hover:border-teal-500"
                        }`}
                      >
                        <div className="text-center">
                          <div className={`font-bold text-lg mb-1 ${
                            formData.projectLevel === "Easy" ? "text-teal-700" : "text-gray-800"
                          }`}>Easy</div>
                          <div className="text-gray-600 text-xs">5 days/phase</div>
                          <div className="text-gray-600 text-xs">30 days total</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLevel: "Medium" })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.projectLevel === "Medium"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white hover:border-blue-500"
                        }`}
                      >
                        <div className="text-center">
                          <div className={`font-bold text-lg mb-1 ${
                            formData.projectLevel === "Medium" ? "text-blue-700" : "text-gray-800"
                          }`}>Medium</div>
                          <div className="text-gray-600 text-xs">10 days/phase</div>
                          <div className="text-gray-600 text-xs">60 days total</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, projectLevel: "Hard" })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.projectLevel === "Hard"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 bg-white hover:border-red-500"
                        }`}
                      >
                        <div className="text-center">
                          <div className={`font-bold text-lg mb-1 ${
                            formData.projectLevel === "Hard" ? "text-red-700" : "text-gray-800"
                          }`}>Hard</div>
                          <div className="text-gray-600 text-xs">15 days/phase</div>
                          <div className="text-gray-600 text-xs">90 days total</div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
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

                {/* Sub Task */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sub Task
                  </label>
                  {selectedProject.phase !== "Deploy" && (
                    <button
                      type="button"
                      onClick={handleAddSubTask}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2 text-sm mb-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Subtask
                    </button>
                  )}

                  {formData.subTasks.length > 0 ? (
                    <div className="space-y-3 max-h-[360px] overflow-y-auto">
                      {formData.subTasks.map((task) => (
                        <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          {task.isEditing ? (
                            <div className="space-y-2">
                              <div className="flex items-start gap-3">
                                <input
                                  type="text"
                                  placeholder="Enter subtask name"
                                  value={task.name}
                                  onChange={(e) => handleSubTaskChange(task.id, "name", e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCancelSubTask(task.id)}
                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-xs"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveSubTask(task.id)}
                                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-xs"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                                <span>{formData.projectName || "Project"}</span>
                                <span className="text-gray-300">•</span>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === task.id ? null : task.id)}
                                    className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 text-left inline-flex items-center justify-between gap-2"
                                  >
                                    {task.assignee || "Assign person"}
                                  </button>
                                  {showAssigneeDropdown === task.id && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[180px] max-h-56 overflow-y-auto">
                                      {developers.map((dev) => (
                                        <button
                                          key={dev}
                                          type="button"
                                          onClick={() => handleAssigneeChange(task.id, dev)}
                                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                        >
                                          {dev}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-800 break-words">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      placeholder="Enter subtask name"
                                      value={task.name}
                                      onChange={(e) => handleSubTaskChange(task.id, "name", e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                  ) : (
                                    task.name || "Untitled"
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                                  <span>{formData.projectName || "Project"}</span>
                                  <span className="text-gray-300">•</span>
                                  {isEditMode ? (
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => setShowAssigneeDropdown(showAssigneeDropdown === task.id ? null : task.id)}
                                        className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 text-left inline-flex items-center justify-between gap-2"
                                      >
                                        {task.assignee || "Assign person"}
                                      </button>
                                      {showAssigneeDropdown === task.id && (
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[180px] max-h-56 overflow-y-auto">
                                          {developers.map((dev) => (
                                            <button
                                              key={dev}
                                              type="button"
                                              onClick={() => handleAssigneeChange(task.id, dev)}
                                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                            >
                                              {dev}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span>{task.assignee || "Unassigned"}</span>
                                  )}
                                </div>
                              </div>
                              {!isEditMode && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setShowPhaseStatusDropdown(showPhaseStatusDropdown === task.id ? null : task.id)}
                                    className={`px-3 py-1 rounded text-xs font-medium ${
                                      task.phaseStatus === "Done"
                                        ? "bg-green-100 text-green-700"
                                        : task.phaseStatus === "On Develop"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-gray-100 text-gray-700"
                                    } inline-flex items-center justify-between gap-2 whitespace-nowrap`}
                                  >
                                    {task.phaseStatus}
                                  </button>
                                  {showPhaseStatusDropdown === task.id && selectedProject && (
                                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-30 min-w-[160px] max-h-44 overflow-y-auto">
                                      <button
                                        type="button"
                                        onClick={() => handlePhaseStatusChange(selectedProject.id, task.id, "On Develop")}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                      >
                                        On Develop
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handlePhaseStatusChange(selectedProject.id, task.id, "Pending")}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                      >
                                        Pending
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handlePhaseStatusChange(selectedProject.id, task.id, "Done")}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic py-4 px-3 bg-gray-50 rounded-md">No subtasks added</div>
                  )}
                </div>

                <div className="flex gap-3">
                  {isEditMode ? (
                    <>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2 text-sm"
                      >
                        Save Changes
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditMode(false);
                          handleCloseDetailModal();
                        }}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium text-sm"
                      >
                        Cancel Edit
                      </button>
                    </>
                  ) : (
                    <>
                      {selectedProject.phase !== "Deploy" && (
                        <button
                          type="button"
                          onClick={handleMoveToNextPhase}
                          disabled={!isDoneButtonEnabled()}
                          className={`flex-1 px-6 py-2.5 rounded-md transition font-medium flex items-center justify-center gap-2 text-sm ${
                            isDoneButtonEnabled()
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Done - Move to Next Phase
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal - List Details */}
      {isDetailModalOpen && selectedProject && detailModalContext === "listDetails" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseDetailModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Project Details</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
                  formData.projectLevel === "Easy"
                    ? "bg-teal-100 text-teal-700"
                    : formData.projectLevel === "Medium"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {formData.projectLevel}
                </span>
              </div>

              {/* Project Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">
                  {formData.projectName}
                </div>
              </div>

              {/* Project Type and Project Owner */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">
                    {formData.projectType}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Owner
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">
                    {formData.projectOwner}
                  </div>
                </div>
              </div>

              {/* Start Date and End Date */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">
                    {formData.startDate || "Not set"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">
                    {formData.endDate || "Not set"}
                  </div>
                </div>
              </div>

              {/* Sub Task */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sub Task
                </label>
                {formData.subTasks.length > 0 ? (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Subtask Name</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Phase Distribution</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.subTasks.flatMap((task) => {
                          const history = task.statusHistory && task.statusHistory.length > 0
                            ? task.statusHistory
                            : [{ status: task.status, changedAt: task.createdAt }];
                          return history.map((entry, idx) => (
                            <tr key={`${task.id}-${entry.status}-${idx}`} className="border-b border-gray-100">
                              <td className="px-4 py-3 text-gray-800">
                                <div className="font-medium">{task.name || "Untitled"}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                   {getSubTaskDuration(task)}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded text-xs font-medium ${
                                  entry.status === "Deploy"
                                    ? "bg-green-100 text-green-700"
                                    : entry.status === "UAT"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : entry.status === "Development"
                                    ? "bg-orange-100 text-orange-700"
                                    : entry.status === "System Design"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {entry.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded text-xs font-medium ${
                                  task.phaseStatus === "Done"
                                    ? "bg-green-100 text-green-700"
                                    : task.phaseStatus === "On Develop"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {task.phaseStatus}
                                </span>
                              </td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic py-4 px-3 bg-gray-50 rounded-md">No subtasks added</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
