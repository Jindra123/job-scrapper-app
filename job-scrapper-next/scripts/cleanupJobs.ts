// scripts/cleanupJobs.ts
import { PrismaClient, EmploymentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting job cleanup (v3: cascading delete)...");

  const validEmploymentTypes = Object.values(EmploymentType);
  console.log("Valid employment types:", validEmploymentTypes);

  // 1. Find the invalid jobs using a raw query
  const aggregationResult: any = await prisma.job.aggregateRaw({
    pipeline: [
      {
        $match: {
          employmentType: {
            $nin: validEmploymentTypes
          }
        }
      },
      {
        $project: {
          _id: 1,
          employmentType: 1
        }
      }
    ]
  });

  const jobsToDelete = aggregationResult as any[];

  if (jobsToDelete.length === 0) {
    console.log("No invalid jobs found. Database is clean.");
    return;
  }

  console.log(`Found ${jobsToDelete.length} jobs with invalid employment types:`);
  console.log(jobsToDelete);

  const idsToDelete = jobsToDelete.map(job => job._id.$oid);

  // 2. Delete all applications that are linked to the invalid jobs
  console.log(`Deleting applications linked to ${idsToDelete.length} invalid job(s)...`);
  const applicationDeleteResult = await prisma.application.deleteMany({
    where: {
      jobId: {
        in: idsToDelete,
      },
    },
  });
  console.log(`Successfully deleted ${applicationDeleteResult.count} related application(s).`);

  // 3. Now, delete the invalid jobs themselves
  console.log(`Deleting ${idsToDelete.length} invalid job(s)...`);
  const jobDeleteResult = await prisma.job.deleteMany({
    where: {
      id: {
        in: idsToDelete,
      },
    },
  });

  console.log(`Successfully deleted ${jobDeleteResult.count} invalid job(s).`);
}

main()
  .catch((e) => {
    console.error("An error occurred during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
