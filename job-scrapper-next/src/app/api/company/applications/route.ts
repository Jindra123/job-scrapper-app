import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Ensure only authenticated companies can view applications
  if (!token || token.type !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = token.id as string;
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  // Validate jobId format if present
  if (jobId && !/^[0-9a-fA-F]{24}$/.test(jobId)) {
    return NextResponse.json({ error: "Invalid Job ID format" }, { status: 400 });
  }

  try {
    // Construct the where clause for applications
    const applicationWhereClause: any = {};
    
    // If a specific jobId is provided, ensure it belongs to the current company
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { creatorId: true },
      });

      if (!job || job.creatorId !== companyId) {
        return NextResponse.json(
          { error: "Forbidden: Job not found or does not belong to your company." },
          { status: 403 },
        );
      }
      applicationWhereClause.jobId = jobId;
    } else {
      // If no specific jobId, fetch all jobs created by this company
      const jobs = await prisma.job.findMany({
        where: { creatorId: companyId },
        select: { id: true },
      });
      const jobIds = jobs.map((job) => job.id);
      applicationWhereClause.jobId = { in: jobIds };
    }
    
    const applications = await prisma.application.findMany({
      where: applicationWhereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            resumeUrl: true,
            linkedinUrl: true,
            githubUrl: true,
            websiteUrl: true,
            summary: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    if (applications.length === 0 && !jobId) {
      return NextResponse.json(
        { message: "No applications received for your jobs yet." },
        { status: 200 },
      );
    } else if (applications.length === 0 && jobId) {
      return NextResponse.json(
        { message: `No applications received for job ID: ${jobId}.` },
        { status: 200 },
      );
    }

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
