export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  bonuses?: string;
  benefits?: string;
}
