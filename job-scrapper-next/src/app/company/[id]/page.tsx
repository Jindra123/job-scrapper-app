import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobListingCard from "@/components/JobListingCard";

const prisma = new PrismaClient();

interface CompanyDetailPageProps {
  params: { id: string };
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: { jobs: true }, // Include jobs posted by this company
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors duration-300"
          >
            ← Back to Jobs
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 dark:bg-gray-800">
          <Image
            src={company.logoUrl || "/placeholder-logo.svg"}
            alt={`${company.name} logo`}
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-text dark:text-white">{company.name}</h1>
            <p className="text-text-light dark:text-gray-300 text-lg mt-1">
              {company.email} {company.ico && `• ICO: ${company.ico}`}
            </p>
          </div>
        </div>

        <section className="bg-white shadow-md rounded-lg p-6 mt-8 dark:bg-gray-800">
          <h2 className="text-3xl font-semibold text-text dark:text-white mb-4">
            About {company.name}
          </h2>
          <p className="text-text-light dark:text-gray-300 leading-relaxed">
            {company.about || "No description provided."}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-3xl font-semibold text-text dark:text-white mb-6 text-center">
            Open Positions at {company.name}
          </h2>
          {company.jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-4">
              {company.jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                  <JobListingCard
                    company={company.name}
                    location={job.location}
                    title={job.title}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white shadow-md rounded-lg p-8 dark:bg-gray-800">
              <p className="text-text-light dark:text-gray-300">
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

export async function generateMetadata({ params }: CompanyDetailPageProps) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
  });
  return {
    title: company?.name || "Company Profile",
    description: `Learn more about ${company?.name || "the company"} and view their open job positions.`,
  };
}

