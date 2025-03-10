"use client";

import { useState, useEffect } from 'react';

export interface Template {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  category?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  fields?: Array<{
    id: string;
    type: string;
    label: string;
    page: number;
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
    required: boolean;
  }>;
}

interface UseTemplatesOptions {
  initialTemplates?: Template[];
  includeFields?: boolean;
  onlyPublic?: boolean;
  category?: string | null;
  userId?: string | null;
}

export function useTemplates(options: UseTemplatesOptions = {}) {
  const [templates, setTemplates] = useState<Template[]>(options.initialTemplates || []);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all templates
  const fetchTemplates = async (searchParams?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construct query string
      const queryParams = new URLSearchParams();
      
      if (options.onlyPublic) {
        queryParams.append('isPublic', 'true');
      }
      
      if (options.category) {
        queryParams.append('category', options.category);
      }
      
      if (options.userId) {
        queryParams.append('userId', options.userId);
      }
      
      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }
      
      const queryString = queryParams.toString();
      const url = `/api/templates${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplates(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching templates';
      setError(errorMessage);
      console.error("Error fetching templates:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a template by ID
  const fetchTemplateById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/templates/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedTemplate(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the template';
      setError(errorMessage);
      console.error("Error fetching template:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a document from a template
  const createDocumentFromTemplate = async (templateId: string, documentData: { title: string; description?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create document from template: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating document from template';
      setError(errorMessage);
      console.error("Error creating document from template:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new template
  const createTemplate = async (templateData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        body: templateData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.status}`);
      }
      
      const newTemplate = await response.json();
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the template';
      setError(errorMessage);
      console.error("Error creating template:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update a template
  const updateTemplate = async (id: string, templateData: Partial<Template>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update template: ${response.status}`);
      }
      
      const updatedTemplate = await response.json();
      
      // Update templates list
      setTemplates(prev => 
        prev.map(template => 
          template.id === id ? updatedTemplate : template
        )
      );
      
      // Update selected template if it matches the ID
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(updatedTemplate);
      }
      
      return updatedTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the template';
      setError(errorMessage);
      console.error("Error updating template:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a template
  const deleteTemplate = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete template: ${response.status}`);
      }
      
      // Remove from templates list
      setTemplates(prev => prev.filter(template => template.id !== id));
      
      // Clear selected template if it matches the ID
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the template';
      setError(errorMessage);
      console.error("Error deleting template:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Load templates on component mount if requested
  useEffect(() => {
    if (options.initialTemplates === undefined) {
      fetchTemplates();
    }
  }, [options.onlyPublic, options.category, options.userId]);
  
  return {
    templates,
    selectedTemplate,
    loading,
    error,
    fetchTemplates,
    fetchTemplateById,
    setSelectedTemplate,
    createDocumentFromTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}