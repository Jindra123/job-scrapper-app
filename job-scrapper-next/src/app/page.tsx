"use client";

import JobListingCard from "@/components/JobListingCard";
import Footer from "@/components/Footer";
import Searchbar from "@/components/Searchbar";

export default function Home() {
  return (
    <div className="grid grid-rows-[10px_1fr_10px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Searchbar />
        <JobListingCard />
      </main>
      <Footer />
    </div>
  );
}
