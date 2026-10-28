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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-sm text-slate-400">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      id: 1,
      title: 'Module 1: Introduction to Research Methodology',
      chapters: 'Chapter 1: Definitions, Problem Formulation & Engineering Research Cycles',
      questions: 20,
      marks: 20
    },
    {
      id: 2,
      title: 'Module 2: Literature Review and Technical Reading',
      chapters: 'Chapters 2 & 3: Literature Survey, Citations, Attributions & Ethics',
      questions: 20,
      marks: 20
    },
    {
      id: 3,
      title: 'Module 3: Introduction to Intellectual Property & Patents',
      chapters: 'Chapters 4, 5 & 6: IPR Overview, Patent Law & Process of Patenting',
      questions: 20,
      marks: 20
    },
    {
      id: 4,
      title: 'Module 4: Copyrights and Related Rights; Trademarks',
      chapters: 'Chapters 7 & 8: Berne Convention, Copyright Protection & Trademarks',
      questions: 20,
      marks: 20
    },
    {
      id: 5,
      title: 'Module 5: Industrial Design, GI & Case Studies',
      chapters: 'Chapters 9, 10 & 11: Industrial Designs, Geographical Indications & Landmark Cases',
      questions: 20,
      marks: 20
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Candidate Verification Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950/90 px-3 py-1 rounded-full border border-blue-800/80">
            Candidate Verification & Protocol
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Research Methodology & IPR Examination
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            VTU Course Code BRMK557 • Total 100 Multiple Choice Questions (100 Marks)
          </p>
        </div>

        {student && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shrink-0 shadow-lg relative z-10 min-w-[240px]">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Candidate</span>
            </div>
            <p className="font-bold text-base text-white">{student.fullName}</p>
            <p className="font-mono text-xs text-blue-400 font-semibold tracking-wider mt-0.5">
              USN: {student.usn}
            </p>
          </div>
        )}
      </div>

      {/* Textbook Reference Callout */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-950/40 border border-blue-900/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-blue-600/30 text-blue-400 rounded-xl shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Prescribed Textbook Reference</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every MCQ in this examination is sourced and verified directly from the BRMK557 textbook.
            </p>
          </div>
        </div>
        <a
          href="/api/downloads/textbook?inline=true"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Refer Textbook (PDF) ↗</span>
        </a>
      </div>

      {/* Modules Structure */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Assessment Structure (5 Ordered Modules)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  Module {m.id}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {m.marks} Marks
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{m.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{m.chapters}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>{m.questions} Questions</span>
                <span className="text-emerald-600 font-semibold">+1 mark each</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Integrity Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Scoring & Progression Policy</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>+1 Mark</strong> for each correct answer; <strong>0 Marks</strong> for wrong or unanswered.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Modules must be answered in sequential order (Module 1 through 5).</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Once a module is submitted, answers are <strong>permanently locked</strong> before advancing.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Each module has a <strong>{config?.timeLimitMinutesPerModule || 20}-minute timer</strong> with automatic submission upon expiry.</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50/40 rounded-2xl p-6 border border-amber-200/80 shadow-sm">
          <h3 className="font-bold text-amber-950 text-base mb-3 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Browser Integrity & Focus Monitoring</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-amber-900">
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-amber-600">•</span>
              <span>The assessment monitors active tab visibility and window focus events.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-rose-600">•</span>
              <span className="text-rose-900 font-semibold">
                <strong>Zero Tolerance:</strong> Switching tabs or minimizing the window even <strong>once (1 time)</strong> immediately terminates your test and locks you out. You will have to restart from Module 1.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-amber-600">•</span>
              <span>All focus anomalies and tab-switch attempts are logged in the official transcript for the examiner.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold shrink-0 text-amber-600">•</span>
              <span>Question papers, master keys, and solutions unlock <strong>only after</strong> you complete and submit the full assessment.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => navigate('/test')}
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-900/30 hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>I Agree to Rules • Begin Module 1</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
