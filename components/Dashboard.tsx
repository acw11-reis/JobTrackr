import React, { useState, useMemo } from 'react';
import { JobApplication, JobStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PlusCircle, Briefcase, Calendar, Filter, ChevronRight } from 'lucide-react';

interface DashboardProps {
  jobs: JobApplication[];
  onNavigate: (view: 'add' | 'detail', id?: string) => void;
}

const STATUS_COLORS = {
  [JobStatus.APPLIED]: '#3b82f6', // Blue 500
  [JobStatus.INTERVIEWING]: '#eab308', // Yellow 500
  [JobStatus.OFFER]: '#22c55e', // Green 500
  [JobStatus.REJECTED]: '#ef4444', // Red 500
};

export const Dashboard: React.FC<DashboardProps> = ({ jobs, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<JobStatus | 'All'>('All');

  const filteredJobs = useMemo(() => {
    if (activeTab === 'All') return jobs;
    return jobs.filter(job => job.status === activeTab);
  }, [jobs, activeTab]);

  const statsData = useMemo(() => {
    const counts = {
      [JobStatus.APPLIED]: 0,
      [JobStatus.INTERVIEWING]: 0,
      [JobStatus.OFFER]: 0,
      [JobStatus.REJECTED]: 0,
    };
    jobs.forEach(job => {
      if (counts[job.status] !== undefined) {
        counts[job.status]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Track and manage your job applications</p>
        </div>
        <button
          onClick={() => onNavigate('add')}
          className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
        >
          <PlusCircle size={20} />
          New Application
        </button>
      </div>

      {/* Stats & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Application Overview</h3>
              <div className="flex gap-2">
                 {statsData.map(stat => (
                    <div key={stat.name} className="flex items-center gap-1 text-xs text-slate-500">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[stat.name as JobStatus] }}></span>
                       {stat.name}
                    </div>
                 ))}
              </div>
           </div>
           <div className="h-40 w-full">
              {jobs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as JobStatus]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
                  No applications yet. Add one to see stats!
                </div>
              )}
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
            <div className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Total Applications</div>
            <div className="text-5xl font-bold mb-4">{jobs.length}</div>
            <div className="text-indigo-100 text-sm">
               {jobs.filter(j => j.status === JobStatus.INTERVIEWING).length} active interviews
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
        {['All', ...Object.values(JobStatus)].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as JobStatus | 'All')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List View */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
               <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
            <p className="text-slate-500 text-sm mt-1">Try changing the filter or adding a new job.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onNavigate('detail', job.id)}
              className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`} style={{ backgroundColor: STATUS_COLORS[job.status] }}>
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {job.position}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                     <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {job.company}
                     </span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <span className="flex items-center gap-1">
                        <Calendar size={14} /> {new Date(job.dateApplied).toLocaleDateString()}
                     </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    job.status === JobStatus.OFFER ? 'bg-green-50 text-green-700 border-green-200' :
                    job.status === JobStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' :
                    job.status === JobStatus.INTERVIEWING ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                 }`}>
                    {job.status}
                 </span>
                 <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-600" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};