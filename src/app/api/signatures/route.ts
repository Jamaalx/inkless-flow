import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to access signatures" },
        { status: 401 }
      );
    }

    const signatures = await prisma.signature.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(signatures);
  } catch (error) {
    console.error("Error fetching signatures:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching signatures" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to create a signature" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageUrl, isDefault } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Signature image is required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would upload the image to a storage service
    // and store the URL and key. For simplicity, we'll store the data URL directly.
    const fileKey = `signatures/${Date.now()}-${session.user.id}`;

    // If this is set as default, we need to update all other signatures
    if (isDefault) {
      await prisma.signature.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const signature = await prisma.signature.create({
      data: {
        imageUrl,
        imageKey: fileKey,
        isDefault: isDefault || false,
        userId: session.user.id,
      },
    });

    return NextResponse.json(signature, { status: 201 });
  } catch (error) {
    console.error("Error creating signature:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the signature" },
      { status: 500 }
    );
  }
}