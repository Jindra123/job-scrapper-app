import { NextResponse } from "next/server";
import { PrismaClient, JobStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token || token.type !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobId = params.id;
  const companyId = token.id as string;

  if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
    return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
  }

  try {
    // Verify ownership of the job
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

    // Determine the new status
    const newStatus = job.status === "CLOSED" ? "ACTIVE" : "CLOSED";

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus },
    });

    return NextResponse.json(
      { message: "Job status updated successfully", job: updatedJob },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      { error: "Failed to update job status" },
      { status: 500 },
    );
  }
}
