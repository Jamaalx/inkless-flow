"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUpload } from "@/components/document/file-upload";

interface UploadedFile {
  url: string;
  key: string;
  name: string;
  size: number;
}

export default function NewDocument() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileUploaded = (fileData: UploadedFile) => {
    setUploadedFile(fileData);
    
    // Auto-set title from filename if not already set
    if (!title && fileData.name) {
      // Remove extension and replace hyphens/underscores with spaces
      const nameWithoutExtension = fileData.name.split('.').slice(0, -1).join('.');
      const cleanedName = nameWithoutExtension.replace(/[-_]/g, ' ');
      setTitle(cleanedName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title) {
      setError("Please enter a document title");
      return;
    }

    if (!uploadedFile) {
      setError("Please upload a document");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would create the document in your database
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          fileUrl: uploadedFile.url,
          fileKey: uploadedFile.key,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const data = await response.json();
      
      // Redirect to the document page
      router.push(`/dashboard/documents/${data.id}`);
    } catch (err) {
      console.error("Error creating document:", err);
      setError("An error occurred while creating your document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-blue">New Document</h1>
        <Link
          href="/dashboard/documents"
          className="text-gray hover:text-primary-blue"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray mb-1"
            >
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              placeholder="Enter document title"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              placeholder="Enter a description (optional)"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray mb-1">
              Upload Document <span className="text-red-500">*</span>
            </label>
            <FileUpload
              onFileUploaded={handleFileUploaded}
              onError={setError}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !uploadedFile}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-orange hover:bg-accent-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Document"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}