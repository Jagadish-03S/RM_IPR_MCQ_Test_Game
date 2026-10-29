import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { studentApi, API_BASE_URL } from '../services/api';

export const DownloadCentre: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenParam, setTokenParam] = useState<string>('');

  useEffect(() => {
    const adminToken = localStorage.getItem('rm_ipr_admin_token');
    const studentToken = localStorage.getItem('rm_ipr_student_session');

    if (adminToken) {
      setIsAuthorized(true);
      setTokenParam(`?token=${adminToken}`);
      setLoading(false);
      return;
    }

    if (studentToken) {
      studentApi
        .getAttempt()
        .then((res) => {
          if (res.data.attempt?.status === 'COMPLETED') {
            setIsAuthorized(true);
            setTokenParam(`?token=${studentToken}`);
          } else {
            setIsAuthorized(false);
          }
        })
        .catch(() => setIsAuthorized(false))
        .finally(() => setLoading(false));
      return;
    }

    setIsAuthorized(false);
    setLoading(false);
  }, []);

  const modules = [
    {
      id: 1,
      title: 'Module 1: Introduction to Research Methodology',
      desc: 'Chapter 1: Definitions, research cycles, orchestration actions, exploratory vs confirmatory research.'
    },
    {
      id: 2,
      title: 'Module 2: Literature Review & Citations',
      desc: 'Chapters 2 & 3: Literature survey protocols, indexing databases, IEEE/ACM citations, plagiarism ethics.'
    },
    {
      id: 3,
      title: 'Module 3: Intellectual Property & Patents',
      desc: 'Chapters 4, 5 & 6: IPR fundamentals, patentability criteria, non-obviousness, provisional/complete specifications.'
    },
    {
      id: 4,
      title: 'Module 4: Copyrights & Trademarks',
      desc: 'Chapters 7 & 8: Berne convention, original expression, fair dealing, trademark distinctiveness, infringements.'
    },
    {
      id: 5,
      title: 'Module 5: Industrial Designs, GI & Case Studies',
      desc: 'Chapters 9, 10 & 11: Design novelty, geographical indications, Darjeeling tea, turmeric, basmati, and landmark cases.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-sm text-slate-400">Checking assessment authorization...</p>
        </div>
      </div>
    );
  }

  // If candidate has not attended/completed the assessment
  if (!isAuthorized) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-3xl shadow-lg">
          <Lock className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Assessment Attendance Required
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Official examination papers, module sets, and master answer keys with textbook citations are strictly locked. They can only be downloaded after you have completed and submitted all modules of the assessment.
        </p>

        {/* Textbook access is always available for reading */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 text-left flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-white">Prescribed Textbook (BRMK557)</h3>
              <p className="text-xs text-slate-400">You can freely refer to the course textbook.</p>
            </div>
          </div>
          <a
            href={`${API_BASE_URL}/downloads/textbook?inline=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shrink-0"
          >
            Read Textbook (PDF) ↗
          </a>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition"
          >
            <span>Proceed to Student Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // If candidate has completed test OR is admin: Full Access!
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Access Unlocked • Post-Assessment Academic Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Question Papers, Answer Keys & Curriculum Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          High-fidelity, printable PDF documents and Microsoft Word (.docx) assessment papers strictly verified against the BRMK557 textbook.
        </p>
      </div>

      {/* Primary 100-Question Examination Paper & Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 100Q Exam Paper */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded">
                100 MCQs
              </span>
              <span className="text-xs text-slate-500 font-mono">Full Paper</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              100-MCQ Exam Paper
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Official assessment paper across all 5 modules with chapter references.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2">
            <a
              href={`${API_BASE_URL}/downloads/exam-paper/pdf${tokenParam}`}
              download
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              PDF Paper
            </a>
            <a
              href={`${API_BASE_URL}/downloads/exam-paper/docx${tokenParam}`}
              download
              className="flex-1 text-center border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-lg transition"
            >
              Word (DOCX)
            </a>
          </div>
        </div>

        {/* Card 2: Official Answer Key */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded">
                Master Key
              </span>
              <span className="text-xs text-slate-500 font-mono">100 Solutions</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Master Solutions Key
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Verified answers with textbook page citations and detailed explanations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2">
            <a
              href={`${API_BASE_URL}/downloads/answer-key/pdf${tokenParam}`}
              download
              className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              PDF Solutions
            </a>
            <a
              href={`${API_BASE_URL}/downloads/answer-key/docx${tokenParam}`}
              download
              className="flex-1 text-center border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-lg transition"
            >
              Word (DOCX)
            </a>
          </div>
        </div>

        {/* Card 3: Prescribed Textbook */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold bg-amber-600 text-white px-2.5 py-0.5 rounded">
                Prescribed Book
              </span>
              <span className="text-xs text-slate-500 font-mono">120 Pages</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Course Textbook (PDF)
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Official BRMK557 Research Methodology & IPR textbook curriculum manual.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2">
            <a
              href={`${API_BASE_URL}/downloads/textbook?inline=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              Read Online ↗
            </a>
            <a
              href={`${API_BASE_URL}/downloads/textbook`}
              download
              className="flex-1 text-center border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-lg transition"
            >
              Download PDF
            </a>
          </div>
        </div>
      </div>

      {/* Module-Wise Individual Papers & Keys */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Module-Wise Question Papers & Solutions (20 MCQs Each)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Module {m.id}
                </span>
                <h3 className="font-semibold text-slate-900 text-sm mt-2">{m.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{m.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500">Question Paper:</div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`${API_BASE_URL}/downloads/module-paper/${m.id}/pdf${tokenParam}`}
                    download
                    className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold py-1.5 rounded transition"
                  >
                    PDF Paper
                  </a>
                  <a
                    href={`${API_BASE_URL}/downloads/module-paper/${m.id}/docx${tokenParam}`}
                    download
                    className="flex-1 text-center border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold py-1.5 rounded transition"
                  >
                    DOCX Paper
                  </a>
                </div>

                <div className="text-[11px] font-semibold text-slate-500 pt-1">Answer Key:</div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`${API_BASE_URL}/downloads/answer-key/pdf?moduleId=${m.id}&token=${tokenParam.replace('?token=', '')}`}
                    download
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold py-1.5 rounded transition"
                  >
                    PDF Solutions
                  </a>
                  <a
                    href={`${API_BASE_URL}/downloads/answer-key/docx?moduleId=${m.id}&token=${tokenParam.replace('?token=', '')}`}
                    download
                    className="flex-1 text-center border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-[11px] font-semibold py-1.5 rounded transition"
                  >
                    DOCX Key
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
