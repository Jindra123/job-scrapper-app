import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token || token.type !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    company,
    location,
    description,
    salaryMin,
    salaryMax,
    employmentType,
    remote,
    bonuses,
    benefits,
  } = body;

  if (!title || !company || !location) {
    return NextResponse.json(
      { error: "Title, company, and location are required" },
      { status: 400 },
    );
  }

  try {
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        description,
        salaryMin,
        salaryMax,
        employmentType,
        remote,
        bonuses,
        benefits,
        creatorId: token.id as string,
        source: "website", // Explicitly set for website-created jobs
      },
    });

    return NextResponse.json({ message: "Job created successfully", job });
  } catch {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
