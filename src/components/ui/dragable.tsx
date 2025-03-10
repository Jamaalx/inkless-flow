// components/ui/draggable.tsx
"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";

interface Position {
  x: number | string;
  y: number | string;
}

interface DraggableProps {
  children: ReactNode;
  initialPosition: Position;
  dragEnabled?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
}

export function Draggable({
  children,
  initialPosition,
  dragEnabled = true,
  onDragStart,
  onDragEnd,
}: DraggableProps) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const positionRef = useRef<{ x: number; y: number } | null>(null);

  // Convert initial position from percentage or pixel to numerical value
  useEffect(() => {
    if (!elementRef.current || !elementRef.current.parentElement) return;
    
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    
    // Convert initialPosition to pixels if it's a percentage
    let xPos = typeof initialPosition.x === 'string' && initialPosition.x.includes('%')
      ? (parseFloat(initialPosition.x) / 100) * parentRect.width
      : typeof initialPosition.x === 'string'
        ? parseFloat(initialPosition.x)
        : initialPosition.x;
        
    let yPos = typeof initialPosition.y === 'string' && initialPosition.y.includes('%')
      ? (parseFloat(initialPosition.y) / 100) * parentRect.height
      : typeof initialPosition.y === 'string'
        ? parseFloat(initialPosition.y)
        : initialPosition.y;
    
    positionRef.current = { x: xPos, y: yPos };
  }, [initialPosition]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragEnabled) return;
    e.preventDefault();
    
    const elem = elementRef.current;
    if (!elem) return;
    
    setIsDragging(true);
    if (onDragStart) onDragStart();
    
    // Store the initial mouse position
    dragStartRef.current = { 
      x: e.clientX, 
      y: e.clientY 
    };
    
    // Get the current position of the element
    const rect = elem.getBoundingClientRect();
    positionRef.current = { 
      x: rect.left, 
      y: rect.top 
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragEnabled || !dragStartRef.current || !positionRef.current) return;
    
    // Calculate the new position
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    const newX = positionRef.current.x + dx;
    const newY = positionRef.current.y + dy;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    dragStartRef.current = null;
    
    if (onDragEnd && positionRef.current) {
      onDragEnd(positionRef.current.x, positionRef.current.y);
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Calculate position style
  const positionStyle = {
    left: typeof position.x === 'string' ? position.x : `${position.x}px`,
    top: typeof position.y === 'string' ? position.y : `${position.y}px`,
    position: 'absolute' as 'absolute',
  };

  return (
    <div
      ref={elementRef}
      style={positionStyle}
      onMouseDown={handleMouseDown}
      className={`${isDragging ? 'cursor-grabbing' : dragEnabled ? 'cursor-grab' : ''}`}
    >
      {children}
    </div>
  );
}