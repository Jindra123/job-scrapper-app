"use server";

export async function scrapeJobs(query: { name: string }) {
  const response = await fetch("http://localhost:3000/api/scraper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  return await response.json();
}

export async function getJobs(query: { name: string }) {
  const response = await fetch("http://localhost:3000/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  return await response.json();
}
