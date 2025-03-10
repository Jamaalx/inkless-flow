"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Mock template detail data
const mockTemplateDetail = {
  id: "template1",
  title: "Non-Disclosure Agreement",
  description: "Standard NDA for protecting confidential information between parties. This template includes all necessary clauses for general business use and can be customized as needed.",
  category: "Legal",
  thumbnail: "/images/templates/nda.png",
  previewUrl: "/documents/nda-preview.pdf",
  fields: [
    { id: "field1", name: "Company Name", type: "text", required: true },
    { id: "field2", name: "Other Party Name", type: "text", required: true },
    { id: "field3", name: "Effective Date", type: "date", required: true },
    { id: "field4", name: "Governing Law State", type: "text", required: true },
    { id: "field5", name: "Term (months)", type: "number", required: true }
  ],
  creator: "Inkless Flow",
  createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
  usageCount: 1245,
  isPublic: true,
  tags: ["NDA", "Confidentiality", "Legal", "Business"]
};

interface TemplateField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

interface TemplateDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  fields: TemplateField[];
  creator: string;
  createdAt: string;
  usageCount: number;
  isPublic: boolean;
  tags: string[];
}

export default function TemplateDetail() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    // Simulate API call to fetch template details
    const fetchTemplateDetail = async () => {
      setLoading(true);
      try {
        // In a real implementation, fetch from API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demonstration, we're using the mock data
        setTemplate(mockTemplateDetail);
        setTotalPages(3); // Simulating a 3-page template preview
        setLoading(false);
      } catch (err) {
        console.error("Error fetching template:", err);
        setError("Failed to load template details");
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplateDetail();
    }
  }, [templateId]);

  const handleUseTemplate = () => {
    // In a real implementation, this would create a new document from the template
    // and redirect to the document editor
    router.push(`/dashboard/documents/new?template=${templateId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || "Template not found"}
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-cyan hover:bg-primary-cyan/90"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link 
          href="/dashboard/templates"
          className="mr-4 text-gray-500 hover:text-primary-blue"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-primary-blue">
          {template.title}
        </h1>
        <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {template.category}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Template Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px]">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 rounded hover:bg-gray-200"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="p-1 rounded hover:bg-gray-200"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-gray-200">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-gray-200">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-gray-50 h-full overflow-auto">
              {/* This would be the actual template preview in a real implementation */}
              <div className="bg-white shadow-md w-[595px] h-[842px] relative">
                <div className="p-10">
                  <h2 className="text-xl font-bold mb-6">
                    {template.title} - Preview
                  </h2>
                  <p className="mb-4">
                    THIS NON-DISCLOSURE AGREEMENT (the "Agreement") is made and entered into as of [Effective Date] by and between:
                  </p>
                  <p className="mb-4 font-medium">[Company Name] ("Disclosing Party")</p>
                  <p className="mb-4">and</p>
                  <p className="mb-4 font-medium">[Other Party Name] ("Receiving Party")</p>
                  <p className="mb-8">
                    WHEREAS, the Disclosing Party possesses certain confidential and proprietary information, as defined below, and wishes to safeguard it;
                  </p>
                  
                  <h3 className="text-lg font-bold mb-4">1. DEFINITION OF CONFIDENTIAL INFORMATION</h3>
                  <p className="mb-4">
                    "Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or by any other means...
                  </p>
                  
                  {/* Template field placeholders */}
                  <div className="mt-8 p-4 border-2 border-dashed border-primary-cyan rounded-md bg-primary-cyan/5">
                    <p className="text-sm text-primary-blue font-medium mb-2">Template fields highlighted in this document:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {template.fields.map(field => (
                        <li key={field.id}>{field.name} {field.required ? "(Required)" : "(Optional)"}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Template details and actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-medium">Template Details</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">{template.description}</p>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-1">Created by</h3>
                <p>{template.creator}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-1">Created on</h3>
                <p>{formatDate(template.createdAt)}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-1">Used</h3>
                <p>{template.usageCount.toLocaleString()} times</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {template.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-1">Required Fields</h3>
                <ul className="list-disc list-inside text-sm">
                  {template.fields.filter(f => f.required).map(field => (
                    <li key={field.id}>{field.name}</li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={handleUseTemplate}
                className="w-full bg-accent-orange text-white font-medium py-2 px-4 rounded-md hover:bg-accent-orange/90"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}