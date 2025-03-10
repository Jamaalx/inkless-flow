"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define a proper type for the document
interface Document {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

// Define the mock data with proper typing
const mockDocuments: Document[] = [
  {
    id: "doc1",
    title: "Sales Agreement",
    status: "PENDING",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "doc2",
    title: "Employment Contract",
    status: "COMPLETED",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "doc3",
    title: "NDA Document",
    status: "DRAFT",
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function Dashboard() {
  // Properly type your state
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);

  useEffect(() => {
    // In a real implementation, this would fetch from your API
    setRecentDocuments(mockDocuments);
  }, []);
  // Format the date in a human-readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-blue">Dashboard</h1>
        <Link
          href="/dashboard/documents/new"
          className="bg-accent-orange text-white px-4 py-2 rounded-md hover:bg-accent-orange/90 inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Document
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-cyan/10 text-primary-cyan mr-4">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-primary-blue">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-800 mr-4">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Awaiting Signatures</p>
              <p className="text-2xl font-bold text-primary-blue">1</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-primary-blue">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-primary-blue">Recent Documents</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentDocuments.map((doc: any) => (
            <li key={doc.id}>
              <Link
                href={`/dashboard/documents/${doc.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary-blue">{doc.title}</p>
                      <p className="text-xs text-gray-500">
                        Updated {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                        doc.status
                      )}`}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            href="/dashboard/documents"
            className="text-primary-cyan hover:text-primary-cyan/90 text-sm font-medium"
          >
            View all documents
          </Link>
        </div>
      </div>
    </div>
  );
}