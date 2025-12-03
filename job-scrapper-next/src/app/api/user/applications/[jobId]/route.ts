import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } },
) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Ensure only authenticated users can check their application status
  if (!token || token.type !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.id as string;
  const jobId = params.jobId;

  // Validate jobId format
  if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
    return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: userId,
          jobId: jobId,
        },
      },
    });

    return NextResponse.json({ applied: !!application }, { status: 200 });
  } catch (error) {
    console.error("Error checking application status:", error);
    return NextResponse.json(
      { error: "Failed to check application status" },
      { status: 500 },
    );
  }
}
