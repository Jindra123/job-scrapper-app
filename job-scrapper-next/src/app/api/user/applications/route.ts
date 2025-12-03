import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Ensure only authenticated users can fetch their applications
  if (!token || token.type !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.id as string;

  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: userId,
      },
      include: {
        job: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
