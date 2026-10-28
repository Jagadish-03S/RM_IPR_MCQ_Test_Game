import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShieldAlert, CheckCircle2, Clock, Award, ArrowRight, User } from 'lucide-react';
import { studentApi } from '../services/api';

export const TestInstructions: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('rm_ipr_student_session');
    if (!token) {
      navigate('/');
      return;
    }

    studentApi
      .getAttempt()
      .then((res) => {
        setStudent(res.data.student);
        setConfig(res.data.config);
        if (res.data.attempt?.status === 'COMPLETED') {
          navigate('/results');
        }
      })
      .catch((err) => {
        console.error('Failed to load session:', err);
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-xs sm:text-sm text-slate-400">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      id: 1,
      title: 'Module 1: Introduction to Research Methodology',
      chapters: 'Chapter 1: Definitions, Problem Formulation & Engineering Cycles',
      questions: 20,
      marks: 20
    },
    {
      id: 2,
      title: 'Module 2: Literature Review & Citations',
      chapters: 'Chapters 2 & 3: Literature Survey, IEEE Citations & Ethics',
      questions: 20,
      marks: 20
    },
    {
      id: 3,
      title: 'Module 3: Intellectual Property & Patents',
      chapters: 'Chapters 4, 5 & 6: IPR Basics, Patent Process & Claims',
      questions: 20,
      marks: 20
    },
    {
      id: 4,
      title: 'Module 4: Copyrights & Trademarks',
      chapters: 'Chapters 7 & 8: Berne Convention, Copyright Protection & Trademarks',
      questions: 20,
      marks: 20
    },
    {
      id: 5,
      title: 'Module 5: Industrial Design, GI & Case Studies',
      chapters: 'Chapters 9, 10 & 11: Industrial Designs, Geographical Indications & Cases',
      questions: 20,
      marks: 20
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 py-4 sm:py-8 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 relative z-10 text-white">
      {/* Candidate Verification Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-950/90 px-2.5 py-1 rounded-lg border border-blue-800/80">
            Candidate Verification & Protocol
          </span>
          <h1 className="text-xl sm:text-3xl font-black mt-2 tracking-tight">
            Research Methodology & IPR Examination
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            VTU Course Code BRMK557 • Total 100 MCQs (100 Marks)
          </p>
        </div>

        {student && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shrink-0 shadow-inner">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-0.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Candidate</span>
            </div>
            <p className="font-bold text-sm sm:text-base text-white">{student.fullName}</p>
            <p className="font-mono text-xs text-blue-400 font-semibold tracking-wider">
              USN: {student.usn}
            </p>
          </div>
        )}
      </div>

      {/* Modules Structure */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          <span>Curriculum Modules (5 Sequential Modules • 20 MCQs Each)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 border border-slate-800 shadow-md hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-800/60">
                  Module {m.id}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {m.marks} Marks
                </span>
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm mb-1">{m.title}</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">{m.chapters}</p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{m.questions} Questions</span>
                <span className="text-emerald-400 font-semibold">+1 mark each</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Integrity Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-sm">
          <h3 className="font-bold text-white text-sm sm:text-base mb-2.5 flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Scoring & Progression Policy</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>+1 Mark</strong> for each correct answer; <strong>0 Marks</strong> for wrong or unanswered.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Modules must be answered in sequential order (Module 1 through 5).</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Once a module is submitted, answers are <strong>permanently locked</strong> before advancing.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Each module has a <strong>{config?.timeLimitMinutesPerModule || 20}-minute timer</strong> with automatic submission upon expiry.</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-950/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-amber-900/60 shadow-sm">
          <h3 className="font-bold text-amber-300 text-sm sm:text-base mb-2.5 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Browser Integrity & Focus Monitoring</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-amber-200/90">
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-amber-400">•</span>
              <span>The assessment monitors active window focus and tab switches.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-rose-400">•</span>
              <span className="text-rose-300 font-semibold">
                <strong>Zero Tolerance:</strong> Switching tabs even <strong>once (1 time)</strong> terminates your test immediately and locks you out. You must restart from Module 1.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-amber-400">•</span>
              <span>Question papers, master keys, and solutions unlock <strong>only after</strong> you complete and submit the full assessment.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-2 pb-4">
        <button
          type="button"
          onClick={() => navigate('/test')}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-900/40 transition transform active:scale-98"
        >
          <span>I Agree to Rules • Begin Module 1</span>
          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
