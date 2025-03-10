"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Clock, Star, StarOff } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  category?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
}

interface TemplateGridProps {
  templates: Template[];
  onUseTemplate: (templateId: string) => void;
  onViewTemplate: (templateId: string) => void;
  showCategory?: boolean;
  showUsageCount?: boolean;
  emptyMessage?: string;
}

export function TemplateGrid({ 
  templates, 
  onUseTemplate, 
  onViewTemplate, 
  showCategory = false,
  showUsageCount = false,
  emptyMessage = "No templates available"
}: TemplateGridProps) {
  const [favoriteTemplates, setFavoriteTemplates] = useState<Set<string>>(new Set());
  
  const toggleFavorite = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newFavorites = new Set(favoriteTemplates);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    
    setFavoriteTemplates(newFavorites);
  };
  
  // Function to get a color based on the category
  const getCategoryColor = (category: string | null | undefined) => {
    if (!category) return { bg: "bg-gray-100", text: "text-gray-800" };
    
    const categoryColors: Record<string, { bg: string, text: string }> = {
      business: { bg: "bg-blue-100", text: "text-blue-800" },
      legal: { bg: "bg-purple-100", text: "text-purple-800" },
      personal: { bg: "bg-green-100", text: "text-green-800" },
      hr: { bg: "bg-orange-100", text: "text-orange-800" },
      finance: { bg: "bg-indigo-100", text: "text-indigo-800" },
    };
    
    return categoryColors[category] || { bg: "bg-gray-100", text: "text-gray-800" };
  };
  
  if (templates.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No templates found</h3>
        <p className="text-gray-500 mb-6">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => {
        const isFavorite = favoriteTemplates.has(template.id);
        const categoryColors = getCategoryColor(template.category);
        
        return (
          <div 
            key={template.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            onClick={() => onViewTemplate(template.id)}
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center relative">
              <img 
                src={template.fileUrl || "/placeholder-template.png"} 
                alt={template.title}
                className="max-h-full max-w-full object-contain"
              />
              
              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col items-end space-y-2">
                {template.isPublic && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    Public
                  </span>
                )}
                
                {showCategory && template.category && (
                  <span className={`${categoryColors.bg} ${categoryColors.text} text-xs font-semibold px-2 py-1 rounded`}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                )}
              </div>
              
              {/* Favorite button */}
              <button 
                className="absolute top-2 left-2 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100"
                onClick={(e) => toggleFavorite(template.id, e)}
              >
                {isFavorite ? (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 truncate">{template.title}</h3>
              
              {template.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
              )}
              
              {/* Template metadata */}
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {showUsageCount && template.usageCount !== undefined && (
                  <div>
                    <span className="font-medium">{template.usageCount}</span> uses
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTemplate(template.id);
                  }}
                >
                  <FileText className="mr-1.5 h-4 w-4" />
                  Preview
                </Button>
                
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseTemplate(template.id);
                  }}
                >
                  Use
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}