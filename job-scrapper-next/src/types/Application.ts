export interface User {
  id: string;
  name: string;
  email: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  summary?: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
}

export interface Application {
  id: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  user: User;
  job: Job;
}
