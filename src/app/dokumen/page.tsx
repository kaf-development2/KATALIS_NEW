"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Mock data for documents
const documentsData = [
  {
    id: 1,
    name: "trio 1-09-01-2025",
    owner: "tiara.yunizar",
    docType: "asdfgkl",
    submitDate: "01/09/2025",
    lastReviewer: "tiara.yunizar (0/1)",
    status: "Waiting for Approval"
  },
  {
    id: 2,
    name: "trio 3-09-01-2025",
    owner: "tiara.yunizar",
    docType: "Perjanjian",
    submitDate: "01/09/2025",
    lastReviewer: "tiara.yunizar (0/1)",
    status: "Waiting for Approval"
  },
  {
    id: 3,
    name: "testing status",
    owner: "tiara.yunizar",
    docType: "testing",
    submitDate: "03/09/2025",
    lastReviewer: "tiara.yunizar (0/1)",
    status: "Waiting for Approval"
  },
  {
    id: 4,
    name: "doc approved",
    owner: "tiara.yunizar",
    docType: "testing",
    submitDate: "12/09/2025",
    lastReviewer: "tiara.yunizar (0/1)",
    status: "Waiting for Approval"
  },
  {
    id: 5,
    name: "trio 2-01-09-2025",
    owner: "tiara.yunizar",
    docType: "Perjanjian",
    submitDate: "01/09/2025",
    lastReviewer: "tiara.yunizar (1/1)",
    status: "Approved"
  },
  {
    id: 6,
    name: "testttttt",
    owner: "tiara.yunizar",
    docType: "testing",
    submitDate: "12/09/2025",
    lastReviewer: "sintya.rebeka (1/1)",
    status: "Approved"
  },
];

export default function DokumenPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"word" | "excel" | "pdf" | "gambar">("excel");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDokumen, setFilterDokumen] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterSurat, setFilterSurat] = useState("");
  const [filterPerihal, setFilterPerihal] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  const filteredDocuments = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.docType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dokumen</h1>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Dokumen */}
              <div className="relative">
                <select
                  value={filterDokumen}
                  onChange={(e) => setFilterDokumen(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Filter Dokumen</option>
                  <option value="all">Semua Dokumen</option>
                  <option value="draft">Draft</option>
                  <option value="final">Final</option>
                </select>
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Filter Jenis Dokumen */}
              <div className="relative">
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Filter Jenis Dokumen</option>
                  <option value="perjanjian">Perjanjian</option>
                  <option value="testing">Testing</option>
                  <option value="other">Other</option>
                </select>
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Filter Jenis Surat */}
              <div className="relative">
                <select
                  value={filterSurat}
                  onChange={(e) => setFilterSurat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Filter Jenis Surat</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Filter Surat Perihal */}
              <div className="relative">
                <select
                  value={filterPerihal}
                  onChange={(e) => setFilterPerihal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Filter Surat Perihal</option>
                  <option value="kontrak">Kontrak</option>
                  <option value="laporan">Laporan</option>
                  <option value="pengajuan">Pengajuan</option>
                </select>
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>


        {/* Tabs and Refresh Button */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("word")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "word"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Word
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === "word"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      2
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("excel")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "excel"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Excel
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === "excel"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      4
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "pdf"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    PDF
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === "pdf"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      6
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("gambar")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "gambar"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Gambar
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === "gambar"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      3
                    </span>
                  </span>
                </button>                             
              
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "excel" ? (
            /* Documents Table for Excel */
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pemilik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dokumen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Submit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Peninjau Terakhir
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                          {doc.owner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.docType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.submitDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                          {doc.lastReviewer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doc.status === "Approved" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-3">
                            <button className="text-gray-600 hover:text-blue-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="text-gray-600 hover:text-blue-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty State for Word, PDF, and Gambar */
            <div className="bg-white rounded-lg shadow-sm p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 text-lg font-medium">
                  Belum ada Dokumen yang tersedia
                </p>
              </div>
            </div>
            
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
