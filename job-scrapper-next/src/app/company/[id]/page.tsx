import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobListingCard from "@/components/JobListingCard";
import React from "react"; // Import React to use React.use

const prisma = new PrismaClient();

interface CompanyDetailPageProps {
  params: { id: string };
}

export default async function CompanyDetailPage({
  params: paramsPromise, // Rename params to paramsPromise
}: CompanyDetailPageProps) {
  const params = await React.use(paramsPromise); // Unwrap params
  
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: { jobs: true }, // Include jobs posted by this company
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-pink-500 hover:text-pink-400 transition-colors duration-300"
          >
            ← Back to Jobs
          </Link>
        </div>

        <div className="bg-transparent shadow-2xl rounded-lg overflow-hidden mt-10 p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <Image
            src={company.logoUrl || "/placeholder-logo.svg"}
            alt={`${company.name} logo`}
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-pink-500"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-pink-500">{company.name}</h1>
            <p className="text-gray-400 text-lg mt-1">
              {company.email} {company.ico && `• ICO: ${company.ico}`}
            </p>
          </div>
        </div>

        <section className="bg-transparent shadow-2xl rounded-lg p-6 mt-8">
          <h2 className="text-3xl font-semibold text-pink-500 mb-4">
            About {company.name}
          </h2>
          <p className="text-gray-400 leading-relaxed">
            {/* Placeholder description. You can add a description field to your Company model */}
            A brief introduction to the company and its mission. This section can be populated with data from your database.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-3xl font-semibold text-pink-500 mb-6 text-center">
            Open Positions at {company.name}
          </h2>
          {company.jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-4">
              {company.jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block transform transition-transform duration-300 hover:scale-105">
                  <JobListingCard
                    company={company.name}
                    location={job.location}
                    title={job.title}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center bg-transparent shadow-2xl rounded-lg p-8">
              <p className="text-gray-400">
                {company.name} has no open positions at the moment.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params: paramsPromise }: CompanyDetailPageProps) {
  const params = await React.use(paramsPromise); // Unwrap params
  const company = await prisma.company.findUnique({
    where: { id: params.id },
  });
  return {
    title: company?.name || "Company Profile",
    description: `Learn more about ${company?.name || "the company"} and view their open job positions.`,
  };
}

