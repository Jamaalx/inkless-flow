"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Mock data for demonstration
const mockSignatures = [
  {
    id: "sig1",
    imageUrl: "/images/signatures/signature1.png",
    isDefault: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "sig2",
    imageUrl: "/images/signatures/signature2.png",
    isDefault: false,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

interface Signature {
  id: string;
  imageUrl: string;
  isDefault: boolean;
  createdAt: string;
}

export default function Signatures() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newSignature, setNewSignature] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // Simulate API call to fetch signatures
    const fetchSignatures = async () => {
      setLoading(true);
      try {
        // In a real implementation, fetch from API
        await new Promise(resolve => setTimeout(resolve, 800));
        setSignatures(mockSignatures);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching signatures:", err);
        setLoading(false);
      }
    };

    fetchSignatures();
  }, []);

  useEffect(() => {
    if (showSignaturePad && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "#243B55"; // primary-blue
        context.lineWidth = 2.5;
        ctxRef.current = context;
      }
    }
  }, [showSignaturePad]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    
    let clientX, clientY;
    if ("touches" in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    
    let clientX, clientY;
    if ("touches" in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setNewSignature(null);
  };

  const saveSignature = () => {
    if (!canvasRef.current) return;
    
    // Convert canvas to base64 image URL
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setNewSignature(dataUrl);
  };

  const handleSaveSignature = async () => {
    if (!newSignature) return;
    
    setIsSaving(true);
    
    try {
      // In a real implementation, upload to API/storage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new signature to list (simulating API response)
      const newSig: Signature = {
        id: `sig${signatures.length + 1}`,
        imageUrl: newSignature,
        isDefault: signatures.length === 0, // First signature is default
        createdAt: new Date().toISOString(),
      };
      
      setSignatures([...signatures, newSig]);
      setShowSignaturePad(false);
      setNewSignature(null);
    } catch (err) {
      console.error("Error saving signature:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const setAsDefault = async (id: string) => {
    // In a real implementation, update via API
    setSignatures(
      signatures.map(sig => ({
        ...sig,
        isDefault: sig.id === id,
      }))
    );
  };

  const deleteSignature = async (id: string) => {
    // In a real implementation, delete via API
    setSignatures(signatures.filter(sig => sig.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-blue">My Signatures</h1>
        <button
          onClick={() => setShowSignaturePad(true)}
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
          Create New Signature
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
        </div>
      ) : showSignaturePad ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-primary-blue mb-4">Create Your Signature</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
            <canvas
              ref={canvasRef}
              className="w-full h-40 bg-gray-50 rounded touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          
          <div className="flex justify-between">
            <div>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray hover:bg-gray-50 mr-2"
              >
                Clear
              </button>
            </div>
            
            <div>
              <button
                onClick={() => setShowSignaturePad(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              
              <button
                onClick={saveSignature}
                className="px-4 py-2 bg-primary-cyan text-white rounded-md hover:bg-primary-cyan/90"
              >
                Save
              </button>
            </div>
          </div>
          
          {newSignature && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
              <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
                <img src={newSignature} alt="New signature" className="max-h-20" />
              </div>
              
              <button
                onClick={handleSaveSignature}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Use This Signature"}
              </button>
            </div>
          )}
        </div>
      ) : signatures.length === 0 ? (
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No signatures yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first signature to use when signing documents.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowSignaturePad(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-orange hover:bg-accent-orange/90"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
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
              Create Signature
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-medium">Your Signatures</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {signatures.map((signature) => (
              <li key={signature.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 inline-block">
                      <img
                        src={signature.imageUrl}
                        alt="Signature"
                        className="h-16 object-contain"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Created on {formatDate(signature.createdAt)}
                      </p>
                      {signature.isDefault && (
                        <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {!signature.isDefault && (
                      <button
                        onClick={() => setAsDefault(signature.id)}
                        className="text-primary-cyan hover:text-primary-cyan/80 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteSignature(signature.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}