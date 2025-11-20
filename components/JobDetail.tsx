import React, { useState, useEffect } from 'react';
import { JobApplication, JobStatus, InterviewPrepResponse } from '../types';
import { generateInterviewPrep } from '../services/geminiService';
import { ArrowLeft, MapPin, DollarSign, Calendar, BrainCircuit, Loader2, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

interface JobDetailProps {
  job: JobApplication;
  onUpdate: (job: JobApplication) => void;
  onBack: () => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job, onUpdate, onBack }) => {
  const [status, setStatus] = useState(job.status);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<InterviewPrepResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');

  // Sync local status if prop updates
  useEffect(() => {
    setStatus(job.status);
  }, [job.status]);

  const handleStatusChange = (newStatus: JobStatus) => {
    setStatus(newStatus);
    onUpdate({ ...job, status: newStatus });
  };

  const handleAiGenerate = async () => {
    setAiLoading(true);
    try {
      const data = await generateInterviewPrep(job);
      setAiData(data);
    } catch (err) {
      alert("Failed to generate insights. Please check your API key.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 mb-4 transition-colors shrink-0">
        <ArrowLeft size={18} className="mr-1" /> Back
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 shrink-0">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{job.position}</h1>
            <div className="text-xl text-slate-600 font-medium mt-1">{job.company}</div>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <MapPin size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <DollarSign size={14} /> {job.salary}
              </span>
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <Calendar size={14} /> Applied: {new Date(job.dateApplied).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Status</label>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                {[JobStatus.APPLIED, JobStatus.INTERVIEWING, JobStatus.OFFER, JobStatus.REJECTED].map((s) => {
                    const isActive = status === s;
                    let activeColor = 'bg-white shadow-sm text-slate-900';
                    if (isActive && s === JobStatus.OFFER) activeColor = 'bg-green-500 text-white';
                    if (isActive && s === JobStatus.REJECTED) activeColor = 'bg-red-500 text-white';
                    if (isActive && s === JobStatus.INTERVIEWING) activeColor = 'bg-yellow-500 text-white';
                    if (isActive && s === JobStatus.APPLIED) activeColor = 'bg-blue-500 text-white';

                    return (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                isActive ? activeColor : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {s}
                        </button>
                    )
                })}
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6 shrink-0">
         <button 
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
         >
            <MessageSquare size={16} /> Job Requirements
         </button>
         <button 
            onClick={() => setActiveTab('ai')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
         >
            <BrainCircuit size={16} /> AI Interview Coach
         </button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
         {activeTab === 'details' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
               <h3 className="font-semibold text-slate-900 mb-4">Full Description</h3>
               <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                  {job.requirements}
               </div>
            </div>
         )}

         {activeTab === 'ai' && (
            <div className="space-y-6 pb-10">
               {!aiData && !aiLoading && (
                  <div className="text-center py-12 bg-gradient-to-b from-indigo-50 to-white rounded-2xl border border-indigo-100">
                     <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BrainCircuit size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Prepare with Gemini AI</h3>
                     <p className="text-slate-600 max-w-md mx-auto mb-6">
                        Analyze the job requirements to generate tailored interview questions, behavioral scenarios, and tips.
                     </p>
                     <button
                        onClick={handleAiGenerate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                     >
                        Generate Interview Prep
                     </button>
                  </div>
               )}

               {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-20">
                     <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
                     <p className="text-slate-500 animate-pulse">Gemini is analyzing the job description...</p>
                  </div>
               )}

               {aiData && (
                  <div className="grid gap-6">
                     <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                           <CheckCircle className="text-blue-500" size={20} /> Technical Questions
                        </h3>
                        <ul className="space-y-3">
                           {aiData.technicalQuestions.map((q, i) => (
                              <li key={i} className="bg-slate-50 p-3 rounded-lg text-slate-700 text-sm border border-slate-100">
                                 {q}
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div className="bg-white rounded-xl border-l-4 border-purple-500 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                           <MessageSquare className="text-purple-500" size={20} /> Behavioral Questions
                        </h3>
                        <ul className="space-y-3">
                           {aiData.behavioralQuestions.map((q, i) => (
                              <li key={i} className="bg-slate-50 p-3 rounded-lg text-slate-700 text-sm border border-slate-100">
                                 {q}
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div className="bg-white rounded-xl border-l-4 border-green-500 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                           <Clock className="text-green-500" size={20} /> Quick Tips
                        </h3>
                        <ul className="space-y-3">
                           {aiData.tips.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                 <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                 {t}
                              </li>
                           ))}
                        </ul>
                     </div>
                     
                     <div className="flex justify-center mt-4">
                        <button 
                           onClick={handleAiGenerate} 
                           className="text-sm text-slate-400 hover:text-slate-600 underline"
                        >
                           Regenerate Insights
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};