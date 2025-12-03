import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // 1. Authenticate and authorize the user
  if (!token || token.type !== "company") {
    return NextResponse.json(
      { error: "Unauthorized: Only companies can edit jobs." },
      { status: 401 },
    );
  }

  const jobId = params.id; // No await
  const companyId = token.id as string;

  // Validate jobId format
  if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
    return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
  }

  try {
    // 2. Verify ownership of the job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.creatorId !== companyId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this job." },
        { status: 403 },
      );
    }

    // 3. Get the updated data and update the job
    const body = await req.json();
    const {
      title,
      location,
      description,
      salaryMin,
      salaryMax,
      employmentType,
      remoteStatus,
      sponsorshipAvailable,
      bonuses,
      benefits,
      url,
      skills,
      postedDate,
      expiresDate,
      source,
      category,
      experience,
    } = body;

    if (!title || !location) {
      return NextResponse.json(
        { error: "Title and location are required" },
        { status: 400 },
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        location,
        description,
        salaryMin,
        salaryMax,
        employmentType,
        remoteStatus,
        sponsorshipAvailable,
        bonuses,
        benefits,
        url,
        skills,
        postedDate,
        expiresDate,
        source,
        category,
        experience,
      },
    });

    return NextResponse.json(
      { message: "Job updated successfully", job: updatedJob },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 },
    );
  }
}
