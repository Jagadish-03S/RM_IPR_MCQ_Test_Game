import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle2, BookOpen, ShieldCheck } from 'lucide-react';
import { studentApi, API_BASE_URL } from '../services/api';

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [usn, setUsn] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedUsn = usn.trim().toUpperCase().replace(/\s+/g, '');

    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your full legal name as registered.');
      return;
    }

    if (!trimmedUsn || trimmedUsn.length < 3) {
      setError('Please enter your University Seat Number (USN).');
      return;
    }

    try {
      setLoading(true);
      const res = await studentApi.login(trimmedName, trimmedUsn);
      const data = res.data;

      localStorage.setItem('rm_ipr_student_session', data.sessionToken);
      localStorage.setItem('rm_ipr_student_name', data.student.fullName);
      localStorage.setItem('rm_ipr_student_usn', data.student.usn);

      if (data.alreadyCompleted) {
        navigate('/results');
      } else if (data.resumed) {
        navigate('/test');
      } else {
        navigate('/instructions');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initialize assessment. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 sm:p-3.5 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl shadow-xl shadow-blue-900/30 mb-3 sm:mb-4 text-white ring-1 ring-white/20">
          <GraduationCap className="h-8 w-8 sm:h-9 sm:w-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Candidate Portal
        </h1>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-400">
          VTU Academic Evaluation: Research Methodology & IPR (BRMK557)
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-6 px-5 sm:py-8 sm:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-800 ring-1 ring-white/10">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl p-3 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Legal Name
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                University Seat Number (USN)
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  required
                  placeholder="e.g. 1MS21CS001"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  className="block w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono placeholder-slate-500 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm transition uppercase"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/40 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 transition duration-150 transform active:scale-[0.99]"
              >
                {loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Enter Assessment</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Textbook Reference */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <a
              href={`${API_BASE_URL}/downloads/textbook?inline=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-950/70 border border-blue-900/60 p-3 rounded-xl transition group"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                <span className="font-medium">Read Prescribed Course Textbook (PDF)</span>
              </div>
              <span className="text-[11px] bg-blue-900/60 px-2 py-0.5 rounded text-blue-200">Open ↗</span>
            </a>
          </div>

          {/* Assessment Protocol Summary */}
          <div className="mt-4 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center space-x-2 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>5 Ordered Curriculum Modules • 20 MCQs Each</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Automated Scoring & Downloadable Certified Scorecard</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Active Tab & Window Focus Proctoring Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
