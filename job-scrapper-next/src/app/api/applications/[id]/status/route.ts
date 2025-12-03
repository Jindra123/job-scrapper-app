import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Ensure only authenticated companies can update application status
  if (!token || token.type !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = token.id as string;
  const { id: applicationId } = params;



  const body = await req.json();
  const { status } = body;

  // Validate new status
  if (!status || !Object.values(ApplicationStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // Find the application and include its associated job and job creator (company)
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            creatorId: true, // Only need creatorId to check ownership
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Verify that the company making the request owns the job associated with the application
    if (application.job.creatorId !== companyId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this application's job" },
        { status: 403 },
      );
    }

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status as ApplicationStatus },
    });

    return NextResponse.json(
      { message: "Application status updated", application: updatedApplication },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 },
    );
  }
}
