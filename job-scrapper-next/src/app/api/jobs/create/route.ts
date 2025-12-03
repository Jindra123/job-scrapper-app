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
    location,
    description,
    salaryMin,
    salaryMax,
    employmentType, // Will be an Enum value
    remoteStatus, // Renamed from 'remote'
    sponsorshipAvailable, // New field
    bonuses,
    benefits,
    url,
    skills,
    postedDate,
    expiresDate,
    source,
    category,
    experience, // Will be an Enum value
  } = body;

  if (!title || !location) {
    return NextResponse.json(
      { error: "Title and location are required" },
      { status: 400 },
    );
  }

  try {
    const job = await prisma.job.create({
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
        creatorId: token.id as string,
        url,
        skills,
        postedDate,
        expiresDate,
        source,
        category,
        experience,
      },
    });

    return NextResponse.json({ message: "Job created successfully", job });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
