// src/lib/signing-workflow.ts
import { db } from './db/client';
import { sendSigningInvitation, sendDocumentCompletedNotification } from './email';

interface SigningWorkflowOptions {
  documentId: string;
  baseUrl: string;
}

/**
 * Manages the sequential signing workflow for a document
 */
export class SigningWorkflow {
  private documentId: string;
  private baseUrl: string;

  constructor({ documentId, baseUrl }: SigningWorkflowOptions) {
    this.documentId = documentId;
    this.baseUrl = baseUrl;
  }

  /**
   * Get the status of the document's signing workflow
   */
  async getStatus() {
    // Get document with all signers
    const document = await db.document.findUnique({
      where: { id: this.documentId },
      include: {
        documentSigners: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' }
          ]
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Check if the document has order-based signers
    const hasOrderedSigners = document.documentSigners.some(signer => signer.order !== null);
    
    // If there are no order-based signers, all signers can sign in parallel
    if (!hasOrderedSigners) {
      return {
        document,
        isComplete: document.documentSigners.every(signer => signer.status === 'SIGNED'),
        currentSigners: document.documentSigners
      };
    }

    // Get pending signers (ordered by their specified order)
    const pendingSigners = document.documentSigners.filter(
      signer => signer.status !== 'SIGNED'
    );

    // Get completed signers
    const completedSigners = document.documentSigners.filter(
      signer => signer.status === 'SIGNED'
    );

    // Check if all signers have completed
    const isComplete = pendingSigners.length === 0;

    // Get current active signers (the ones with the lowest order that haven't signed yet)
    let currentSigners: typeof document.documentSigners = [];
    
    if (pendingSigners.length > 0) {
      const lowestOrder = pendingSigners[0].order || 1;
      currentSigners = pendingSigners.filter(signer => (signer.order || 1) === lowestOrder);
    }

    return {
      document,
      isComplete,
      pendingSigners,
      completedSigners,
      currentSigners,
    };
  }

  /**
   * Start the signing workflow by sending invitations to the first signers
   */
  async start(customMessage?: string) {
    const { document, currentSigners } = await this.getStatus();
    
    if (!currentSigners || currentSigners.length === 0) {
      throw new Error('No signers found for this document');
    }

    // Generate signing links and send invitations to current signers
    for (const signer of currentSigners) {
      await this.sendInvitation(signer.id, customMessage);
    }

    // Update document status to PENDING
    await db.document.update({
      where: { id: this.documentId },
      data: { status: 'PENDING' }
    });

    // Record this action
    await db.documentActivity.create({
      data: {
        documentId: this.documentId,
        action: 'WORKFLOW_STARTED',
        details: 'Signing workflow started',
        userId: document.userId
      }
    });

    return { success: true };
  }

  /**
   * Progresses the workflow when a signer completes their signature
   */
  async progressWorkflow(signerId: string) {
    const { document, isComplete } = await this.getStatus();
    
    // Update the specific signer's status
    await db.documentSigner.update({
      where: { id: signerId },
      data: {
        status: 'SIGNED',
        signedAt: new Date()
      }
    });

    // Record this signature event
    await db.documentActivity.create({
      data: {
        documentId: this.documentId,
        action: 'DOCUMENT_SIGNED',
        details: `Document signed by a participant`,
        userId: null // No user ID if signed externally
      }
    });

    // Refresh workflow status after the update
    const newStatus = await this.getStatus();
    
    // If the document is now complete, update its status and notify the owner
    if (newStatus.isComplete) {
      await this.completeDocument();
      return { success: true, status: 'COMPLETED' };
    }
    
    // If there are new signers to notify, send them invitations
    if (newStatus.currentSigners && newStatus.currentSigners.length > 0) {
      for (const signer of newStatus.currentSigners) {
        await this.sendInvitation(signer.id);
      }
      return { success: true, status: 'PROGRESSED' };
    }

    return { success: true, status: 'WAITING' };
  }

  /**
   * Send an invitation to a specific signer
   */
  async sendInvitation(signerId: string, customMessage?: string) {
    const { document } = await this.getStatus();
    
    const signer = await db.documentSigner.findUnique({
      where: { id: signerId }
    });
    
    if (!signer) {
      throw new Error('Signer not found');
    }

    // Create or retrieve a signing link
    const shareLink = await db.documentShareLink.upsert({
      where: {
        documentId_signerId: {
          documentId: this.documentId,
          signerId: signerId
        }
      },
      update: {
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      create: {
        documentId: this.documentId,
        signerId: signerId,
        token: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    // Construct signing link
    const signingLink = `${this.baseUrl}/documents/${this.documentId}/sign?token=${shareLink.token}`;

    // Send invitation email
    await sendSigningInvitation({
      documentId: this.documentId,
      documentTitle: document.title,
      signerName: signer.name || 'Signer',
      signerEmail: signer.email,
      senderName: document.user.name || 'Document owner',
      message: customMessage,
      signingLink
    });

    // Record this action
    await db.documentActivity.create({
      data: {
        documentId: this.documentId,
        action: 'INVITATION_SENT',
        details: `Invitation sent to ${signer.name || 'Signer'} (${signer.email})`,
        userId: document.userId
      }
    });

    return { success: true };
  }

  /**
   * Mark the document as complete and notify all participants
   */
  async completeDocument() {
    const { document } = await this.getStatus();

    // Update document status
    await db.document.update({
      where: { id: this.documentId },
      data: { status: 'COMPLETED' }
    });

    // Generate download link
    const downloadLink = `${this.baseUrl}/documents/${this.documentId}`;

    // Notify document owner
    await sendDocumentCompletedNotification({
      documentId: this.documentId,
      documentTitle: document.title,
      recipientName: document.user.name || 'Document owner',
      recipientEmail: document.user.email,
      downloadLink
    });

    // Notify all signers
    for (const signer of document.documentSigners) {
      await sendDocumentCompletedNotification({
        documentId: this.documentId,
        documentTitle: document.title,
        recipientName: signer.name || 'Signer',
        recipientEmail: signer.email,
        downloadLink
      });
    }

    // Record this action
    await db.documentActivity.create({
      data: {
        documentId: this.documentId,
        action: 'DOCUMENT_COMPLETED',
        details: 'All signers have signed the document',
        userId: document.userId
      }
    });

    return { success: true };
  }
}

// Helper function to create a new workflow instance
export function createSigningWorkflow(documentId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return new SigningWorkflow({ documentId, baseUrl });
}