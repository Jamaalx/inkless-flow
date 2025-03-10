"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <div className="relative w-8 h-8 mr-2">
                    <div className="absolute top-1/2 w-full h-0.5 bg-primary-cyan rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-2.5 h-2.5 bg-primary-blue rounded-full transform -translate-y-1/2"></div>
                  </div>
                  <h1 className="text-xl font-bold">
                    Inkless<span className="text-primary-cyan">Flow</span>
                  </h1>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray hover:text-primary-blue"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="px-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Documents
            </h2>
            <div className="mt-2 space-y-1">
              <Link
                href="/dashboard"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard") && !isActive("/dashboard/documents") && !isActive("/dashboard/templates") && !isActive("/dashboard/signatures")
                    ? "bg-primary-cyan/10 text-primary-blue"
                    : "text-gray hover:bg-gray-50"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/dashboard") && !isActive("/dashboard/documents") && !isActive("/dashboard/templates") && !isActive("/dashboard/signatures")
                      ? "text-primary-cyan"
                      : "text-gray-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                href="/dashboard/documents"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard/documents")
                    ? "bg-primary-cyan/10 text-primary-blue"
                    : "text-gray hover:bg-gray-50"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/dashboard/documents") ? "text-primary-cyan" : "text-gray-400"
                  }`}
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
                Documents
              </Link>

              <Link
                href="/dashboard/templates"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard/templates")
                    ? "bg-primary-cyan/10 text-primary-blue"
                    : "text-gray hover:bg-gray-50"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/dashboard/templates") ? "text-primary-cyan" : "text-gray-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
                Templates
              </Link>

              <Link
                href="/dashboard/signatures"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard/signatures")
                    ? "bg-primary-cyan/10 text-primary-blue"
                    : "text-gray hover:bg-gray-50"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    isActive("/dashboard/signatures") ? "text-primary-cyan" : "text-gray-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Signatures
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-bg-light p-6">
          {children}
        </main>
      </div>
    </div>
  );
}