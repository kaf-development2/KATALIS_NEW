"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarMenuSections } from "@/config/sidebarMenu";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    it: true,
  });
  const pathname = usePathname();
  const router = useRouter();

  const menuIcons: Record<string, React.ReactNode> = {
    it: (
      <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="#142b6f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1M9 12H4m8 8V9h8v11h-8Zm0 0H9m8-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"/>
      </svg>
    ),
    crm: (
      <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="#142b6f" strokeLinecap="round" strokeWidth="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
      </svg>
    ),
    dms: (
      <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="#142b6f" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="#142b6f" strokeLinejoin="round" strokeWidth="2" d="m20.9532 11.7634-2.0523-2.05225-2.0523 2.05225 2.0523 2.0523 2.0523-2.0523Zm-1.3681-2.73651-4.1046-4.10457L12.06 8.3428l4.1046 4.1046 3.4205-3.42051Zm-4.1047 2.73651-2.7363-2.73638-8.20919 8.20918 2.73639 2.7364 8.2091-8.2092Z"/>
        <path stroke="#142b6f" strokeLinejoin="round" strokeWidth="2" d="m12.9306 3.74083 1.8658 1.86571-2.0523 2.05229-1.5548-1.55476c-.995-.99505-3.23389-.49753-3.91799.18657l2.73639-2.73639c.6841-.68409 1.9901-.74628 2.9229.18658Z"/>
      </svg>
    ),
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white ${isOpen ? "w-64" : "w-20"} transition-all duration-300 shadow-lg flex flex-col`}>
      {/* Logo */}
      <div className="h-[88px] flex items-center gap-3 px-6 border-b">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="KATALIS Logo" 
            width={48} 
            height={48}
            className="object-contain"
          />
        </div>
        {isOpen && <span className="text-xl font-bold text-gray-800">KATALIS</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-gray-500 mb-3 px-3 uppercase tracking-wider">Menu</p>

        {sidebarMenuSections.map((section) => (
          <div key={section.id} className="mb-2">
            <button
              onClick={() => toggleMenu(section.id)}
              className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary-50 rounded-lg group"
            >
              <div className="flex items-center gap-3">
                {menuIcons[section.id]}
                {isOpen && <span className="font-medium">{section.label}</span>}
              </div>
              {isOpen && (
                <svg className={`w-4 h-4 transition-transform ${openMenus[section.id] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {isOpen && openMenus[section.id] && (
              <div className="ml-8 mt-1 space-y-1">
                {section.items.map((item) => {
                  const itemClassName = `block p-2 text-sm rounded ${
                    item.href && pathname === item.href
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-700 hover:text-primary-600"
                  }`;

                  if (item.href) {
                    return (
                      <Link key={item.id} href={item.href} className={itemClassName}>
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <a key={item.id} href="#" className={itemClassName}>
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}

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

      <div className={`${isOpen ? "w-64" : "w-20"} shrink-0`} aria-hidden="true" />
    </>
  );
}
