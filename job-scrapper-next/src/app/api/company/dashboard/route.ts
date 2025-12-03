import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token || token.type !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = token.id as string;

  try {
    // 1. Fetch all jobs for the company
    const jobs = await prisma.job.findMany({
      where: {
        creatorId: companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2. For each job, get the application count
    const jobIds = jobs.map((job) => job.id);

    const applicationCounts = await prisma.application.groupBy({
      by: ["jobId"],
      where: {
        jobId: {
          in: jobIds,
        },
      },
      _count: {
        id: true,
      },
    });

    // 3. Create a map for easy lookup
    const countsMap = new Map<string, number>();
    applicationCounts.forEach((count) => {
      countsMap.set(count.jobId, count._count.id);
    });

    // 4. Combine job data with application counts
    const dashboardJobs = jobs.map((job) => ({
      ...job,
      applicationCount: countsMap.get(job.id) || 0,
    }));

    return NextResponse.json({ jobs: dashboardJobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
