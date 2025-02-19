import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Changed to POST
  try {
    const { search } = await req.json(); // Get search from request body

    let whereClause: any = {};

    if (search) {
      whereClause = {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch jobs" }), {
      status: 500,
    });
  }
}
