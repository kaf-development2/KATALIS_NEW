"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    dashboard: true,
  });
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <aside className={`bg-white h-screen ${isOpen ? "w-64" : "w-20"} transition-all duration-300 shadow-lg flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-20 h-20 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="KATALIS Logo" 
            width={80} 
            height={80}
            className="object-contain"
          />
        </div>
        {isOpen && <span className="text-xl font-bold text-gray-800">Testing Project KATALIS</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-gray-500 mb-3 px-3 uppercase tracking-wider">Menu</p>

        {/* Dashboard */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("dashboard")}
            className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isOpen && <span className="font-medium">IT</span>}
            </div>
            {isOpen && (
              // <svg className={`w-4 h-4 transition-transform ${openMenus.dashboard ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              // </svg>
              <svg className={`w-4 h-4 transition-transform ${openMenus.dashboard ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {isOpen && openMenus.dashboard && (
            <div className="ml-8 mt-1 space-y-1">
              <Link 
                href="/dashboard" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/dashboard" 
                    ? "bg-primary-50 text-primary-600 font-medium" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/monitoring" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/monitoring" 
                    ? "bg-primary-50 text-primary-600 font-medium" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Monitoring Project
              </Link>
              <Link 
                href="/developer" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/developer" 
                    ? "bg-primary-50 text-primary-600 font-medium" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Developer
              </Link>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Backlog Project</a>
            </div>
          )}
        </div>

        {/* CRM */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("crm")}
            className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isOpen && <span className="font-medium">CRM</span>}
            </div>
            {isOpen && (
              <svg className={`w-4 h-4 transition-transform ${openMenus.crm ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {isOpen && openMenus.crm && (
            <div className="ml-8 mt-1 space-y-1">
              <Link 
                href="/crm" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/crm" 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Overview
              </Link>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Quadrant Analysis</a>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Customer Mapping</a>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Upload Data</a>
              
            </div>
          )}
        </div>

        {/* DMS */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("dms")}
            className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isOpen && <span className="font-medium">DMS</span>}
            </div>
            {isOpen && (
              <svg className={`w-4 h-4 transition-transform ${openMenus.dms ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {isOpen && openMenus.dms && (
            <div className="ml-8 mt-1 space-y-1">
              <Link 
                href="/dokumen" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/dokumen" 
                    ? "bg-primary-50 text-primary-600 font-medium" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Dokumen
              </Link>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Master Data</a>
              <Link 
                href="/users" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/users" 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>

        {/* Project Management */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("projectManagement")}
            className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isOpen && <span className="font-medium">Project Management</span>}
            </div>
            {isOpen && (
              <svg className={`w-4 h-4 transition-transform ${openMenus.projectManagement ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {isOpen && openMenus.projectManagement && (
            <div className="ml-8 mt-1 space-y-1">
              <Link 
                href="/projectManagement" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/projectManagement" 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Overview Project
              </Link>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Manage Project</a>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Upload Data</a>
              
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("settings")}
            className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isOpen && <span className="font-medium">Settings</span>}
            </div>
            {isOpen && (
              <svg className={`w-4 h-4 transition-transform ${openMenus.settings ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {isOpen && openMenus.settings && (
            <div className="ml-8 mt-1 space-y-1">
              <Link 
                href="/permission" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/permission" 
                    ? "bg-primary-50 text-primary-600 font-medium" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Permission
              </Link>
              <a href="#" className="block p-2 text-sm text-gray-700 hover:text-primary-600 rounded">Log User</a>
              <Link 
                href="/users" 
                className={`block p-2 text-sm rounded ${
                  pathname === "/users" 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                Users
              </Link>
            </div>
          )}
        </div>

        {/* User Profile */}
        <a href="#" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-primary-50 rounded-lg mb-2 group">
          <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {isOpen && <span className="font-medium">User Profile</span>}
        </a>
        
        {/* AI Assistant */}
        <a href="#" className="flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg mb-2 group">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {isOpen && (
              <>
                <span className="font-medium">AI Assistant</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">Soon</span>
              </>
            )}
          </div>
        </a>
        
      </nav>
    </aside>
  );
}
