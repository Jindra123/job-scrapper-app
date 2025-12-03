import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// GET user profile
export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

// UPDATE user profile
export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.formData();
    const file: File | null = data.get("resume") as unknown as File;

    const updatedData: { [key: string]: any } = {
      name: data.get("name"),
      summary: data.get("summary"),
      linkedinUrl: data.get("linkedinUrl"),
      githubUrl: data.get("githubUrl"),
      websiteUrl: data.get("websiteUrl"),
    };

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads/resumes");
      const filePath = path.join(uploadsDir, filename);

      // Ensure the directory exists
      await require("fs").promises.mkdir(uploadsDir, { recursive: true });

      // Write the file to the local filesystem
      await writeFile(filePath, buffer);
      updatedData.resumeUrl = `/uploads/resumes/${filename}`; // URL path to the saved file
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updatedData,
    });

    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
