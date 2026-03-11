export type SidebarMenuItem = {
  id: string;
  label: string;
  href?: string;
};

export type SidebarMenuSection = {
  id: string;
  label: string;
  items: SidebarMenuItem[];
};

export const sidebarMenuSections: SidebarMenuSection[] = [
  {
    id: "it",
    label: "IT",
    items: [
      { id: "monitoring", label: "Monitoring Project", href: "/monitoring" },
      { id: "developer", label: "Developer", href: "/developer" },
      { id: "budget-project", label: "Budget Project", href: "/budgetProject" },
    ],
  },
  {
    id: "crm",
    label: "CRM",
    items: [
      { id: "notification", label: "Notification", href: "/crm" },
      { id: "analytics", label: "Analytics", href: "/crm" },
      { id: "customers", label: "Customers", href: "/crm" },
    ],
  },
  {
    id: "dms",
    label: "DMS",
    items: [
      { id: "dokumen", label: "Dokumen", href: "/dokumen" },
      { id: "master-data", label: "Master Data" },
      { id: "manage-users", label: "Manage Users", href: "/users" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { id: "permission", label: "Permission", href: "/permission" },
      { id: "log-user", label: "Log User" },
      { id: "users", label: "Users", href: "/users" },
    ],
  },
];
