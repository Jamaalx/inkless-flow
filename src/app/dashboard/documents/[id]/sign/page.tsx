"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, File, AlertTriangle } from "lucide-react";

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
  signerId?: string | null;
}

interface DocumentSigner {
  id: string;
  email: string;
  name: string | null;
  status: string;
  signedAt: string | null;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  status: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  documentFields: DocumentField[];
  documentSigners: DocumentSigner[];
}

export default function DocumentSignPage() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentId = params.id as string;
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [signedSuccessfully, setSignedSuccessfully] = useState(false);
  
  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/documents/${documentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch document");
        }
        
        const data = await response.json();
        setDocument(data);
        
        // Set total pages (in a real app, get this from the document)
        setTotalPages(3); // placeholder
        
        // Initialize field values
        const initialValues: Record<string, string> = {};
        data.documentFields.forEach((field: DocumentField) => {
          if (field.value) {
            initialValues[field.id] = field.value;
          }
        });
        setFieldValues(initialValues);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  // Get fields for current page
  const getFieldsForCurrentPage = () => {
    if (!document) return [];
    return document.documentFields.filter(field => field.page === currentPage);
  };

  // Setup canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeField) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    // Handle mouse down
    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      setStartPoint({
        x: e.offsetX,
        y: e.offsetY
      });
    };

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      setStartPoint({
        x: e.offsetX,
        y: e.offsetY
      });
    };

    // Handle mouse up
    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    // Handle mouse out
    const handleMouseOut = () => {
      setIsDrawing(false);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);

    // Clean up
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [activeField, isDrawing, startPoint]);

  // Handle signature clear
  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Handle signature save
  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      const dataURL = canvas.toDataURL();
      
      // If there's an active signature field, update its value
      if (activeField) {
        setFieldValues({
          ...fieldValues,
          [activeField]: dataURL,
        });
        
        // Clear active field after setting
        setActiveField(null);
      }
    } catch (err) {
      console.error("Error saving signature:", err);
    }
  };

  // Check if all required fields are filled
  const areAllRequiredFieldsFilled = () => {
    if (!document) return false;
    
    const requiredFields = document.documentFields.filter(field => field.required);
    return requiredFields.every(field => fieldValues[field.id]);
  };

  // Submit the signed document
  const handleSubmit = async () => {
    if (!document) return;
    
    if (!areAllRequiredFieldsFilled()) {
      setError("Please fill all required fields before submitting");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      // Format field data for submission
      const fieldData = Object.entries(fieldValues).map(([id, value]) => ({
        id,
        value,
      }));
      
      const response = await fetch(`/api/documents/${documentId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: fieldData,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to sign document");
      }
      
      // Show success state
      setSignedSuccessfully(true);
    } catch (err) {
      console.error("Error signing document:", err);
      setError("Failed to sign document. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // If completed, show success page
  if (signedSuccessfully) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <div className="bg-green-100 text-green-700 rounded-full p-4 inline-block mb-4">
            <Check className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Document Signed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for completing this document.</p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push(`/dashboard/documents/${documentId}?signed=true`)}
              className="w-full"
            >
              View Document
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/documents")}
              className="w-full"
            >
              Back to Documents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
            <Button onClick={() => router.push("/dashboard/documents")}>
              Back to Documents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/documents/${documentId}`)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Document
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Document viewer */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold">{document.title}</h1>
            {document.description && (
              <p className="text-gray-600">{document.description}</p>
            )}
            
            <div className="bg-gray-100 rounded-lg mb-4 flex justify-between items-center p-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              
              <span>
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div 
              className="relative bg-white border border-gray-200 rounded-lg"
              style={{ height: "700px" }}
            >
              {/* Document page (placeholder) */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={document.fileUrl || "/placeholder-document.png"}
                  alt="Document Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Fields overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {getFieldsForCurrentPage().map(field => {
                  const isFilled = !!fieldValues[field.id];
                  const isRequired = field.required;
                  
                  return (
                    <div
                      key={field.id}
                      className={`absolute border-2 rounded-md ${
                        isFilled
                          ? "border-green-500 bg-green-50"
                          : isRequired
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } cursor-pointer pointer-events-auto`}
                      style={{
                        left: `${field.xPosition}%`,
                        top: `${field.yPosition}%`,
                        width: `${field.width}%`,
                        height: `${field.height}%`,
                      }}
                      onClick={() => {
                        if (field.type === "signature") {
                          setActiveField(field.id);
                        }
                      }}
                    >
                      {fieldValues[field.id] && field.type === "signature" ? (
                        <img 
                          src={fieldValues[field.id]} 
                          alt="Signature" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-gray-500">
                            {field.type === "signature" ? "Click to sign" : field.type}
                            {isRequired && !isFilled && " *"}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Signature panel */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Document Summary</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="font-semibold">{document.status.toUpperCase()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Remaining Required Fields</p>
                <p className="font-semibold">
                  {document.documentFields.filter(f => f.required && !fieldValues[f.id]).length} of {document.documentFields.filter(f => f.required).length}
                </p>
              </div>
              
              <Button
                className="w-full"
                disabled={!areAllRequiredFieldsFilled() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Complete Signing"}
              </Button>
            </div>
          </div>
          
          {activeField && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add Your Signature</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveField(null)}
                >
                  Cancel
                </Button>
              </div>
              
              <div className="border rounded-md mb-4">
                <canvas
                  ref={canvasRef}
                  className="w-full h-40 bg-white"
                  width={300}
                  height={150}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleClearSignature}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSaveSignature}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          
          {!activeField && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Instructions</h2>
              
              <div className="space-y-3 text-sm">
                <p>
                  Click on any signature field in the document to sign.
                </p>
                <p>
                  All fields marked with an asterisk (*) are required to complete the signing process.
                </p>
                <p>
                  Use the navigation buttons to move between pages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}