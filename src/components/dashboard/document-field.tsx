"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  Type, 
  Calendar, 
  Check, 
  SignatureIcon,
  GripVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type FieldType = 'SIGNATURE' | 'TEXT' | 'DATE' | 'CHECKBOX' | 'INITIAL';

interface FieldStyles {
  backgroundColor: string;
  borderColor: string;
  icon: React.ReactNode;
  label: string;
}

export interface DocumentFieldProps {
  id: string;
  type: FieldType;
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
  required?: boolean;
  editable?: boolean;
  signerEmail?: string;
  signerName?: string;
  page: number;
  currentPage: number;
  onUpdate?: (id: string, updates: Partial<Omit<DocumentFieldProps, 'id'>>) => void;
  onDelete?: (id: string) => void;
  onFocus?: (id: string) => void;
  scale?: number;
}

export function DocumentField({
  id,
  type,
  x,
  y,
  width,
  height,
  value,
  required = true,
  editable = true,
  signerEmail,
  signerName,
  page,
  currentPage,
  onUpdate,
  onDelete,
  onFocus,
  scale = 1,
}: DocumentFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [dimensions, setDimensions] = useState({ width, height });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  // Hide if not on current page
  if (page !== currentPage) {
    return null;
  }

  const fieldStyles: Record<FieldType, FieldStyles> = {
    SIGNATURE: {
      backgroundColor: 'rgba(72, 202, 228, 0.1)',  // Soft Cyan with opacity
      borderColor: '#48CAE4',  // Soft Cyan
      icon: <SignatureIcon className="h-4 w-4" />,
      label: 'Signature',
    },
    TEXT: {
      backgroundColor: 'rgba(236, 236, 236, 0.5)',
      borderColor: '#708090',  // Slate Gray
      icon: <Type className="h-4 w-4" />,
      label: 'Text',
    },
    DATE: {
      backgroundColor: 'rgba(236, 236, 236, 0.5)',
      borderColor: '#708090',  // Slate Gray
      icon: <Calendar className="h-4 w-4" />,
      label: 'Date',
    },
    CHECKBOX: {
      backgroundColor: 'rgba(236, 236, 236, 0.5)',
      borderColor: '#708090',  // Slate Gray
      icon: <Check className="h-4 w-4" />,
      label: 'Checkbox',
    },
    INITIAL: {
      backgroundColor: 'rgba(147, 129, 255, 0.1)',  // Lavender Purple with opacity
      borderColor: '#9381FF',  // Lavender Purple
      icon: <Pencil className="h-4 w-4" />,
      label: 'Initial',
    },
  };

  const currentStyle = fieldStyles[type];

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    if (onFocus) {
      onFocus(id);
      setIsFocused(true);
    }

    // Add event listeners to window to track mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    if (isDragging) {
      // Update position
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPosition({ x: newX, y: newY });
    } else if (isResizing) {
      // Update dimensions relative to starting point
      const parent = fieldRef.current?.parentElement;
      if (!parent) return;
      
      const parentRect = parent.getBoundingClientRect();
      
      // Calculate new width and height
      const newWidth = Math.max(50, e.clientX - parentRect.left - position.x);
      const newHeight = Math.max(30, e.clientY - parentRect.top - position.y);
      
      setDimensions({ width: newWidth, height: newHeight });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      // Save changes if there was actually a drag or resize
      if (onUpdate) {
        onUpdate(id, {
          x: position.x,
          y: position.y,
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    }
    
    setIsDragging(false);
    setIsResizing(false);
    
    // Remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse down for resizing
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    
    // Add event listeners to window to track mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete) {
      onDelete(id);
    }
  };

  // Apply scale to dimensions and position
  const scaledPosition = {
    x: position.x * scale,
    y: position.y * scale,
  };
  
  const scaledDimensions = {
    width: dimensions.width * scale,
    height: dimensions.height * scale,
  };

  // Update position and dimensions when props change and not dragging or resizing
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setPosition({ x, y });
      setDimensions({ width, height });
    }
  }, [x, y, width, height, isDragging, isResizing]);

  return (
    <div
      ref={fieldRef}
      className={cn(
        "absolute flex flex-col border-2 rounded cursor-move",
        isFocused ? "z-10" : "z-0",
        editable ? "pointer-events-auto" : "pointer-events-none"
      )}
      style={{
        left: `${scaledPosition.x}px`,
        top: `${scaledPosition.y}px`,
        width: `${scaledDimensions.width}px`,
        height: `${scaledDimensions.height}px`,
        backgroundColor: currentStyle.backgroundColor,
        borderColor: isFocused ? '#FF7E47' : currentStyle.borderColor, // Highlight with Sunrise Orange when focused
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Field header */}
      <div className="flex justify-between items-center p-1 text-xs bg-white bg-opacity-80">
        <div className="flex items-center space-x-1">
          {currentStyle.icon}
          <span>{currentStyle.label}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
        
        {editable && (
          <div className="flex items-center">
            <button
              className="p-1 hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      
      {/* Field content - placeholder or value */}
      <div className="flex-1 flex items-center justify-center p-1 text-sm overflow-hidden">
        {value ? (
          <div className="w-full h-full flex items-center justify-center">
            {type === 'SIGNATURE' && (
              <img src={value} alt="Signature" className="max-w-full max-h-full object-contain" />
            )}
            {type === 'TEXT' && (
              <span className="truncate">{value}</span>
            )}
            {type === 'DATE' && (
              <span>{value}</span>
            )}
            {type === 'CHECKBOX' && (
              <div className={`h-5 w-5 border rounded ${value === 'true' ? 'bg-soft-cyan' : 'bg-white'}`}>
                {value === 'true' && <Check className="h-4 w-4 text-deep-blue" />}
              </div>
            )}
            {type === 'INITIAL' && (
              <span className="font-bold">{value}</span>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center truncate">
            {signerName || signerEmail || (editable ? 'Drag to position' : '')}
          </div>
        )}
      </div>
      
      {/* Resize handle */}
      {editable && (
        <div
          className="absolute bottom-0 right-0 h-3 w-3 cursor-se-resize"
          style={{
            backgroundColor: isFocused ? '#FF7E47' : currentStyle.borderColor,
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}

export default DocumentField;