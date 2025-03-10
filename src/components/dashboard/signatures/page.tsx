"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { SignaturePad } from "@/components/document/signature-pad";
import { Button } from "@/components/ui/button";

interface Signature {
  id: string;
  imageUrl: string;
  isDefault: boolean;
  createdAt: string;
}

export default function SignaturesPage() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSignatures = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/signatures");
        if (!response.ok) {
          throw new Error("Failed to fetch signatures");
        }
        
        const data = await response.json();
        setSignatures(data);
      } catch (err) {
        console.error("Error fetching signatures:", err);
        setError("Failed to load signatures");
      } finally {
        setLoading(false);
      }
    };

    fetchSignatures();
  }, []);

  const handleSaveSignature = async (signatureDataUrl: string) => {
    setIsSaving(true);
    
    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: signatureDataUrl,
          isDefault: signatures.length === 0, // First signature is default
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save signature");
      }
      
      const newSignature = await response.json();
      setSignatures([...signatures, newSignature]);
      setShowSignaturePad(false);
    } catch (err) {
      console.error("Error saving signature:", err);
      setError("Failed to save signature");
    } finally {
      setIsSaving(false);
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/signatures/${id}/default`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to set signature as default");
      }
      
      // Update local state
      setSignatures(
        signatures.map(sig => ({
          ...sig,
          isDefault: sig.id === id,
        }))
      );
    } catch (err) {
      console.error("Error setting default signature:", err);
      setError("Failed to set signature as default");
    }
  };

  const deleteSignature = async (id: string) => {
    try {
      const response = await fetch(`/api/signatures/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete signature");
      }
      
      // Remove from local state
      setSignatures(signatures.filter(sig => sig.id !== id));
    } catch (err) {
      console.error("Error deleting signature:", err);
      setError("Failed to delete signature");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-blue">My Signatures</h1>
        <Button
          onClick={() => setShowSignaturePad(true)}
          variant="primary"
          className="inline-flex items-center"
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
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {showSignaturePad ? (
        <SignaturePad
          onSave={handleSaveSignature}
          onCancel={() => setShowSignaturePad(false)}
        />
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
            <Button onClick={() => setShowSignaturePad(true)} variant="primary">
              Create Signature
            </Button>
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
                        Created on {format(new Date(signature.createdAt), "MMM d, yyyy")}
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
                      <Button
                        onClick={() => setAsDefault(signature.id)}
                        variant="outline"
                        size="sm"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteSignature(signature.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
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