// src/app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to access this document" },
        { status: 401 }
      );
    }

    const documentId = params.id;

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        documentSigners: true,
        documentFields: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if user owns the document or is a signer
    const isOwner = document.userId === session.user.id;
    const isSigner = document.documentSigners.some(
      (signer) => signer.email === session.user.email
    );

    if (!isOwner && !isSigner) {
      return NextResponse.json(
        { error: "You don't have permission to access this document" },
        { status: 403 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the document" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to update this document" },
        { status: 401 }
      );
    }

    const documentId = params.id;
    const body = await req.json();

    // First check if user owns the document
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this document" },
        { status: 403 }
      );
    }

    // Update the document
    const updatedDocument = await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to delete this document" },
        { status: 401 }
      );
    }

    const documentId = params.id;

    // First check if user owns the document
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this document" },
        { status: 403 }
      );
    }

    // Delete the document and all related records
    await prisma.$transaction([
      prisma.documentField.deleteMany({
        where: { documentId },
      }),
      prisma.documentSigner.deleteMany({
        where: { documentId },
      }),
      prisma.documentActivity.deleteMany({
        where: { documentId },
      }),
      prisma.document.delete({
        where: { id: documentId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the document" },
      { status: 500 }
    );
  }
}