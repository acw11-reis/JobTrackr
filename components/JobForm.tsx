import React, { useState } from 'react';
import { JobApplication, JobStatus } from '../types';
import { ArrowLeft, Save, Loader2, Wand2 } from 'lucide-react';
import { analyzeSalary } from '../services/geminiService';

interface JobFormProps {
  onSave: (job: JobApplication) => void;
  onBack: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSave, onBack }) => {
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    status: JobStatus.APPLIED,
    dateApplied: new Date().toISOString().split('T')[0],
  });
  const [analyzingSalary, setAnalyzingSalary] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;
    
    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: formData.company,
      position: formData.position,
      location: formData.location || 'Remote',
      salary: formData.salary || 'Not specified',
      dateApplied: formData.dateApplied!,
      requirements: formData.requirements || '',
      status: formData.status || JobStatus.APPLIED,
      notes: ''
    };
    onSave(newJob);
  };

  const handleAutoEstimate = async () => {
     if(!formData.requirements || !formData.position) return;
     setAnalyzingSalary(true);
     try {
        const estimate = await analyzeSalary(formData.requirements, formData.position, formData.location || 'Unknown');
        setFormData(prev => ({...prev, salary: estimate}));
     } finally {
        setAnalyzingSalary(false);
     }
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Company Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="e.g. Google"
                value={formData.company || ''}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Position</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.position || ''}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="e.g. New York (Remote)"
                value={formData.location || ''}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Date Applied</label>
              <input
                required
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData.dateApplied || ''}
                onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">Salary</label>
                <button 
                   type="button"
                   disabled={analyzingSalary || !formData.requirements}
                   onClick={handleAutoEstimate}
                   className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                   {analyzingSalary ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />}
                   Estimate with AI
                </button>
             </div>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="e.g. $120,000 - $150,000"
              value={formData.salary || ''}
              onChange={e => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Job Requirements <span className="text-slate-400 font-normal">(Paste full text here)</span>
            </label>
            <textarea
              required
              rows={8}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-sm custom-scrollbar"
              placeholder="Paste the entire job description here..."
              value={formData.requirements || ''}
              onChange={e => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
             <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
             >
                Cancel
             </button>
             <button
                type="submit"
                className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
             >
                <Save size={18} /> Save Application
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};