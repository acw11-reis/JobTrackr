import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { JobForm } from './components/JobForm';
import { JobDetail } from './components/JobDetail';
import { JobApplication } from './types';
import { getJobs, saveJob } from './services/storage';

// Simple view-based routing
type ViewState = 'dashboard' | 'add' | 'detail';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Initial load
  useEffect(() => {
    setJobs(getJobs());
  }, []);

  const handleNavigate = (targetView: ViewState, id?: string) => {
    if (targetView === 'detail' && id) {
      setSelectedJobId(id);
    }
    setView(targetView);
    // Optional: Reset selected ID if going back to dashboard
    if (targetView === 'dashboard') setSelectedJobId(undefined);
  };

  const handleSaveJob = (job: JobApplication) => {
    const updatedList = saveJob(job);
    setJobs(updatedList);
    handleNavigate('dashboard');
  };

  const handleUpdateJob = (job: JobApplication) => {
     const updatedList = saveJob(job);
     setJobs(updatedList);
     // Stay on detail view, just update local list state
  };

  // Determine current content
  let content;
  
  if (view === 'add') {
    content = (
      <JobForm 
        onSave={handleSaveJob} 
        onBack={() => handleNavigate('dashboard')} 
      />
    );
  } else if (view === 'detail' && selectedJobId) {
    const job = jobs.find(j => j.id === selectedJobId);
    if (job) {
      content = (
        <JobDetail 
          job={job} 
          onUpdate={handleUpdateJob}
          onBack={() => handleNavigate('dashboard')} 
        />
      );
    } else {
       // Fallback if ID invalid
       content = <div className="p-10 text-center">Job not found. <button onClick={() => handleNavigate('dashboard')} className="text-blue-500 underline">Go Home</button></div>;
    }
  } else {
    content = (
      <Dashboard 
        jobs={jobs} 
        onNavigate={(v, id) => handleNavigate(v as ViewState, id)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
       {/* Decorative Header Bar */}
       <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full sticky top-0 z-50" />
       
       <main className="container mx-auto py-4 sm:py-8">
          {content}
       </main>
    </div>
  );
};

export default App;