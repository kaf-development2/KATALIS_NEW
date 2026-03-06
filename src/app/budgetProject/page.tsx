"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Project {
  id: string;
  name: string;
  phase: string;
  status: string;
  projectType?: string;
}

interface BudgetData {
  totalBudget: string;
  manPower: string;
  projectDuration: string;
  totalProjects: number;
  budgetPerProject: string;
  manDayCost: string;
  manMonthPerProject: string;
  totalManDays: string;
  workingDays: string;
}

interface ProjectWithBudget {
  bpId: string;
  name: string;
  projectLevel: string;
  actualCost: string;
  budgetCost: string;
  status: string;
}

export default function BudgetProjectPage() {
  const router = useRouter();
  const [budgetData, setBudgetData] = useState<BudgetData>({
    totalBudget: "$120,369",
    manPower: "$234,210",
    projectDuration: "$120,369",
    totalProjects: 0,
    budgetPerProject: "-",
    manDayCost: "-",
    manMonthPerProject: "-",
    totalManDays: "-",
    workingDays: "-",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [projectsList, setProjectsList] = useState<ProjectWithBudget[]>([]);

  const editableFields = ["totalBudget", "manPower", "projectDuration", "workingDays"];

  const formatWithThousandSeparators = (value: string | number): string => {
    if (typeof value === "number") {
      return value.toLocaleString("en-US");
    }

    if (!value || value.trim() === "-") {
      return value;
    }

    // Format numeric segments while preserving symbols like "$" and text labels.
    return value.replace(/\d+(?:\.\d+)?/g, (match) => {
      const normalized = match.replace(/,/g, "");
      const [intPart, decPart] = normalized.split(".");
      const formattedInt = Number(intPart).toLocaleString("en-US");
      return decPart ? `${formattedInt}.${decPart}` : formattedInt;
    });
  };

  const extractNumericValue = (value: string | number): number => {
    if (typeof value === "number") return value;
    if (!value || value.trim() === "-") return 0;
    
    // Extract numeric value from strings like "$120,369" or "120369"
    const numericStr = String(value).replace(/[^\d.-]/g, "");
    const num = parseFloat(numericStr);
    return isNaN(num) ? 0 : num;
  };

  const calculateBudgetValues = (): Partial<BudgetData> => {
    const manPowerNum = extractNumericValue(budgetData.manPower);
    const projectDurationNum = extractNumericValue(budgetData.projectDuration);
    const workingDaysNum = extractNumericValue(budgetData.workingDays);
    const totalBudgetNum = extractNumericValue(budgetData.totalBudget);
    const totalProjectsNum = budgetData.totalProjects || 1;

    // Total Man-Days = manPower * projectDuration * workingDays
    const totalManDaysNum = manPowerNum * projectDurationNum * workingDaysNum;

    // Man-Day Cost = totalBudget / totalManDays
    const manDayCostNum = totalManDaysNum > 0 ? totalBudgetNum / totalManDaysNum : 0;

    // Man-Month / Project = (manPower * projectDuration) / totalProjects
    const manMonthPerProjectNum = totalProjectsNum > 0 ? (manPowerNum * projectDurationNum) / totalProjectsNum : 0;

    // Budget per Project = totalBudget / totalProjects
    const budgetPerProjectNum = totalProjectsNum > 0 ? totalBudgetNum / totalProjectsNum : 0;

    return {
      totalManDays: totalManDaysNum > 0 ? totalManDaysNum.toLocaleString("en-US", { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      }) : "-",
      manDayCost: manDayCostNum > 0 ? manDayCostNum.toLocaleString("en-US", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) : "-",
      manMonthPerProject: manMonthPerProjectNum > 0 ? manMonthPerProjectNum.toLocaleString("en-US", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) : "-",
      budgetPerProject: budgetPerProjectNum > 0 ? budgetPerProjectNum.toLocaleString("en-US", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) : "-",
    };
  };

  const generateBPId = (index: number): string => {
    const idNumber = String(index + 1).padStart(4, "0");
    return `BP - ${idNumber}`;
  };

  const loadProjectsWithBudget = (): ProjectWithBudget[] => {
    const savedProjects = localStorage.getItem("projects");
    if (!savedProjects) return [];

    try {
      const projects: Project[] = JSON.parse(savedProjects);
      const calculatedValues = calculateBudgetValues();
      const costPerProject = extractNumericValue(calculatedValues.manDayCost || "0");

      return projects.map((project, index) => ({
        bpId: generateBPId(index),
        name: project.name,
        projectLevel: (project as any).projectLevel || project.phase || "-",
        actualCost: costPerProject > 0 ? costPerProject.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : "-",
        budgetCost: costPerProject > 0 ? costPerProject.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : "-",
        status: project.phase || "-",
      }));
    } catch (error) {
      console.error("Failed to load projects:", error);
      return [];
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
    
    // Load budget data from localStorage
    const savedBudgetData = localStorage.getItem("budgetData");
    if (savedBudgetData) {
      try {
        const parsed = JSON.parse(savedBudgetData);
        // Keep editable fields from localStorage, but recalculate totalProjects
        setBudgetData({
          totalBudget: parsed.totalBudget || "$120,369",
          manPower: parsed.manPower || "$234,210",
          projectDuration: parsed.projectDuration || "$120,369",
          totalProjects: calculateTotalProjects(),
          budgetPerProject: parsed.budgetPerProject || "-",
          manDayCost: parsed.manDayCost || "-",
          manMonthPerProject: parsed.manMonthPerProject || "-",
          totalManDays: parsed.totalManDays || "-",
          workingDays: parsed.workingDays || "-",
        });
      } catch (error) {
        console.error("Failed to parse budget data from localStorage:", error);
        // Set totalProjects even if parsing fails
        setBudgetData(prev => ({
          ...prev,
          totalProjects: calculateTotalProjects()
        }));
      }
    } else {
      // If no saved data, just calculate totalProjects
      setBudgetData(prev => ({
        ...prev,
        totalProjects: calculateTotalProjects()
      }));
    }

    // Load projects list
    setProjectsList(loadProjectsWithBudget());
  }, [router]);

  const calculateTotalProjects = (): number => {
    const savedProjects = localStorage.getItem("projects");
    if (!savedProjects) return 0;
    
    try {
      const projects: Project[] = JSON.parse(savedProjects);
      return projects.length;
    } catch (error) {
      console.error("Failed to parse projects from localStorage:", error);
      return 0;
    }
  };

  // Save budget data to localStorage whenever it changes (only editable fields)
  useEffect(() => {
    const dataToSave = {
      totalBudget: budgetData.totalBudget,
      manPower: budgetData.manPower,
      projectDuration: budgetData.projectDuration,
      budgetPerProject: budgetData.budgetPerProject,
      manDayCost: budgetData.manDayCost,
      manMonthPerProject: budgetData.manMonthPerProject,
      totalManDays: budgetData.totalManDays,
      workingDays: budgetData.workingDays,
    };
    localStorage.setItem("budgetData", JSON.stringify(dataToSave));
  }, [budgetData.totalBudget, budgetData.manPower, budgetData.projectDuration, budgetData.budgetPerProject, budgetData.manDayCost, budgetData.manMonthPerProject, budgetData.totalManDays, budgetData.workingDays]);

  // Update totalProjects whenever projects change
  useEffect(() => {
    const handleStorageChange = () => {
      setBudgetData(prev => ({
        ...prev,
        totalProjects: calculateTotalProjects()
      }));
      setProjectsList(loadProjectsWithBudget());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleEditClick = (field: string, value: string | number) => {
    if (!editableFields.includes(field)) return;
    
    setEditingField(field);
    setEditValue(String(value));
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingField(null);
    setEditValue("");
  };

  const handleSaveEdit = () => {
    if (!editingField) return;

    setBudgetData({
      ...budgetData,
      [editingField]: editValue,
    });

    handleCloseEditModal();
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      totalBudget: "Total Budget",
      manPower: "Man Power",
      projectDuration: "Project Duration",
      totalProjects: "Total Projects",
      budgetPerProject: "Budget per Project",
      manDayCost: "Man-Day Cost",
      manMonthPerProject: "Man-Month / Project",
      totalManDays: "Total Man-Days",
      workingDays: "Working Days",
    };
    return labels[field] || field;
  };

  const BudgetCard = ({ field, value, label, isEditable = false }: { field: string; value: string | number; label: string; isEditable?: boolean }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl font-bold text-gray-800">
          {formatWithThousandSeparators(value)}
        </div>
        {isEditable && (
          <button
            onClick={() => handleEditClick(field, value)}
            className="p-2 text-gray-400 hover:text-blue-600 transition"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Budget Project</h1>
            </div>
          </div>

          {/* Budget Cards Grid */}
          <div className="space-y-6">
            {/* Row 1 - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BudgetCard
                field="totalBudget"
                value={budgetData.totalBudget}
                label="Total Budget"
                isEditable={true}
              />
              <BudgetCard
                field="manPower"
                value={budgetData.manPower}
                label="Man Power"
                isEditable={true}
              />
              <BudgetCard
                field="projectDuration"
                value={budgetData.projectDuration}
                label="Project Duration (Months)"
                isEditable={true}
              />
              <BudgetCard
                field="totalProjects"
                value={budgetData.totalProjects}
                label="Total Projects"
                isEditable={false}
              />
            </div>

            {/* Row 2 - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BudgetCard
                field="budgetPerProject"
                value={calculateBudgetValues().budgetPerProject || "-"}
                label="Budget per Project"
                isEditable={false}
              />
              <BudgetCard
                field="manDayCost"
                value={calculateBudgetValues().manDayCost || "-"}
                label="Man-Day Cost"
                isEditable={false}
              />
              <BudgetCard
                field="manMonthPerProject"
                value={calculateBudgetValues().manMonthPerProject || "-"}
                label="Man-Month / Project"
                isEditable={false}
              />
              <BudgetCard
                field="totalManDays"
                value={calculateBudgetValues().totalManDays || "-"}
                label="Total Man-Days"
                isEditable={false}
              />
            </div>

            {/* Row 3 - 1 Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BudgetCard
                field="workingDays"
                value={budgetData.workingDays}
                label="Working Days/Month"
                isEditable={true}
              />
            </div>
          </div>

          {/* Project List Table */}
          <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">List Project Details</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No projects found
                      </td>
                    </tr>
                  ) : (
                    projectsList.map((project) => (
                      <tr key={project.bpId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.bpId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.projectLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.actualCost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.budgetCost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Edit {getFieldLabel(editingField)}
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getFieldLabel(editingField)} Value
              </label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCloseEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
