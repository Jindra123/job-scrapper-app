import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

type JobWhereClause = Prisma.JobWhereInput;

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { 
    query, 
    source, 
    location, 
    employmentType, 
    remoteStatus, 
    experienceLevel,
    salaryMin,
    salaryMax,
    datePosted,
    industry,
    sortBy,
    page = 1, // Default to page 1
    pageSize = 10, // Default to 10 items per page
  } = await req.json();

  try {
    const whereClause: JobWhereClause = {};

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { creator: { name: { contains: query, mode: "insensitive" } } },
        { location: { contains: query, mode: "insensitive" } },
        { skills: { has: query } }
      ];
    }

    if (source && source !== "all") {
      whereClause.source = source;
    }

    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    if (employmentType) {
      whereClause.employmentType = employmentType;
    }

    if (remoteStatus) {
      whereClause.remoteStatus = remoteStatus;
    }

    if (experienceLevel) {
      whereClause.experience = experienceLevel;
    }

    if (salaryMin) {
      whereClause.salaryMin = { gte: parseFloat(salaryMin) };
    }

    if (salaryMax) {
      whereClause.salaryMax = { lte: parseFloat(salaryMax) };
    }

    if (datePosted) {
      const now = new Date();
      let dateFilter: Date;
      if (datePosted === "24h") {
        dateFilter = new Date(now.setDate(now.getDate() - 1));
      } else if (datePosted === "7d") {
        dateFilter = new Date(now.setDate(now.getDate() - 7));
      } else if (datePosted === "30d") {
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
      } else {
        dateFilter = new Date(0); // a long time ago
      }
      whereClause.createdAt = { gte: dateFilter };
    }

    if (industry) {
      whereClause.creator = { industry: { contains: industry, mode: "insensitive" } };
    }
    
    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortBy === 'salary') {
      orderBy = { salaryMax: 'desc' };
    }
    
    // Get total count of jobs that match the criteria
    const totalJobs = await prisma.job.count({ where: whereClause });

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        creator: true, // Include company information
      },
      orderBy,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalPages = Math.ceil(totalJobs / pageSize);

    return NextResponse.json({ 
      jobs,
      totalPages,
      currentPage: page,
      totalJobs,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: "Failed to search jobs" },
      { status: 500 },
    );
  }
}
