"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { sidebarMenuSections } from "@/config/sidebarMenu";

type AccordionItem = {
  id: string;
  title: string;
  content?: React.ReactNode;
  renderContent?: (props: { 
    users: User[]; 
    onDelete: (id: string) => void; 
    onAddUser: () => void;
    onEdit?: (user: User) => void;
  }) => React.ReactNode;
};

type PermissionFlags = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type ContentPermissionItem = {
  id: string;
  label: string;
};

const emptyPermissionFlags = (): PermissionFlags => ({
  create: false,
  read: false,
  update: false,
  delete: false,
});

const hasAnyPermission = (permission?: PermissionFlags) =>
  Boolean(permission && (permission.create || permission.read || permission.update || permission.delete));

const formatContentPermissionLabel = (key: string) => {
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    report: "Report",
    application: "Application",
    "total-project": "Total Project",
    "overall-project-progress": "Overall Project Progress",
    "team-workload": "Team Workload",
    "project-distribution": "Project Distribution",
  };

  if (labelMap[key]) {
    return labelMap[key];
  }

  if (key.startsWith("distribution-")) {
    return key.replace("distribution-", "").toUpperCase();
  }

  return key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

type TabData = {
  id: string;
  label: string;
  accordionItems?: AccordionItem[];
  subTabs?: TabData[];
};

