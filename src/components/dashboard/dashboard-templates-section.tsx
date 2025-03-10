"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, BookOpen, ArrowRight } from 'lucide-react';

// Define the Template interface directly here since the hook is not found
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

// Create a simple hook to replace useTemplates
const useTemplates = (options: { onlyPublic: boolean }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your API
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError('Error loading templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, fetchTemplates };
};

export function DashboardTemplatesSection() {
  const router = useRouter();
  const { templates, loading, error, fetchTemplates } = useTemplates({
    onlyPublic: false, // Get both public and user's templates
  });
  
  const recentTemplates = templates.slice(0, 4); // Display only 4 most recent templates
  const hasTemplates = recentTemplates.length > 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Templates</h2>
          <p className="text-gray-500 text-sm">Create documents from templates</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/dashboard/templates')}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => fetchTemplates()}
          >
            Retry
          </Button>
        </div>
      ) : !hasTemplates ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-4">Create your first template to get started</p>
          <Button onClick={() => router.push('/dashboard/templates/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTemplates.map((template: Template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onUse={() => router.push(`/dashboard/documents/new?templateId=${template.id}`)}
                onView={() => router.push(`/dashboard/templates/${template.id}`)}
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button onClick={() => router.push('/dashboard/templates/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onUse: () => void;
  onView: () => void;
}

function TemplateCard({ template, onUse, onView }: TemplateCardProps) {
  return (
    <div 
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white cursor-pointer"
      onClick={onView}
    >
      <div className="h-24 bg-gray-100 p-2 flex items-center justify-center relative">
        <img 
          src={template.fileUrl || "/placeholder-template.png"} 
          alt={template.title}
          className="max-h-full max-w-full object-contain"
        />
        
        {template.isPublic && (
          <span className="absolute top-1 right-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
            Public
          </span>
        )}
        
        {template.category && (
          <span className="absolute bottom-1 right-1 bg-gray-200 text-gray-800 text-xs px-1.5 py-0.5 rounded">
            {template.category}
          </span>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm truncate" title={template.title}>
          {template.title}
        </h3>
        
        <div className="flex justify-between items-center mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <FileText className="h-3 w-3 mr-1" />
            Preview
          </Button>
          
          <Button 
            size="sm" 
            className="text-xs p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onUse();
            }}
          >
            Use
          </Button>
        </div>
      </div>
    </div>
  );
}