import { JobApplication } from "../types";

const STORAGE_KEY = 'careerflow_jobs_v1';

export const getJobs = (): JobApplication[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse jobs", e);
    return [];
  }
};

export const saveJob = (job: JobApplication): JobApplication[] => {
  const jobs = getJobs();
  // Check if update or create
  const index = jobs.findIndex(j => j.id === job.id);
  let newJobs;
  if (index >= 0) {
    newJobs = [...jobs];
    newJobs[index] = job;
  } else {
    newJobs = [job, ...jobs];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
  return newJobs;
};

export const deleteJob = (id: string): JobApplication[] => {
  const jobs = getJobs();
  const newJobs = jobs.filter(j => j.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
  return newJobs;
};