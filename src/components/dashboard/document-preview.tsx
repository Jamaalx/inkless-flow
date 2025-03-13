"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

// PDF.js imports would be needed in a real implementation
// You'd need to add PDF.js as a dependency to your project

interface DocumentPreviewProps {
  documentUrl: string;
  onPageChange?: (pageNumber: number) => void;
  isEditable?: boolean;
  children?: React.ReactNode;
}

export function DocumentPreview({
  documentUrl,
  onPageChange,
  isEditable = false,
  children,
}: DocumentPreviewProps) {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Mock function for document loading - replace with actual PDF.js implementation
  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Mock document loading - in a real implementation, use PDF.js
        // This is a placeholder for the actual PDF loading logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock setting total pages
        setTotalPages(5);
        setCurrentPage(1);
        
        renderPage(1);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load document. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocument();
  }, [documentUrl]);
  
  // Mock function for rendering a page - replace with actual PDF.js implementation
  const renderPage = async (pageNumber: number) => {
    if (!canvasRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Mock page rendering - in a real implementation, use PDF.js
      // This is a placeholder for the actual PDF rendering logic
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set canvas dimensions (mock PDF dimensions)
        canvas.width = 800 * scale;
        canvas.height = 1100 * scale;
        
        // Fill with light gray background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add page content (mock content)
        ctx.fillStyle = '#000000';
        ctx.font = `${14 * scale}px Arial`;
        ctx.fillText(`Page ${pageNumber} of ${totalPages}`, 50 * scale, 50 * scale);
        
        // Draw a mock document outline
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(50 * scale, 70 * scale, 700 * scale, 950 * scale);
        
        // Apply rotation if needed
        if (rotation !== 0) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          // Re-draw everything here if rotation is applied
          ctx.restore();
        }
      }
      
      setCurrentPage(pageNumber);
      
      if (onPageChange) {
        onPageChange(pageNumber);
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      toast({
        title: 'Error',
        description: 'Failed to render page. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      renderPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      renderPage(currentPage + 1);
    }
  };
  
  const zoomIn = () => {
    setScale(prevScale => {
      const newScale = prevScale + 0.1;
      renderPage(currentPage);
      return newScale;
    });
  };
  
  const zoomOut = () => {
    setScale(prevScale => {
      const newScale = Math.max(0.5, prevScale - 0.1);
      renderPage(currentPage);
      return newScale;
    });
  };
  
  const rotate = () => {
    setRotation(prevRotation => {
      const newRotation = (prevRotation + 90) % 360;
      renderPage(currentPage);
      return newRotation;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Document toolbar */}
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={isLoading || currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={isLoading || currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={isLoading}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={isLoading}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Document canvas container */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto bg-gray-100 rounded-md relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <Skeleton className="h-[1100px] w-[800px] rounded-md" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center p-4">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => renderPage(currentPage)}
              >
                Retry
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative flex justify-center min-h-full p-4">
          <canvas
            ref={canvasRef}
            className="shadow-md"
          />
          
          {/* Overlay for editable documents - used for adding signature fields, etc. */}
          {isEditable && !isLoading && !error && (
            <div className="absolute inset-0 pointer-events-none">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentPreview;