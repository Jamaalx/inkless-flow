"use client";

import { useState, useRef, useEffect } from "react";

// We need to create a simple Draggable component since it's missing
// This is a basic implementation - you'll need to customize based on your needs
const Draggable = ({ 
  x, 
  y, 
  width, 
  height, 
  isDraggable, 
  isResizable, 
  onDragEnd, 
  onResizeEnd, 
  onClick, 
  children 
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  isDraggable: boolean;
  isResizable: boolean;
  onDragEnd: (x: number, y: number) => void;
  onResizeEnd: (width: number, height: number) => void;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

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

// Define a type for field updates
type FieldUpdates = Partial<Omit<DocumentField, 'id'>>;

interface FieldPlacementProps {
  field: DocumentField;
  isEditing: boolean;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updates: FieldUpdates) => void;
  onDelete: () => void;
}

export function FieldPlacement({
  field,
  isEditing,
  isSelected,
  onClick,
  onUpdate,
  onDelete
}: FieldPlacementProps) {
  const [position, setPosition] = useState({
    x: field.xPosition,
    y: field.yPosition,
  });
  const [size, setSize] = useState({
    width: field.width,
    height: field.height,
  });

  // Update local state when field props change
  useEffect(() => {
    setPosition({
      x: field.xPosition,
      y: field.yPosition,
    });
    setSize({
      width: field.width,
      height: field.height,
    });
  }, [field]);

  // Handle when dragging ends
  const handleDragEnd = (x: number, y: number) => {
    setPosition({ x, y });
    onUpdate({
      xPosition: x,
      yPosition: y,
    });
  };

  // Handle when resizing ends
  const handleResizeEnd = (width: number, height: number) => {
    setSize({ width, height });
    onUpdate({
      width,
      height,
    });
  };

  // Get the right icon based on field type
  const getFieldIcon = () => {
    switch (field.type) {
      case "signature":
        return "✍️";
      case "text":
        return "Aa";
      case "date":
        return "📅";
      case "checkbox":
        return "☑️";
      default:
        return "📝";
    }
  };

  // Field is filled if it has a value
  const isFilled = field.value !== null;

  return (
    <Draggable
      x={position.x}
      y={position.y}
      width={size.width}
      height={size.height}
      isDraggable={isEditing}
      isResizable={isEditing}
      onDragEnd={handleDragEnd}
      onResizeEnd={handleResizeEnd}
      onClick={onClick}
    >
      <div
        className={`w-full h-full flex items-center justify-center border-2 rounded-md ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : isFilled
            ? "border-green-500 bg-green-50"
            : field.required
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        } ${isEditing ? "cursor-move" : "cursor-pointer"}`}
      >
        <div className="text-center">
          <div className="text-xl">{getFieldIcon()}</div>
          <div className="text-xs font-medium mt-1 capitalize">
            {field.type}
            {field.required && !isFilled && " *"}
          </div>
        </div>
      </div>
    </Draggable>
  );
}