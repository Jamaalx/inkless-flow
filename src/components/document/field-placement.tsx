"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FieldPlacementProps {
  currentPage: number;
  onAddField: (fieldData: {
    type: string;
    page: number;
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
    required: boolean;
  }) => void;
}

export function FieldPlacement({ currentPage, onAddField }: FieldPlacementProps) {
  const [activeTool, setActiveTool] = useState<"SIGNATURE" | "TEXT" | "DATE" | null>(null);
  
  const getFieldDimensions = (type: string) => {
    switch (type) {
      case "SIGNATURE":
        return { width: 0.25, height: 0.08 };
      case "TEXT":
        return { width: 0.2, height: 0.05 };
      case "DATE":
        return { width: 0.15, height: 0.05 };
      default:
        return { width: 0.2, height: 0.05 };
    }
  };
  
  const handlePlaceField = (e: React.MouseEvent<HTMLDivElement>, containerWidth: number, containerHeight: number) => {
    if (!activeTool) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / containerWidth;
    const y = (e.clientY - rect.top) / containerHeight;
    
    const { width, height } = getFieldDimensions(activeTool);
    
    onAddField({
      type: activeTool,
      page: currentPage,
      xPosition: Math.max(0, Math.min(1 - width, x)),
      yPosition: Math.max(0, Math.min(1 - height, y)),
      width,
      height,
      required: true,
    });
    
    // Reset active tool after placement
    setActiveTool(null);
  };
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add Fields</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTool === "SIGNATURE" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "SIGNATURE" ? null : "SIGNATURE")}
          >
            <span className="mr-1">✍️</span> Signature
          </Button>
          <Button
            variant={activeTool === "TEXT" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "TEXT" ? null : "TEXT")}
          >
            <span className="mr-1">T</span> Text
          </Button>
          <Button
            variant={activeTool === "DATE" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "DATE" ? null : "DATE")}
          >
            <span className="mr-1">📅</span> Date
          </Button>
        </div>
        
        {activeTool && (
          <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            Click on the document to place a {activeTool.toLowerCase()} field.
          </div>
        )}
      </div>
    </div>
  );
}