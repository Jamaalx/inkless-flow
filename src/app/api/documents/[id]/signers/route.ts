// src/app/api/documents/[id]/signers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { z } from 'zod';

// Validation schema for adding a signer
const signerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  order: z.number().min(1).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const documentId = params.id;
    
    // Get the document to verify ownership or permission
    const document = await db.document.findUnique({
      where: { 
        id: documentId,
      },
      include: {
        documentSigners: true,
      },
    });
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the document author or a signer
    const isAuthor = document.userId === session.user.id;
    const isSigner = document.documentSigners.some(
      signer => signer.email === session.user.email
    );
    
    if (!isAuthor && !isSigner) {
      return NextResponse.json(
        { error: 'Not authorized to access this document' },
        { status: 403 }
      );
    }
    
    // Return the signers
    return NextResponse.json({ 
      signers: document.documentSigners 
    });
  } catch (error) {
    console.error('Error getting signers:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve signers' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const documentId = params.id;
    const body = await req.json();
    
    // Validate request body
    const validationResult = signerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, order } = validationResult.data;
    
    // Check document ownership
    const document = await db.document.findUnique({
      where: { 
        id: documentId,
        userId: session.user.id,
      },
    });
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or you do not have permission to add signers' },
        { status: 404 }
      );
    }
    
    // Check if signer already exists
    const existingSigner = await db.documentSigner.findFirst({
      where: {
        documentId,
        email,
      },
    });
    
    if (existingSigner) {
      return NextResponse.json(
        { error: 'Signer with this email already exists for this document' },
        { status: 409 }
      );
    }
    
    // Create the signer
    const signer = await db.documentSigner.create({
      data: {
        name,
        email,
        order,
        status: 'PENDING',
        documentId,
      },
    });
    
    // Log the activity
    await db.documentActivity.create({
      data: {
        documentId,
        action: 'SIGNER_ADDED',
        details: `Added ${name} (${email}) as a signer`,
        userId: session.user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });
    
    // Here we would typically send an email invitation
    // Placeholder for email sending logic
    
    return NextResponse.json({ signer });
  } catch (error) {
    console.error('Error adding signer:', error);
    return NextResponse.json(
      { error: 'Failed to add signer' },
      { status: 500 }
    );
  }
}

// src/app/api/documents/[id]/signers/[signerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; signerId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: documentId, signerId } = params;
    
    // Check document ownership
    const document = await db.document.findUnique({
      where: { 
        id: documentId,
        userId: session.user.id,
      },
    });
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or you do not have permission' },
        { status: 404 }
      );
    }
    
    // Check if signer exists
    const signer = await db.documentSigner.findUnique({
      where: {
        id: signerId,
        documentId,
      },
    });
    
    if (!signer) {
      return NextResponse.json(
        { error: 'Signer not found' },
        { status: 404 }
      );
    }
    
    // Prevent removal of signers who have already signed
    if (signer.status === 'SIGNED') {
      return NextResponse.json(
        { error: 'Cannot remove a signer who has already signed the document' },
        { status: 400 }
      );
    }
    
    // Delete the signer
    await db.documentSigner.delete({
      where: {
        id: signerId,
      },
    });
    
    // Log the activity
    await db.documentActivity.create({
      data: {
        documentId,
        action: 'SIGNER_REMOVED',
        details: `Removed ${signer.name} (${signer.email}) as a signer`,
        userId: session.user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing signer:', error);
    return NextResponse.json(
      { error: 'Failed to remove signer' },
      { status: 500 }
    );
  }
}

// src/app/api/documents/[id]/signers/[signerId]/remind/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
// import { sendSigningReminder } from '@/lib/email'; // Email service to be implemented

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; signerId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: documentId, signerId } = params;
    
    // Check document ownership
    const document = await db.document.findUnique({
      where: { 
        id: documentId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or you do not have permission' },
        { status: 404 }
      );
    }
    
    // Check if signer exists
    const signer = await db.documentSigner.findUnique({
      where: {
        id: signerId,
        documentId,
      },
    });
    
    if (!signer) {
      return NextResponse.json(
        { error: 'Signer not found' },
        { status: 404 }
      );
    }
    
    // Don't send reminders to signers who have already signed
    if (signer.status === 'SIGNED') {
      return NextResponse.json(
        { error: 'Signer has already signed the document' },
        { status: 400 }
      );
    }
    
    // Here we would typically send an email reminder
    // Placeholder for email sending logic
    /*
    await sendSigningReminder({
      documentId,
      documentTitle: document.title,
      signerName: signer.name,
      signerEmail: signer.email,
      senderName: document.user.name || 'Document owner',
      senderEmail: document.user.email,
    });
    */
    
    // Log the activity
    await db.documentActivity.create({
      data: {
        documentId,
        action: 'REMINDER_SENT',
        details: `Sent reminder to ${signer.name} (${signer.email})`,
        userId: session.user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}

// src/app/api/documents/[id]/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { randomUUID } from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const documentId = params.id;
    
    // Check document ownership
    const document = await db.document.findUnique({
      where: { 
        id: documentId,
        userId: session.user.id,
      },
    });
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or you do not have permission' },
        { status: 404 }
      );
    }
    
    // Check if a sharing link already exists
    const existingLink = await db.documentShareLink.findFirst({
      where: {
        documentId,
      },
    });
    
    let shareLink;
    
    if (existingLink) {
      // Use the existing link
      shareLink = existingLink;
    } else {
      // Create a new sharing link
      const token = randomUUID();
      shareLink = await db.documentShareLink.create({
        data: {
          documentId,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });
    }
    
    // Log the activity
    await db.documentActivity.create({
      data: {
        documentId,
        action: 'SHARE_LINK_GENERATED',
        details: 'Generated document sharing link',
        userId: session.user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });
    
    // Construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/documents/${documentId}/sign?token=${shareLink.token}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating sharing link:', error);
    return NextResponse.json(
      { error: 'Failed to generate sharing link' },
      { status: 500 }
    );
  }
}