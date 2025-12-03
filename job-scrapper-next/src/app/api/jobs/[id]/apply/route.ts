import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Ensure only authenticated users can apply
  if (!token || token.type !== "user") {
    return NextResponse.json(
      { error: "Unauthorized: Only users can apply for jobs" },
      { status: 401 },
    );
  }

  const jobId = params.id;
  const userId = token.id as string;

  // Validate jobId format
  if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
    return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
  }

  try {
    // Check if the user has already applied for this job
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: userId,
          jobId: jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 409 }, // Conflict
      );
    }

    // Fetch user's resumeUrl
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { resumeUrl: true },
    });

    if (!user || !user.resumeUrl) {
      return NextResponse.json(
        { error: "Resume not found. Please upload your resume in your profile." },
        { status: 400 },
      );
    }

    const application = await prisma.application.create({
      data: {
        userId: userId,
        jobId: jobId,
        resumeUrl: user.resumeUrl,
        status: "PENDING", // Default status
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
