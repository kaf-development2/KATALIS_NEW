"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Project Phase types
type ProjectPhase = "User Requirement" | "Analysis" | "System Design" | "Development" | "SIT" | "UAT" | "Deploy";

interface Project {
  id: string;
  name: string;
  phase: ProjectPhase;
  status: "complete" | "overdue" | "on-track";
  daysInfo?: string;
  projectType?: string;
  projectId?: string;
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
  status: "Deploy" | "Development" | "Analysis" | "System Design" | "User Requirement" | "SIT" | "UAT";
  duration: string;
  phaseStatus: "On Develop" | "Pending" | "Done";
  createdAt: string;
  doneAt?: string | null;
  statusHistory?: { status: "Deploy" | "Development" | "Analysis" | "System Design" | "User Requirement" | "SIT" | "UAT"; changedAt: string }[];
}

interface BacklogItem {
  id: string;
  projectName: string;
  description: string;
  severity: "Easy" | "Medium" | "Hard";
  status: "Open" | "Ongoing" | "Testing" | "Retest" | "Close";
  projectOwner: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  attachments: BacklogAttachment[];
  createdAt: string;
}

interface BacklogAttachment {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

export default function DeveloperPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All Projects");
  const [selectedTab, setSelectedTab] = useState<"project" | "cr" | "backlog">("project");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingCRProject, setIsAddingCRProject] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailModalContext, setDetailModalContext] = useState<"phaseDistribution" | "listDetails">("phaseDistribution");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backlogFormData, setBacklogFormData] = useState({
    projectName: "",
    description: "",
    severity: "Medium" as "Easy" | "Medium" | "Hard",
    status: "Open" as "Open" | "Ongoing" | "Testing" | "Retest" | "Close",
    projectOwner: "",
    assignedTo: "",
    startDate: "",
    endDate: "",
    attachments: [] as BacklogAttachment[],
  });
  const [backlogSearch, setBacklogSearch] = useState("");
  const [backlogProjectFilter, setBacklogProjectFilter] = useState("");
  const [isBacklogDetailModalOpen, setIsBacklogDetailModalOpen] = useState(false);
  const [selectedBacklogItem, setSelectedBacklogItem] = useState<BacklogItem | null>(null);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [showPhaseStatusDropdown, setShowPhaseStatusDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "New Project",
    projectId: "",
    projectOwner: "",
    startDate: "",
    endDate: "",
    projectLevel: "Medium",
    actualCost: "",
    budgetPlan: "",
    subTasks: [] as SubTask[],
  });

  const developers = ["Egi", "Luthfi", "Mila", "Indah", "Alicia", "Ka Rey", "Zulfikar", "Mawar", "Fara", "Firhan"];
  const projectOwners = ["BA", "CA", "CLCA", "CPPMO", "FATT", "HCGS", "IA", "IT", "MKT", "QA", "RM"];
  const backlogStatusOptions: BacklogItem["status"][] = ["Open", "Ongoing", "Testing", "Retest", "Close"];

  // Get next backlog ID
  const getNextBacklogId = () => {
    const lastItem = backlogItems[backlogItems.length - 1];
    if (!lastItem) return "BL - 001";
    const lastNum = parseInt(lastItem.id.split(" - ")[1]);
    return `BL - ${String(lastNum + 1).padStart(3, "0")}`;
  };

  // Get next project ID
  const getNextProjectId = (projectType: string): string => {
    const prefix = projectType === "CR" ? "CR" : "NP";
    const filteredProjects = projects.filter((p) => p.projectId && p.projectId.startsWith(prefix));
    
    if (filteredProjects.length === 0) return `${prefix} - 0001`;
    
    // Get the last project's ID and increment the number
    const lastProjectId = filteredProjects[filteredProjects.length - 1].projectId;
    if (!lastProjectId) return `${prefix} - 0001`;
    
    const lastNum = parseInt(lastProjectId.split(" - ")[1]);
    return `${prefix} - ${String(lastNum + 1).padStart(4, "0")}`;
  };

  const handleOpenBacklogModal = () => {
    setBacklogFormData({
      projectName: "",
      description: "",
      severity: "Medium",
      status: "Open",
      projectOwner: "",
      assignedTo: "",
      startDate: "",
      endDate: "",
      attachments: [],
    });
    setIsBacklogModalOpen(true);
  };

  const handleCloseBacklogModal = () => {
    setIsBacklogModalOpen(false);
    setBacklogFormData({
      projectName: "",
      description: "",
      severity: "Medium",
      status: "Open",
      projectOwner: "",
      assignedTo: "",
      startDate: "",
      endDate: "",
      attachments: [],
    });
  };

  const handleBacklogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBacklogItem: BacklogItem = {
      id: getNextBacklogId(),
      projectName: backlogFormData.projectName,
      description: backlogFormData.description,
      severity: backlogFormData.severity,
      status: backlogFormData.status,
      projectOwner: backlogFormData.projectOwner,
      assignedTo: backlogFormData.assignedTo,
      startDate: backlogFormData.startDate,
      endDate: backlogFormData.endDate,
      attachments: backlogFormData.attachments,
      createdAt: new Date().toISOString(),
    };
    setBacklogItems([...backlogItems, newBacklogItem]);
    handleCloseBacklogModal();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: `${file.name}-${Date.now()}-${index}`,
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        url: URL.createObjectURL(file),
      }));
      setBacklogFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setBacklogFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((attachment) => {
        if (attachment.id === attachmentId) {
          URL.revokeObjectURL(attachment.url);
          return false;
        }
        return true;
      })
    }));
  };

  const isImageAttachment = (mimeType: string, fileName: string) => {
    if (mimeType.startsWith("image/")) return true;
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName);
  };

  const handleDownloadAttachment = (attachment: BacklogAttachment) => {
    const anchor = document.createElement("a");
    anchor.href = attachment.url;
    anchor.download = attachment.name;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  };

  const handleDeleteBacklogAttachment = (backlogId: string, attachmentId: string) => {
    setBacklogItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== backlogId) return item;

        const updatedAttachments = item.attachments.filter((attachment) => {
          if (attachment.id === attachmentId) {
            URL.revokeObjectURL(attachment.url);
            return false;
          }
          return true;
        });

        return {
          ...item,
          attachments: updatedAttachments,
        };
      })
    );

    setSelectedBacklogItem((prev) => {
      if (!prev || prev.id !== backlogId) return prev;
      return {
        ...prev,
        attachments: prev.attachments.filter((attachment) => attachment.id !== attachmentId),
      };
    });
  };

  const handleBacklogStatusChange = (backlogId: string, newStatus: BacklogItem["status"]) => {
    setBacklogItems((prevItems) =>
      prevItems.map((item) => (item.id === backlogId ? { ...item, status: newStatus } : item))
    );

    setSelectedBacklogItem((prev) => {
      if (!prev || prev.id !== backlogId) return prev;
      return { ...prev, status: newStatus };
    });
  };

  const handleAddAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const calculateAgingDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "-";

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "-";
    }

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
  };

  const calculateOverdueDays = (endDate: string) => {
    if (!endDate) return "-";

    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (Number.isNaN(end.getTime())) {
      return "-";
    }

    if (today <= end) {
      return "0 day";
    }

    const diffTime = today.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
  };

  const filteredBacklogItems = backlogItems.filter((item) => {
    // Filter by project if selected
    if (backlogProjectFilter && item.projectName !== backlogProjectFilter) {
      return false;
    }

    // Filter by search keyword
    const keyword = backlogSearch.trim().toLowerCase();
    if (!keyword) return true;

    return (
      item.id.toLowerCase().includes(keyword) ||
      item.projectName.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.severity.toLowerCase().includes(keyword) ||
      item.projectOwner.toLowerCase().includes(keyword) ||
      item.assignedTo.toLowerCase().includes(keyword)
    );
  });

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

  const standardPhaseOrder: ProjectPhase[] = ["User Requirement", "System Design", "Development", "SIT", "UAT", "Deploy"];
  const crPhaseOrder: ProjectPhase[] = ["User Requirement", "Analysis", "Development", "Deploy"];

  const normalizeCRPhase = (phase?: ProjectPhase): ProjectPhase => {
    if (!phase) return "User Requirement";
    if (phase === "System Design") return "Analysis";
    if (phase === "SIT" || phase === "UAT") return "Development";
    if (crPhaseOrder.includes(phase)) return phase;
    return "User Requirement";
  };

  const normalizeCRSubTasks = (subTasks: SubTask[]): SubTask[] => {
    return subTasks.map((task) => {
      const normalizedStatus = normalizeCRPhase(task.status as ProjectPhase) as SubTask["status"];
      const normalizedHistory = (task.statusHistory || []).map((entry) => ({
        ...entry,
        status: normalizeCRPhase(entry.status as ProjectPhase) as SubTask["status"],
      }));

      return {
        ...task,
        status: normalizedStatus,
        statusHistory: normalizedHistory,
      };
    });
  };

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Fix old daysInfo format that may contain "overdue" word
        const fixedProjects = parsedProjects.map((project: Project) => {
          const isCRProject = project.projectType === "CR";
          const normalizedSubTasks = normalizeSubTasks(project.subTasks || []);
          const adjustedSubTasks = isCRProject ? normalizeCRSubTasks(normalizedSubTasks) : normalizedSubTasks;
          const adjustedPhase = isCRProject ? normalizeCRPhase(project.phase) : project.phase;

          if (project.daysInfo && project.daysInfo.includes("overdue")) {
            // Remove "overdue" from daysInfo
            const fixedDaysInfo = project.daysInfo.replace(/\s*overdue\s*/gi, '').trim();
            return { ...project, phase: adjustedPhase, daysInfo: fixedDaysInfo, subTasks: adjustedSubTasks };
          }
          return { ...project, phase: adjustedPhase, subTasks: adjustedSubTasks };
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
    setFormData({
      projectName: "",
      projectType: "New Project",
      projectId: "",
      projectOwner: "",
      startDate: "",
      endDate: "",
      projectLevel: "Medium",
      actualCost: "",
      budgetPlan: "",
      subTasks: [],
    });
    setIsAddingCRProject(false);
    setIsModalOpen(true);
  };

  const handleAddCRProject = () => {
    setFormData({
      projectName: "",
      projectType: "CR",
      projectId: "",
      projectOwner: "",
      startDate: "",
      endDate: "",
      projectLevel: "Medium",
      actualCost: "",
      budgetPlan: "",
      subTasks: [],
    });
    setIsAddingCRProject(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAddingCRProject(false);
    setFormData({
      projectName: "",
      projectType: "New Project",
      projectId: "",
      projectOwner: "",
      startDate: "",
      endDate: "",
      projectLevel: "Medium",
      actualCost: "",
      budgetPlan: "",
      subTasks: [],
    });
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
      projectId: normalizedProject.projectId || "",
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
      projectId: "",
      projectOwner: "",
      startDate: "",
      endDate: "",
      projectLevel: "Medium",
      actualCost: "",
      budgetPlan: "",
      subTasks: [],
    });
  };

  const handleOpenDeleteModal = (project: Project, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleConfirmDeleteProject = () => {
    if (!projectToDelete) return;

    if (selectedProject?.id === projectToDelete.id) {
      handleCloseDetailModal();
    }

    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.filter((project) => project.id !== projectToDelete.id);
      if (updatedProjects.length > 0) {
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      } else {
        localStorage.removeItem("projects");
      }
      return updatedProjects;
    });

    handleCloseDeleteModal();
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
      projectId: formData.projectId,
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

    // Determine project type based on which button was clicked
    const projectType = isAddingCRProject ? "CR" : "New Project";

    // Generate project ID
    const projectId = getNextProjectId(projectType);

    // Create new project
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.projectName,
      phase: "User Requirement",
      status: status,
      daysInfo: daysInfo,
      projectType: projectType,
      projectId: projectId,
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
      projectId: "",
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

  const handleChangeSubTaskStatus = (projectId: string, subTaskId: string, newStatus: SubTask["status"], e: React.MouseEvent) => {
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

    const phaseOrder = selectedProject.projectType === "CR" ? crPhaseOrder : standardPhaseOrder;
    const currentPhase = selectedProject.projectType === "CR"
      ? normalizeCRPhase(selectedProject.phase)
      : selectedProject.phase;
    const currentIndex = phaseOrder.indexOf(currentPhase);
    
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
    { name: "SIT", key: "SIT" },
    { name: "UAT", key: "UAT" },
    { name: "Deploy", key: "Deploy" },
  ];

  const crPhases: { name: string; key: ProjectPhase }[] = [
    { name: "User Requirement", key: "User Requirement" },
    { name: "Analysis", key: "Analysis" },
    { name: "Development", key: "Development" },
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
            </div>
          </div>

          {/* Merged Section: Tabs + Project Phase Distribution + List Project Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Tabs Section */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setSelectedTab("project")}
                className={`px-6 py-3 font-medium transition relative ${
                  selectedTab === "project"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Project</span>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    selectedTab === "project"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {projects.filter(p => p.projectType !== "CR").length}
                  </span>
                </div>
                {selectedTab === "project" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></div>
                )}
              </button>

              <button
                onClick={() => setSelectedTab("cr")}
                className={`px-6 py-3 font-medium transition relative ${
                  selectedTab === "cr"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>CR</span>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    selectedTab === "cr"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {projects.filter(p => p.projectType === "CR").length}
                  </span>
                </div>
                {selectedTab === "cr" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></div>
                )}
              </button>

              <button
                onClick={() => setSelectedTab("backlog")}
                className={`px-6 py-3 font-medium transition relative ${
                  selectedTab === "backlog"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Backlog</span>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    selectedTab === "backlog"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {backlogItems.filter(item => item.status !== "Close").length}
                  </span>
                </div>
                {selectedTab === "backlog" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></div>
                )}
              </button>
            </div>

            {/* Project Phase Distribution - Shown when Project tab is selected */}
            {selectedTab === "project" && (
            <div>
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

            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-3 min-w-max">
                {phases.map((phase) => {
                const phaseProjects = getProjectsByPhase(phase.key).filter(p => p.projectType !== "CR");
                return (
                  <div key={phase.key} className="bg-gray-100 rounded-lg p-4 w-80">
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
                          <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                            <h4 className="text-sm font-semibold flex-1 min-w-0 break-words whitespace-normal leading-snug">{project.name}</h4>
                            <button
                              type="button"
                              onClick={(e) => handleOpenDeleteModal(project, e)}
                              className="text-gray-400 hover:text-red-600 transition"
                              aria-label={`Delete ${project.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8" />
                              </svg>
                            </button>
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
            </div>
            )}

            {/* List Project Details Table */}
            {selectedTab === "project" && (
            <div className="pt-6 border-t border-gray-200">
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
                  {projects.filter(p => p.projectType !== "CR").length > 0 ? (
                    projects.filter(p => p.projectType !== "CR").map((project) => {
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
                                : project.phase === "System Design" || project.phase === "Analysis"
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
            )}

            {/* CR Project Phase Distribution - Shown when CR tab is selected */}
            {selectedTab === "cr" && (
            <div>
              <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                CR Project phase distribution
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-4 gap-3 min-w-max">
                {crPhases.map((phase) => {
                const phaseProjects = getProjectsByPhase(phase.key).filter(p => p.projectType === "CR");
                return (
                  <div key={phase.key} className="bg-gray-100 rounded-lg p-4 w-80">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">{phase.name}</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{phaseProjects.length}</div>
                    <div className="text-sm text-gray-500 mb-4">CR Projects</div>
                    
                    {phase.key === "User Requirement" && (
                      <button 
                        onClick={handleAddCRProject}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm mb-4"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add CR Project
                      </button>
                    )}
                    
                    <div className="space-y-3 gap-1 max-h-[400px] overflow-y-auto pr-1">
                      {phaseProjects.map((project) => (
                        <div 
                          key={project.id} 
                          onClick={() => handleOpenProjectDetail(project, "phaseDistribution")}
                          className="bg-white border border-gray-300 text-gray-800 rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                            <h4 className="text-sm font-semibold flex-1 min-w-0 break-words whitespace-normal leading-snug">{project.name}</h4>
                            <button
                              type="button"
                              onClick={(e) => handleOpenDeleteModal(project, e)}
                              className="text-gray-400 hover:text-red-600 transition"
                              aria-label={`Delete ${project.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8" />
                              </svg>
                            </button>
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

            <div className="pt-6 border-t border-gray-200 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                CR List project details
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
                    {projects.filter((project) => project.projectType === "CR").length > 0 ? (
                      projects
                        .filter((project) => project.projectType === "CR")
                        .map((project) => {
                          const assignees = project.subTasks
                            ? Array.from(new Set(project.subTasks
                                .filter(task => task.assignee)
                                .map(task => task.assignee)))
                            : [];

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
                                    : project.phase === "System Design" || project.phase === "Analysis"
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
                          No CR projects available. Click "Add CR Project" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            </div>
            )}

            {/* Backlog Content - Shown when Backlog tab is selected */}
            {selectedTab === "backlog" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  List Backlog Project
                </h2>
                <div className="flex items-center gap-3">
                  <select
                    value={backlogProjectFilter}
                    onChange={(e) => setBacklogProjectFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>{project.name}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or type a command..."
                      value={backlogSearch}
                      onChange={(event) => setBacklogSearch(event.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white w-60"
                    />
                    <svg className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button onClick={handleOpenBacklogModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Backlog
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Severity</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PIC</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date Create</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aging</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBacklogItems.length > 0 ? (
                        filteredBacklogItems.map((item) => (
                          <tr 
                            key={item.id} 
                            className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                            onClick={() => {
                              setSelectedBacklogItem(item);
                              setIsBacklogDetailModalOpen(true);
                            }}
                          >
                            <td className="py-3 px-4 text-sm whitespace-nowrap">
                              <span
                                className={`inline-flex items-center rounded-md px-2.5 py-1 font-medium ${
                                  item.status === "Open"
                                    ? "bg-red-100 text-red-700"
                                    : item.status === "Ongoing"
                                    ? "bg-orange-100 text-orange-700"
                                    : item.status === "Testing" || item.status === "Retest"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{item.projectName}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 max-w-[240px] truncate" title={item.description || "-"}>
                              {item.description || "-"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{item.severity}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{item.projectOwner}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{item.assignedTo || "-"}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{item.startDate || "-"}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{calculateAgingDays(item.startDate, item.endDate)}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{calculateOverdueDays(item.endDate)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-gray-500 text-sm">
                            {backlogItems.length === 0
                              ? 'No backlog data yet. Click "Add Backlog" to create one.'
                              : "No backlog data matches your search."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}
          </div>

          
        </main>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{isAddingCRProject ? "Add CR Project" : "Add Project"}</h2>
              
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
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm">
                      {formData.projectType}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Owner
                    </label>
                    <select
                      value={formData.projectOwner}
                      onChange={(e) => setFormData({ ...formData, projectOwner: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Project Owner</option>
                      <option value="BA">BA</option>
                      <option value="CA">CA</option>
                      <option value="CLCA">CLCA</option>
                      <option value="CPPMO">CPPMO</option>
                      <option value="FATT">FATT</option>
                      <option value="HCGS">HCGS</option>
                      <option value="IA">IA</option>
                      <option value="IT">IT</option>
                      <option value="MKT">MKT</option>
                      <option value="QA">QA</option>
                      <option value="RM">RM</option>
                    </select>
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
                                      : task.status === "System Design" || task.status === "Analysis"
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && projectToDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8 md:p-12 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">Warning Alert!</h3>
            <p className="text-gray-600 text-lg mb-8">
              Are you sure want to delete {projectToDelete.name}?
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProject}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Okay, Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Backlog Modal */}
      {isBacklogModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Add Backlog Project</h2>
              
              <form onSubmit={handleBacklogSubmit}>
                {/* Project Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <select
                    value={backlogFormData.projectName}
                    onChange={(e) => {
                      const selectedProjectName = e.target.value;
                      const selectedProject = projects.find((project) => project.name === selectedProjectName);
                      setBacklogFormData({
                        ...backlogFormData,
                        projectName: selectedProjectName,
                        projectOwner: selectedProject?.projectOwner || "",
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>{project.name}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter task description"
                    value={backlogFormData.description}
                    onChange={(e) => setBacklogFormData({ ...backlogFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* ID Backlog and Project Owner */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Backlog
                    </label>
                    <div className="w-full h-10 px-4 bg-gray-100 rounded-lg text-gray-800 text-sm border border-gray-300 flex items-center">
                      {getNextBacklogId()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Owner
                    </label>
                    <input
                      type="text"
                      value={backlogFormData.projectOwner}
                      placeholder="Auto from selected project"
                      className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                      disabled
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
                      value={backlogFormData.startDate}
                      onChange={(e) => setBacklogFormData({ ...backlogFormData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={backlogFormData.endDate}
                      onChange={(e) => setBacklogFormData({ ...backlogFormData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Severity and Status */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={backlogFormData.severity}
                      onChange={(e) => setBacklogFormData({ ...backlogFormData, severity: e.target.value as "Easy" | "Medium" | "Hard" })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={backlogFormData.status}
                      onChange={(e) => setBacklogFormData({ ...backlogFormData, status: e.target.value as "Open" | "Ongoing" | "Testing" | "Retest" | "Close" })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {backlogStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>{statusOption}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assign to and Attachment */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to
                    </label>
                    <select
                      value={backlogFormData.assignedTo}
                      onChange={(e) => setBacklogFormData({ ...backlogFormData, assignedTo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">--Select Developer--</option>
                      {developers.map((dev) => (
                        <option key={dev} value={dev}>{dev}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment
                    </label>
                    <div className="flex items-center gap-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        onClick={handleAddAttachmentClick}
                        className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition font-medium text-sm whitespace-nowrap"
                      >
                        Choose file
                      </button>
                      <span className="flex-1 text-gray-600 text-sm pl-4">
                        {backlogFormData.attachments.length > 0
                          ? `${backlogFormData.attachments.length} file${backlogFormData.attachments.length > 1 ? 's' : ''} chosen`
                          : 'No file chosen'}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />
                  </div>
                </div>

                {/* Attachments List */}
                {backlogFormData.attachments.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Uploaded Attachments ({backlogFormData.attachments.length})
                    </label>
                    <div className="space-y-2">
                      {backlogFormData.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-sm text-gray-800 truncate">{attachment.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                            className="text-gray-400 hover:text-red-600 transition"
                            title="Remove attachment"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    Submit
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseBacklogModal}
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

      {/* Backlog Detail Modal */}
      {isBacklogDetailModalOpen && selectedBacklogItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsBacklogDetailModalOpen(false)}
        >
          <div
            className="bg-gray-100 rounded-[28px] shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-8 md:px-10 md:py-9">
              <div className="flex items-start justify-between gap-5 mb-5">
                <h2 className="text-[30px] font-bold leading-tight text-gray-900">
                  {(selectedBacklogItem.projectName || "(Project Name)")}
                </h2>
                <div className="text-[13px] font-regular text-gray-900 mt-1">{selectedBacklogItem.id}</div>
                <span
                  className={`inline-flex items-center rounded-lg px-4 py-1.5 text-sm font-semibold whitespace-nowrap ${
                    selectedBacklogItem.severity === "Easy"
                      ? "bg-teal-100 text-teal-700"
                      : selectedBacklogItem.severity === "Hard"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedBacklogItem.severity}
                </span>
              </div>
              <div className="text-[15px] font-medium text-gray-900 mb-1">Task Description</div>
              <p className="text-[13px] font-regular text-gray-700 break-words min-h-[24px]">
                {selectedBacklogItem.description || "-"}
              </p>

              <div className="grid grid-cols-3 gap-10 mt-4 max-w-md">
                <div>
                  <div className="text-[13px] font-regular text-gray-900">Start Date</div>
                  <div className="text-[13px] font-regular text-gray-900 mt-1">{selectedBacklogItem.startDate || "-"}</div>
                </div>
                <div>
                  <div className="text-[13px] font-regular text-gray-900">End Date</div>
                  <div className="text-[13px] font-regular text-gray-900 mt-1">{selectedBacklogItem.endDate || "-"}</div>
                </div>
                <div>
                  <div className="text-[13px] font-regular text-gray-900">Overdue</div>
                  <div className="text-[13px] font-regular text-gray-900 mt-1">{calculateOverdueDays(selectedBacklogItem.endDate)}</div>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-sm font-semibold text-slate-600 mb-3">
                  Attachments ({selectedBacklogItem.attachments.length})
                </div>
                {selectedBacklogItem.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBacklogItem.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-700 truncate">{attachment.name}</p>
                            {isImageAttachment(attachment.mimeType, attachment.name) && (
                              <button
                                type="button"
                                onClick={() => window.open(attachment.url, "_blank", "noopener,noreferrer")}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                View image
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDownloadAttachment(attachment)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 transition"
                            title="Download"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-5l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 px-3 py-5 text-sm text-gray-500 bg-white/50">
                    No attachments.
                  </div>
                )}
              </div>

              <div className="pt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBacklogDetailModalOpen(false)}
                className="px-7 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-white transition font-semibold"
              >
                Close
              </button>
                <select
                  value={selectedBacklogItem.status}
                  onChange={(e) => handleBacklogStatusChange(selectedBacklogItem.id, e.target.value as BacklogItem["status"])}
                  className="px-4 py-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Backlog status"
                >
                  {backlogStatusOptions.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>{statusOption}</option>
                  ))}
                </select>
              </div>
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

                {/* Project ID */}
                {!isEditMode && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project ID
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm font-medium">
                      {formData.projectId || "N/A"}
                    </div>
                  </div>
                )}

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
                      <select
                        value={formData.projectOwner}
                        onChange={(e) => setFormData({ ...formData, projectOwner: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">Select Project Owner</option>
                        <option value="BA">BA</option>
                        <option value="CA">CA</option>
                        <option value="CLCA">CLCA</option>
                        <option value="CPPMO">CPPMO</option>
                        <option value="FATT">FATT</option>
                        <option value="HCGS">HCGS</option>
                        <option value="IA">IA</option>
                        <option value="IT">IT</option>
                        <option value="MKT">MKT</option>
                        <option value="QA">QA</option>
                        <option value="RM">RM</option>
                      </select>
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

              {/* Project ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project ID
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 text-sm font-medium">
                  {formData.projectId || "N/A"}
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
                                    : entry.status === "System Design" || entry.status === "Analysis"
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
