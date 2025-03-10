// src/components/dashboard/signer-invitation-form.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { toast } from 'react-hot-toast';

// Validation schema
const inviteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  order: z.number().min(1, 'Order is required').optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface SignerInvitationFormProps {
  documentId: string;
  onInviteSuccess: () => void;
  existingSigners?: { id: string; name: string; email: string; order?: number }[];
}

export function SignerInvitationForm({
  documentId,
  onInviteSuccess,
  existingSigners = [],
}: SignerInvitationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: '',
      email: '',
      order: existingSigners.length + 1,
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/documents/${documentId}/signers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to invite signer');
      }
      
      toast.success('Signer invited successfully');
      reset();
      onInviteSuccess();
    } catch (error) {
      console.error('Error inviting signer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to invite signer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Invite Signers</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            {...register('name')}
            placeholder="Signer's name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            {...register('email')}
            type="email"
            placeholder="email@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signing Order (optional)
          </label>
          <Input
            {...register('order', { valueAsNumber: true })}
            type="number"
            min={1}
            placeholder="1"
            className={errors.order ? 'border-red-500' : ''}
          />
          {errors.order && (
            <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>
          )}
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Inviting...' : 'Invite Signer'}
        </Button>
      </form>
    </Card>
  );
}

// src/components/dashboard/signer-list.tsx
import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { toast } from 'react-hot-toast';
import { SignerStatus } from '@prisma/client';
import { ArrowUp, ArrowDown, Mail, Trash2 } from 'lucide-react';

interface Signer {
  id: string;
  name: string;
  email: string;
  status: SignerStatus;
  order?: number;
  signedAt?: string;
}

interface SignerListProps {
  documentId: string;
  signers: Signer[];
  onSignersUpdated: () => void;
  isDocumentAuthor: boolean;
}

export function SignerList({
  documentId,
  signers,
  onSignersUpdated,
  isDocumentAuthor,
}: SignerListProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleRemoveSigner = async (signerId: string) => {
    if (!confirm('Are you sure you want to remove this signer?')) return;
    
    setIsLoading(prev => ({ ...prev, [signerId]: true }));
    
    try {
      const response = await fetch(`/api/documents/${documentId}/signers/${signerId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove signer');
      }
      
      toast.success('Signer removed successfully');
      onSignersUpdated();
    } catch (error) {
      console.error('Error removing signer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove signer');
    } finally {
      setIsLoading(prev => ({ ...prev, [signerId]: false }));
    }
  };

  const handleSendReminder = async (signerId: string) => {
    setIsLoading(prev => ({ ...prev, [signerId]: true }));
    
    try {
      const response = await fetch(`/api/documents/${documentId}/signers/${signerId}/remind`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reminder');
      }
      
      toast.success('Reminder sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reminder');
    } finally {
      setIsLoading(prev => ({ ...prev, [signerId]: false }));
    }
  };

  const getStatusBadge = (status: SignerStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'VIEWED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Viewed</Badge>;
      case 'SIGNED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Signed</Badge>;
      case 'DECLINED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Signers</h3>
      {signers.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No signers added yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              {signers.some(s => s.order) && <TableHead>Order</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Signed At</TableHead>
              {isDocumentAuthor && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {signers.map((signer) => (
              <TableRow key={signer.id}>
                <TableCell>{signer.name}</TableCell>
                <TableCell>{signer.email}</TableCell>
                {signers.some(s => s.order) && (
                  <TableCell>{signer.order || '-'}</TableCell>
                )}
                <TableCell>{getStatusBadge(signer.status)}</TableCell>
                <TableCell>
                  {signer.signedAt 
                    ? new Date(signer.signedAt).toLocaleString() 
                    : '-'}
                </TableCell>
                {isDocumentAuthor && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {signer.status !== 'SIGNED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(signer.id)}
                          disabled={isLoading[signer.id]}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveSigner(signer.id)}
                        disabled={isLoading[signer.id] || signer.status === 'SIGNED'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

// src/components/dashboard/document-sharing.tsx
import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../ui/tabs';
import { toast } from 'react-hot-toast';
import { SignerInvitationForm } from './signer-invitation-form';
import { SignerList } from './signer-list';
import { Copy, Link2, Mail } from 'lucide-react';

interface DocumentSigner {
  id: string;
  name: string;
  email: string;
  status: 'PENDING' | 'VIEWED' | 'SIGNED' | 'DECLINED';
  order?: number;
  signedAt?: string;
}

interface DocumentSharingProps {
  documentId: string;
  documentName: string;
  signers: DocumentSigner[];
  isAuthor: boolean;
  onSignersUpdated: () => void;
}

export function DocumentSharing({
  documentId,
  documentName,
  signers,
  isAuthor,
  onSignersUpdated,
}: DocumentSharingProps) {
  const [activeTab, setActiveTab] = useState('signers');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [sharingLink, setSharingLink] = useState('');

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate sharing link');
      }
      
      const data = await response.json();
      setSharingLink(data.url);
    } catch (error) {
      console.error('Error generating sharing link:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate sharing link');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharingLink);
      setIsCopied(true);
      toast.success('Link copied to clipboard');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Share Document</h2>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="signers">
            <Mail className="h-4 w-4 mr-2" />
            Invite Signers
          </TabsTrigger>
          <TabsTrigger value="link">
            <Link2 className="h-4 w-4 mr-2" />
            Sharing Link
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signers" className="space-y-6">
          <SignerList 
            documentId={documentId}
            signers={signers}
            onSignersUpdated={onSignersUpdated}
            isDocumentAuthor={isAuthor}
          />
          
          {isAuthor && (
            <SignerInvitationForm
              documentId={documentId}
              existingSigners={signers}
              onInviteSuccess={onSignersUpdated}
            />
          )}
        </TabsContent>
        
        <TabsContent value="link" className="space-y-4">
          <p className="text-gray-600">
            Generate a secure link that can be shared with anyone who needs to sign this document.
          </p>
          
          {!sharingLink ? (
            <Button 
              onClick={handleGenerateLink} 
              disabled={isGeneratingLink}
            >
              {isGeneratingLink ? 'Generating...' : 'Generate Sharing Link'}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Input 
                value={sharingLink} 
                readOnly 
                className="flex-1"
              />
              <Button 
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-1" />
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            <p>Security note: This link will allow anyone with access to view and sign the document.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}