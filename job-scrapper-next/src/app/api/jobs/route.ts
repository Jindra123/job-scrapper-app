import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    console.log("search", name);

    let whereClause: any = {};

    if (name) {
      whereClause = {
        title: {
          contains: name,
          mode: "insensitive",
        },
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
