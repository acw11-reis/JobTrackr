export enum JobStatus {
  APPLIED = 'Applied',
  INTERVIEWING = 'Interviewing',
  OFFER = 'Offer',
  REJECTED = 'Rejected'
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  dateApplied: string; // ISO string
  requirements: string;
  status: JobStatus;
  notes?: string;
}

export interface InterviewPrepResponse {
  technicalQuestions: string[];
  behavioralQuestions: string[];
  tips: string[];
}