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
    employmentType,
    remote,
    bonuses,
    benefits,
    url, // Add url to body destructuring
    skills, // Add skills to body destructuring
    postedDate, // Add postedDate
    expiresDate, // Add expiresDate
    source, // Add source
    category, // Add category
    experience, // Add experience
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
        remote,
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
  } catch {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
