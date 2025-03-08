import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { query, source } = await req.json();

  try {
    const whereClause: any = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
      ],
    };

    if (source !== "all") {
      whereClause.source = source; // Filter by source if not "all"
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
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
