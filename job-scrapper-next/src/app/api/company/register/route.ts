import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, name, ico } = await req.json();

  if (!email || !password || !name || !ico) {
    return NextResponse.json(
      { error: "Email, password, company name, and IČO are required" },
      { status: 400 },
    );
  }

  const existingCompany = await prisma.company.findUnique({ where: { email } });
  if (existingCompany) {
    return NextResponse.json(
      { error: "Company already exists" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const company = await prisma.company.create({
    data: {
      email,
      password: hashedPassword,
      name,
      ico,
    },
  });

  return NextResponse.json({
    message: "Company registered successfully",
    company: company,
  });
}
