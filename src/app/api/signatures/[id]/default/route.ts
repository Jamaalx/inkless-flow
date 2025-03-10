import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to update signatures" },
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
        { error: "You don't have permission to update this signature" },
        { status: 403 }
      );
    }

    // Reset all other signatures to non-default
    await prisma.signature.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set this signature as default
    const updatedSignature = await prisma.signature.update({
      where: {
        id: signatureId,
      },
      data: {
        isDefault: true,
      },
    });

    return NextResponse.json(updatedSignature);
  } catch (error) {
    console.error("Error updating signature:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the signature" },
      { status: 500 }
    );
  }
}