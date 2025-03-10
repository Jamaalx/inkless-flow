import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to sign documents" },
        { status: 401 }
      );
    }

    const documentId = params.id;
    const body = await req.json();
    const { fields } = body;

    if (!Array.isArray(fields)) {
      return NextResponse.json(
        { error: "Invalid field data" },
        { status: 400 }
      );
    }

    // Get the document to check permissions
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        documentSigners: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if user is either the owner or a signer
    const isOwner = document.userId === session.user.id;
    const isSigner = document.documentSigners.some(
      signer => signer.email === session.user.email
    );

    if (!isOwner && !isSigner) {
      return NextResponse.json(
        { error: "You don't have permission to sign this document" },
        { status: 403 }
      );
    }

    // Update each field
    const updatedFields = await Promise.all(
      fields.map(async (field: { id: string; value: string }) => {
        return prisma.documentField.update({
          where: {
            id: field.id,
          },
          data: {
            value: field.value,
          },
        });
      })
    );

    // If all required fields are filled in, update document status
    if (isOwner) {
      // If owner is signing, check if all required fields are filled
      const allRequiredFieldsFilled = await prisma.documentField.findMany({
        where: {
          documentId,
          required: true,
          value: null,
        },
      });

      if (allRequiredFieldsFilled.length === 0) {
        await prisma.document.update({
          where: {
            id: documentId,
          },
          data: {
            status: "COMPLETED",
          },
        });
      }
    } else {
      // If signer is signing, update their status
      const signerEmail = session.user.email;
      
      if (signerEmail) {
        await prisma.documentSigner.updateMany({
          where: {
            documentId,
            email: signerEmail,
          },
          data: {
            status: "SIGNED",
            signedAt: new Date(),
          },
        });
        
        // Check if all signers have signed
        const pendingSigners = await prisma.documentSigner.findMany({
          where: {
            documentId,
            status: {
              not: "SIGNED",
            },
          },
        });
        
        if (pendingSigners.length === 0) {
          await prisma.document.update({
            where: {
              id: documentId,
            },
            data: {
              status: "COMPLETED",
            },
          });
        }
      }
    }

    // Log the signing activity
    await prisma.documentActivity.create({
      data: {
        documentId,
        userId: session.user.id,
        action: "SIGNED",
        details: `Signed by ${session.user.email}`,
        ipAddress: req.headers.get("x-forwarded-for") || req.ip || "",
        userAgent: req.headers.get("user-agent") || "",
      },
    });

    return NextResponse.json({
      success: true,
      fields: updatedFields,
    });
  } catch (error) {
    console.error("Error signing document:", error);
    return NextResponse.json(
      { error: "An error occurred while signing the document" },
      { status: 500 }
    );
  }
}