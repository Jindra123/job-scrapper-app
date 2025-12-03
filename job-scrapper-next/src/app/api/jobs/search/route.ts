import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

type JobWhereClause = Prisma.JobWhereInput;

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { query, source, location, employmentType, remote, experienceLevel } = await req.json();

  try {
    const whereClause: JobWhereClause = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { creator: { name: { contains: query, mode: "insensitive" } } },
        { location: { contains: query, mode: "insensitive" } },
      ],
    };

    if (source !== "all") {
      whereClause.source = source; // Filter by source if not "all"
    }

    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    if (employmentType) {
      whereClause.employmentType = employmentType;
    }

    if (typeof remote === "boolean") { // Ensure remote is explicitly true or false
      whereClause.remote = remote;
    }

    if (experienceLevel) {
      whereClause.experience = experienceLevel;
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        creator: true, // Include company information
      },
      //take: 100, // Limit results
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: "Failed to search jobs" },
      { status: 500 },
    );
  }
}