const tabsData: TabData[] = [
  {
    id: "crm",
    label: "CRM",
    subTabs: [
      {
        id: "crm-page-permissions",
        label: "Page Permissions",
        accordionItems: [
          {
            id: "crm-section",
            title: "Page Permissions",
            renderContent: ({ users, onDelete, onAddUser }) => (
              <div className="space-y-6">
                {/* Dashboard Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">List User</h4>
                    <button
                      onClick={onAddUser}
                      className="w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      title="Add User"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* User List Table */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</div>
                    </div>

                    {/* User Rows - Dynamic */}
                    <div className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-2 gap-4 px-4 py-4 items-center hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                              {user.initial}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                          <div className="flex items-center justify-end gap-3">
                           <button 
                              onClick={() => onDelete(user.id)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      Reset Changes
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Permissions
                    </button>
                  </div>
                </div>
              </div>
            ),
          },
          ],
        },
      {
        id: "crm-subpage-permissions",
        label: "Sub Page Permissions",
        accordionItems: [
          {
            id: "dashboard-permissions",
            title: "Dashboard Permissions",
            renderContent: ({ users, onDelete, onAddUser, onEdit }) => (
              <div className="space-y-6">
                {/* Dashboard Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">List User</h4>
                    <button
                      onClick={onAddUser}
                      className="w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      title="Add User"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* User List Table */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</div>
                    </div>

                    {/* User Rows - Dynamic */}
                    <div className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-3 gap-4 px-4 py-4 items-center hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                              {user.initial}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const appliedContents = Object.entries(user.contentPermissions || {})
                                .filter(([, permission]) => hasAnyPermission(permission as PermissionFlags))
                                .map(([key]) => key);

                              if (appliedContents.length === 0) {
                                return <span className="text-xs text-gray-500 italic">No content assigned</span>;
                              }

                              const colorClasses = [
                                "bg-blue-100 text-blue-800",
                                "bg-purple-100 text-purple-800",
                                "bg-green-100 text-green-800",
                                "bg-amber-100 text-amber-800",
                                "bg-pink-100 text-pink-800",
                              ];

                              return appliedContents.map((key, index) => (
                                <span
                                  key={key}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[index % colorClasses.length]}`}
                                >
                                  {formatContentPermissionLabel(key)}
                                </span>
                              ));
                            })()}
                          </div>
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => onEdit && onEdit(user)}
                              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => onDelete(user.id)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      Reset Changes
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Permissions
                    </button>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "report-permissions",
            title: "Report Permissions",
            renderContent: ({ users, onDelete, onAddUser, onEdit }) => (
              <div className="space-y-6">
                {/* Report Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">List User</h4>
                    <button
                      onClick={onAddUser}
                      className="w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      title="Add User"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* User List Table */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</div>
                    </div>

                    {/* User Rows - Dynamic */}
                    <div className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-3 gap-4 px-4 py-4 items-center hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                              {user.initial}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const appliedContents = Object.entries(user.contentPermissions || {})
                                .filter(([, permission]) => hasAnyPermission(permission as PermissionFlags))
                                .map(([key]) => key);

                              if (appliedContents.length === 0) {
                                return <span className="text-xs text-gray-500 italic">No content assigned</span>;
                              }

                              const colorClasses = [
                                "bg-blue-100 text-blue-800",
                                "bg-purple-100 text-purple-800",
                                "bg-green-100 text-green-800",
                                "bg-amber-100 text-amber-800",
                                "bg-pink-100 text-pink-800",
                              ];

                              return appliedContents.map((key, index) => (
                                <span
                                  key={key}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[index % colorClasses.length]}`}
                                >
                                  {formatContentPermissionLabel(key)}
                                </span>
                              ));
                            })()}
                          </div>
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => onEdit && onEdit(user)}
                              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => onDelete(user.id)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      Reset Changes
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Permissions
                    </button>
                  </div>
                </div>
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "notification",
    label: "Notification",
    accordionItems: [
      {
        id: "email-notifications",
        title: "Email Notifications",
        content: (
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Receive email updates</span>
              <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Weekly digest</span>
              <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Marketing emails</span>
              <input type="checkbox" className="w-4 h-4 text-primary-600" />
            </label>
          </div>
        ),
      },
      {
        id: "push-notifications",
        title: "Push Notifications",
        content: (
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Desktop notifications</span>
              <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Mobile push</span>
              <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
            </label>
          </div>
        ),
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    accordionItems: [
      {
        id: "usage-stats",
        title: "Usage Statistics",
        content: (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Total Sessions</label>
              <p className="text-sm font-medium">1,247</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Avg. Session Duration</label>
              <p className="text-sm font-medium">12 minutes</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Last Active</label>
              <p className="text-sm font-medium">2 hours ago</p>
            </div>
          </div>
        ),
      },
      {
        id: "performance-metrics",
        title: "Performance Metrics",
        content: (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tasks Completed</label>
              <p className="text-sm font-medium">324</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Completion Rate</label>
              <p className="text-sm font-medium">94%</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    accordionItems: [
      {
        id: "customer-list",
        title: "Customer Management",
        content: (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Total Customers</label>
              <p className="text-sm font-medium">1,542</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Active Customers</label>
              <p className="text-sm font-medium">1,234</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">New This Month</label>
              <p className="text-sm font-medium">87</p>
            </div>
          </div>
        ),
      },
      {
        id: "customer-support",
        title: "Support Tickets",
        content: (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Open Tickets</label>
              <p className="text-sm font-medium">23</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Resolved Today</label>
              <p className="text-sm font-medium">15</p>
            </div>
          </div>
        ),
      },
    ],
  },
];

type User = {
  id: string;
  name: string;
  initial: string;
  permissions?: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  contentPermissions?: {
    [key: string]: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
};

export default function PermissionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("crm-page-permissions");
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({
    crm: true,
  });
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    "crm-section": true,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [tempPermissions, setTempPermissions] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
  });
  const [tempContentPermissions, setTempContentPermissions] = useState<Record<string, PermissionFlags>>({
    dashboard: { create: false, read: false, update: false, delete: false },
    report: { create: false, read: false, update: false, delete: false },
    application: { create: false, read: false, update: false, delete: false },
  });
  const [monitoringOwners, setMonitoringOwners] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeCrmTab, setActiveCrmTab] = useState<'page' | 'subpage'>('page');
  const [users, setUsers] = useState<User[]>([
    { 
      id: "1", 
      name: "Admin", 
      initial: "A",
      permissions: { create: true, read: true, update: true, delete: true },
      contentPermissions: {
        dashboard: { create: true, read: true, update: true, delete: true },
        report: { create: true, read: true, update: true, delete: true },
        application: { create: true, read: true, update: true, delete: true },
      }
    },
    { 
      id: "2", 
      name: "John Doe", 
      initial: "J",
      permissions: { create: false, read: true, update: true, delete: false },
      contentPermissions: {
        dashboard: { create: false, read: true, update: true, delete: false },
        report: { create: false, read: true, update: false, delete: false },
        application: { create: false, read: true, update: true, delete: false },
      }
    },
    { 
      id: "3", 
      name: "Jane Smith", 
      initial: "J",
      permissions: { create: false, read: true, update: false, delete: false },
      contentPermissions: {
        dashboard: { create: false, read: true, update: false, delete: false },
        report: { create: false, read: false, update: false, delete: false },
        application: { create: false, read: true, update: false, delete: false },
      }
    },
  ]);

  // Available users that can be added
  const availableUsers: User[] = [
    { id: "4", name: "Michael Brown", initial: "M" },
    { id: "5", name: "Sarah Wilson", initial: "S" },
    { id: "6", name: "David Martinez", initial: "D" },
    { id: "7", name: "Emily Johnson", initial: "E" },
    { id: "8", name: "Robert Davis", initial: "R" },
  ];

  // Filter out users that are already in the main list
  const usersToAdd = availableUsers.filter(
    (availableUser) => !users.some((user) => user.id === availableUser.id)
  );

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }

    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects) as Array<{ projectOwner?: string }>;
        const owners = Array.from(
          new Set(
            parsedProjects
              .map((project) => project.projectOwner?.trim())
              .filter((owner): owner is string => Boolean(owner))
          )
        );
        setMonitoringOwners(owners);
      } catch {
        setMonitoringOwners([]);
      }
    }
  }, [router]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddUser = () => {
    if (selectedUserIds.length > 0) {
      const usersToAddToList = availableUsers.filter((user) =>
        selectedUserIds.includes(user.id)
      );
      setUsers([...users, ...usersToAddToList]);
      setSelectedUserIds([]);
      setIsAddUserModalOpen(false);
    }
  };

  const handleCheckboxChange = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleOpenEditPermissions = (user: User) => {
    setSelectedUserForEdit(user);
    setTempPermissions(user.permissions || { create: false, read: false, update: false, delete: false });
    const existingContentPermissions = user.contentPermissions || {};
    const generatedContentPermissions = contentPermissionItems.reduce<Record<string, PermissionFlags>>((acc, item) => {
      acc[item.id] = existingContentPermissions[item.id] || emptyPermissionFlags();
      return acc;
    }, {});
    setTempContentPermissions(generatedContentPermissions);
    setIsEditPermissionsModalOpen(true);
  };

  const handleSavePermissions = () => {
    if (selectedUserForEdit) {
      setUsers(users.map(user => 
        user.id === selectedUserForEdit.id 
          ? { ...user, permissions: tempPermissions, contentPermissions: tempContentPermissions }
          : user
      ));
      setIsEditPermissionsModalOpen(false);
      setSelectedUserForEdit(null);
    }
  };

  const handlePermissionToggle = (permission: keyof typeof tempPermissions) => {
    setTempPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const crmTab = tabsData.find((tab) => tab.id === "crm");
  const crmPagePermissionsTab = crmTab?.subTabs?.find((subTab) => subTab.id === "crm-page-permissions");
  const crmSubPagePermissionsTab = crmTab?.subTabs?.find((subTab) => subTab.id === "crm-subpage-permissions");
  const standaloneTabs = tabsData.filter((tab) => !tab.subTabs);

  const getGeneratedPermissionLabel = (tabId: string) => {
    if (tabId.endsWith("-page-permissions")) {
      return "Page Permissions";
    }

    for (const section of sidebarMenuSections) {
      for (const item of section.items) {
        if (tabId === `${section.id}:${item.id}` || tabId === item.id) {
          return item.label;
        }
      }
    }

    return undefined;
  };

  const getGeneratedCurrentTab = (tabId: string) => {
    if (tabId.endsWith("-page-permissions")) {
      return crmPagePermissionsTab;
    }

    if (tabId.includes(":")) {
      return crmSubPagePermissionsTab;
    }

    return standaloneTabs.find((tab) => tab.id === tabId);
  };

  // Find current tab - check both main tabs and sub-tabs
  let currentTab: TabData | undefined = getGeneratedCurrentTab(activeTab);
  if (!currentTab) {
    for (const tab of tabsData) {
      if (tab.id === activeTab) {
        currentTab = tab;
        break;
      }
      if (tab.subTabs) {
        const subTab = tab.subTabs.find((st) => st.id === activeTab);
        if (subTab) {
          currentTab = subTab;
          break;
        }
      }
    }
  }

  const currentTabLabel = getGeneratedPermissionLabel(activeTab) || currentTab?.label || "Permissions";
  const getSidebarItemByGeneratedTab = (tabId: string) => {
    if (!tabId.includes(":")) {
      return undefined;
    }

    const [sectionId, itemId] = tabId.split(":");
    const section = sidebarMenuSections.find((menuSection) => menuSection.id === sectionId);
    if (!section) {
      return undefined;
    }

    const item = section.items.find((menuItem) => menuItem.id === itemId);
    if (!item) {
      return undefined;
    }

    return { section, item };
  };

  const selectedSidebarItem = getSidebarItemByGeneratedTab(activeTab);
  const contentPermissionItems: ContentPermissionItem[] = (() => {
    if (!selectedSidebarItem) {
      return [
        { id: "dashboard", label: "Dashboard" },
        { id: "report", label: "Report" },
        { id: "application", label: "Application" },
      ];
    }

    if (activeTab === "it:monitoring") {
      const ownerItems = monitoringOwners.map((owner) => ({
        id: `distribution-${owner.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        label: owner,
      }));

      return [
        { id: "total-project", label: "Total Project" },
        { id: "overall-project-progress", label: "Overall Project Progress" },
        { id: "team-workload", label: "Team Workload" },
        ...(ownerItems.length > 0 ? ownerItems : [{ id: "project-distribution", label: "Project Distribution" }]),
      ];
    }

    return [
      {
        id: `${selectedSidebarItem.item.id}-content`,
        label: selectedSidebarItem.item.label,
      },
    ];
  })();
  const isGeneratedSubPageTab = activeTab.includes(":");
  const accordionItemsToRender = (() => {
    if (!currentTab?.accordionItems) {
      return [];
    }

    if (isGeneratedSubPageTab) {
      const pagePermissionItem =
        crmPagePermissionsTab?.accordionItems?.find((item) => item.id === "crm-section") ||
        crmPagePermissionsTab?.accordionItems?.[0];
      const contentPermissionItem =
        crmSubPagePermissionsTab?.accordionItems?.find((item) => item.id === "dashboard-permissions") ||
        currentTab.accordionItems.find((item) => item.id === "dashboard-permissions") ||
        currentTab.accordionItems[0];

      const generatedItems: AccordionItem[] = [];

      if (pagePermissionItem) {
        generatedItems.push({
          ...pagePermissionItem,
          id: "page-permission",
          title: "Page Permission",
        });
      }

      if (contentPermissionItem) {
        generatedItems.push({
          ...contentPermissionItem,
          id: "content-permission",
          title: "Content Permission",
        });
      }

      return generatedItems;
    }

    return currentTab.accordionItems;
  })();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm flex" style={{ minHeight: "600px" }}>
              {/* Vertical Tabs - Left Sidebar */}
              <div className="w-64 border-r border-gray-200 p-6">
                <nav className="space-y-1">
                  {sidebarMenuSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleDropdown(section.id)}
                        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          openDropdowns[section.id]
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{section.label}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdowns[section.id] ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {openDropdowns[section.id] && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                          <button
                            onClick={() => setActiveTab(`${section.id}-page-permissions`)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeTab === `${section.id}-page-permissions`
                                ? "bg-primary-50 text-primary-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            Page Permissions
                          </button>

                          

                          {section.items.map((item) => {
                            const generatedId = standaloneTabs.some((tab) => tab.id === item.id)
                              ? item.id
                              : `${section.id}:${item.id}`;

                            return (
                              <button
                                key={item.id}
                                onClick={() => setActiveTab(generatedId)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  activeTab === generatedId
                                    ? "bg-primary-50 text-primary-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Content Area - Right Side */}
              <div className="flex-1 p-6">
                {currentTab && (
                  <div>
                    {/* Header for current tab */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">{currentTabLabel}</h2>
                      {currentTab.id !== "crm-dashboard" && (
                        <button
                          
                        >
                          
                        </button>
                      )}
                    </div>

                    {/* CRM Vertical Tabs */}
                    {activeTab === "sidebar-crm" && (
                      <div className="flex gap-6 mb-6">
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <button
                            onClick={() => setActiveCrmTab('page')}
                            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              activeCrmTab === 'page'
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Page Permission
                          </button>
                          <button
                            onClick={() => setActiveCrmTab('subpage')}
                            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              activeCrmTab === 'subpage'
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            SubPage Permission
                          </button>
                        </div>

                        <div className="flex-1">
                          {activeCrmTab === 'page' && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Permission Settings</h3>
                              {/* Accordion Items for Page Permissions */}
                              <div className="space-y-4">
                                {currentTab.accordionItems?.filter(item => item.id !== 'dashboard-permissions').map((item) => (
                                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Accordion Header */}
                                    <button
                                      onClick={() => toggleAccordion(item.id)}
                                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                                      </div>
                                      <svg
                                        className={`w-5 h-5 text-gray-500 transition-transform ${
                                          openAccordions[item.id] ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>

                                    {/* Accordion Content */}
                                    {openAccordions[item.id] && (
                                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        {item.renderContent 
                                          ? item.renderContent({ 
                                              users, 
                                              onDelete: handleDeleteUser,
                                              onAddUser: () => setIsAddUserModalOpen(true),
                                              onEdit: handleOpenEditPermissions
                                            })
                                          : item.content
                                        }
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeCrmTab === 'subpage' && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">SubPage Permission Settings</h3>
                              {/* Accordion Items for SubPage Permissions - Dashboard Permissions */}
                              <div className="space-y-4">
                                {currentTab.accordionItems?.filter(item => item.id === 'dashboard-permissions').map((item) => (
                                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Accordion Header */}
                                    <button
                                      onClick={() => toggleAccordion(item.id)}
                                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                                      </div>
                                      <svg
                                        className={`w-5 h-5 text-gray-500 transition-transform ${
                                          openAccordions[item.id] ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>

                                    {/* Accordion Content */}
                                    {openAccordions[item.id] && (
                                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        {item.renderContent 
                                          ? item.renderContent({ 
                                              users, 
                                              onDelete: handleDeleteUser,
                                              onAddUser: () => setIsAddUserModalOpen(true),
                                              onEdit: handleOpenEditPermissions
                                            })
                                          : item.content
                                        }
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Default Accordion Items for non-CRM tabs */}
                    {activeTab !== "sidebar-crm" && (
                      <div className="space-y-4">
                        {accordionItemsToRender.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Accordion Header */}
                            <button
                              onClick={() => toggleAccordion(item.id)}
                              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                                {item.id === "user-list" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsAddUserModalOpen(true);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                                    title="Add User"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${
                                  openAccordions[item.id] ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Accordion Content */}
                            {openAccordions[item.id] && (
                              <div className="p-4 bg-gray-50 border-t border-gray-200">
                                {item.renderContent 
                                  ? item.renderContent({ 
                                      users, 
                                      onDelete: handleDeleteUser,
                                      onAddUser: () => setIsAddUserModalOpen(true),
                                      onEdit: handleOpenEditPermissions
                                    })
                                  : item.content
                                }
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select users to add
              </label>
              
              {/* User List with Checkboxes */}
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {usersToAdd.length > 0 ? (
                  usersToAdd.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-700">{user.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    No users available to add
                  </div>
                )}
              </div>
              
              {selectedUserIds.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setSelectedUserIds([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={selectedUserIds.length === 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add User{selectedUserIds.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {isEditPermissionsModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Permissions - {selectedUserForEdit.name}
            </h3>
            
                         
              
            {/* Content Permissions Table */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Content Permissions
              </label>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-5 gap-2 px-4 py-3">
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Content</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Create</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Read</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Update</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Delete</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {contentPermissionItems.map((item) => {
                    const permission = tempContentPermissions[item.id] || emptyPermissionFlags();

                    return (
                      <div key={item.id} className="grid grid-cols-5 gap-2 px-4 py-3 hover:bg-gray-50">
                        <div className="text-sm font-medium text-gray-900 flex items-center">{item.label}</div>
                        {(["create", "read", "update", "delete"] as const).map((permissionKey) => (
                          <div key={permissionKey} className="flex justify-center items-center">
                            <input
                              type="checkbox"
                              checked={permission[permissionKey]}
                              onChange={() => {
                                setTempContentPermissions((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...(prev[item.id] || emptyPermissionFlags()),
                                    [permissionKey]: !(prev[item.id]?.[permissionKey] || false),
                                  },
                                }));
                              }}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditPermissionsModalOpen(false);
                  setSelectedUserForEdit(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
