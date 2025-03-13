"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Download, Check, RefreshCw } from "lucide-react";

interface SignaturePadProps {
  onSave?: (signatureDataUrl: string) => void;
  initialSignature?: string;
  height?: number;
  width?: number;
}

export function SignaturePad({ 
  onSave, 
  initialSignature, 
  height = 200, 
  width = 500 
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas and load initial signature if provided
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setContext(ctx);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#243B55'; // Deep Blue from brand colors
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF'; // White background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  // Handle drawing events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    // Get drawing coordinates
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    context.beginPath();
    context.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    // Get drawing coordinates
    let clientX, clientY;
    
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling when drawing on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing || !context) return;
    context.closePath();
    setIsDrawing(false);
  };

  // Clear signature
  const clearSignature = () => {
    if (!context || !canvasRef.current) return;
    
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
  };

  // Save signature
  const saveSignature = () => {
    if (!canvasRef.current || !hasSignature) return;
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    if (onSave) {
      onSave(dataUrl);
    }
  };

  // Download signature
  const downloadSignature = () => {
    if (!canvasRef.current || !hasSignature) return;
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-signature.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <Card className="w-full max-w-[500px] mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-xl font-medium text-gray-800">
          Draw Your Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="border rounded-md bg-white">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="cursor-crosshair touch-none w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="mr-2"
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSignature}
            disabled={!hasSignature}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        <div>
          <Button
            variant="default"
            size="sm"
            onClick={saveSignature}
            disabled={!hasSignature}
            className="bg-deep-blue hover:bg-blue-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Save Signature
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignaturePad;