"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/document/signature-pad";

interface DocumentField {
  id: string;
  type: string;
  page: number;
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  value: string | null;
  required: boolean;
}

interface Document {
  id: string;
  title: string;
  status: string;
  fileUrl: string;
  documentFields: DocumentField[];
}

interface Signature {
  id: string;
  imageUrl: string;
  isDefault: boolean;
}

export default function SignDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [completedFields, setCompletedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch document
        const docResponse = await fetch(`/api/documents/${documentId}`);
        if (!docResponse.ok) {
          throw new Error("Failed to fetch document");
        }
        const docData = await docResponse.json();
        setDocument(docData);
        
        // Calculate total pages (in a real app, get this from the document)
        setTotalPages(3); // Placeholder
        
        // Fetch user's signatures
        const sigResponse = await fetch("/api/signatures");
        if (!sigResponse.ok) {
          throw new Error("Failed to fetch signatures");
        }
        const sigData = await sigResponse.json();
        setSignatures(sigData);
        
        // Initialize completed fields
        const completed: Record<string, boolean> = {};
        docData.documentFields.forEach((field: DocumentField) => {
          completed[field.id] = !!field.value;
        });
        setCompletedFields(completed);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load document or signatures");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleSignatureSelect = (signatureImageUrl: string) => {
    if (!activeFieldId) return;
    
    // Update field value
    setDocument(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        documentFields: prev.documentFields.map(field => 
          field.id === activeFieldId 
            ? { ...field, value: signatureImageUrl } 
            : field
        )
      };
    });
    
    // Mark field as completed
    setCompletedFields(prev => ({
      ...prev,
      [activeFieldId]: true
    }));
    
    setActiveFieldId(null);
  };

  const handleSignatureDraw = (signatureDataUrl: string) => {
    handleSignatureSelect(signatureDataUrl);
    setShowSignaturePad(false);
  };

  const handleTextFieldChange = (fieldId: string, value: string) => {
    // Update field value
    setDocument(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        documentFields: prev.documentFields.map(field => 
          field.id === fieldId 
            ? { ...field, value } 
            : field
        )
      };
    });
    
    // Mark field as completed
    setCompletedFields(prev => ({
      ...prev,
      [fieldId]: value.trim().length > 0
    }));
  };

  const handleSubmit = async () => {
    if (!document) return;
    
    // Check if all required fields are completed
    const allRequiredFieldsCompleted = document.documentFields
      .filter(field => field.required)
      .every(field => completedFields[field.id]);
    
    if (!allRequiredFieldsCompleted) {
      setError("Please complete all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save the field values
      const response = await fetch(`/api/documents/${documentId}/fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: document.documentFields
            .filter(field => completedFields[field.id])
            .map(field => ({
              id: field.id,
              value: field.value
            }))
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save signed document");
      }
      
      // Redirect to the document view page
      router.push(`/dashboard/documents/${documentId}?signed=true`);
    } catch (err) {
      console.error("Error submitting signed document:", err);
      setError("Failed to save signed document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const areAllRequiredFieldsCompleted = () => {
    if (!document) return false;
    
    return document.documentFields
      .filter(field => field.required)
      .every(field => completedFields[field.id]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
      </div>
    );
  }

  if (error || !document) {
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
          {error || "Document not found"}
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-cyan hover:bg-primary-cyan/90"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  const fieldsOnCurrentPage = document.documentFields.filter(
    field => field.page === currentPage
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link 
            href={`/dashboard/documents/${documentId}`}
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
            Sign: {document.title}
          </h1>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !areAllRequiredFieldsCompleted()}
          variant="primary"
        >
          {isSubmitting ? "Submitting..." : "Complete Signing"}
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {showSignaturePad ? (
        <SignaturePad
          onSave={handleSignatureDraw}
          onCancel={() => setShowSignaturePad(false)}
        />
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            </div>
            <div className="flex items-center justify-center bg-gray-50 h-[600px] overflow-auto relative">
              {/* Document preview */}
              <div className="relative bg-white shadow-md w-[595px] h-[842px]">
                {/* Placeholder for document content */}
                <div className="p-10">
                  <h2 className="text-xl font-bold mb-6">{document.title}</h2>
                  <p className="mb-4">
                    This is a sample document content. In a real implementation,
                    this would be the actual document content loaded from the file.
                  </p>
                </div>
                
                {/* Render fields for the current page */}
                {fieldsOnCurrentPage.map(field => (
                  <div
                    key={field.id}
                    className={`absolute border-2 ${
                      activeFieldId === field.id
                        ? 'border-primary-cyan bg-primary-cyan/10'
                        : completedFields[field.id]
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 bg-white/80'
                    } rounded-md flex items-center justify-center cursor-pointer`}
                    style={{
                      left: `${field.xPosition * 100}%`,
                      top: `${field.yPosition * 100}%`,
                      width: `${field.width * 100}%`,
                      height: `${field.height * 100}%`,
                    }}
                    onClick={() => {
                      if (field.type === 'SIGNATURE') {
                        setActiveFieldId(field.id);
                      }
                    }}
                  >
                    {field.type === 'SIGNATURE' && !field.value && (
                      <span className="text-sm text-gray-500">Click to sign</span>
                    )}
                    {field.type === 'TEXT' && (
                      <input
                        type="text"
                        className="w-full h-full p-1 bg-transparent border-none focus:outline-none text-center"
                        placeholder="Type here"
                        value={field.value || ''}
                        onChange={(e) => handleTextFieldChange(field.id, e.target.value)}
                      />
                    )}
                    {field.type === 'DATE' && (
                      <input
                        type="date"
                        className="w-full h-full p-1 bg-transparent border-none focus:outline-none text-center"
                        value={field.value || ''}
                        onChange={(e) => handleTextFieldChange(field.id, e.target.value)}
                      />
                    )}
                    {field.value && field.type === 'SIGNATURE' && (
                      <img src={field.value} alt="Signature" className="w-full h-full object-contain" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Signature selection panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-medium">Select Your Signature</h2>
            </div>
            
            {activeFieldId ? (
              <div className="p-4">
                {signatures.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      Choose a signature to place in the document or create a new one.
                    </p>
                    
                    <div className="space-y-4">
                      {signatures.map(signature => (
                        <div 
                          key={signature.id}
                          className="border border-gray-200 rounded-md p-3 cursor-pointer hover:border-primary-cyan hover:bg-primary-cyan/5"
                          onClick={() => handleSignatureSelect(signature.imageUrl)}
                        >
                          <div className="bg-gray-50 border border-gray-100 rounded-md p-2">
                            <img
                              src={signature.imageUrl}
                              alt="Signature"
                              className="h-12 object-contain mx-auto"
                            />
                          </div>
                          {signature.isDefault && (
                            <div className="mt-2 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Default
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <span className="relative z-0 inline-flex shadow-sm rounded-md">
                        <Button
                          onClick={() => setShowSignaturePad(true)}
                          variant="outline"
                          className="w-full"
                        >
                          Draw New Signature
                        </Button>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No signatures</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any saved signatures.
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={() => setShowSignaturePad(true)}
                        variant="primary"
                      >
                        Draw New Signature
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  Click on a signature field in the document to sign it.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}