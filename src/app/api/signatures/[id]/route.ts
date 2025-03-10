import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to delete signatures" },
        { status: 401 }
      );
    }

    const signatureId = params.id;

    // First check if the signature exists and belongs to the user
    const signature = await prisma.signature.findUnique({
      where: {
        id: signatureId,
      },
    });

    if (!signature) {
      return NextResponse.json(
        { error: "Signature not found" },
        { status: 404 }
      );
    }

    if (signature.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this signature" },
        { status: 403 }
      );
    }

    // Delete the signature
    await prisma.signature.delete({
      where: {
        id: signatureId,
      },
    });

    // If this was the default signature and there are other signatures,
    // set another one as default
    if (signature.isDefault) {
      const anotherSignature = await prisma.signature.findFirst({
        where: {
          userId: session.user.id,
        },
      });

      if (anotherSignature) {
        await prisma.signature.update({
          where: {
            id: anotherSignature.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting signature:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the signature" },
      { status: 500 }
    );
  }
}