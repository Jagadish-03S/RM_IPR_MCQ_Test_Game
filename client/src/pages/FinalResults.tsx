import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  ShieldAlert,
  BookOpen,
  FileText
} from 'lucide-react';
import { studentApi } from '../services/api';

export const FinalResults: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'CORRECT' | 'WRONG' | 'UNANSWERED'>('ALL');

  useEffect(() => {
    const token = localStorage.getItem('rm_ipr_student_session');
    if (!token) {
      navigate('/');
      return;
    }

    studentApi
      .getResults()
      .then((res) => {
        setData(res.data);
        // Trigger celebratory confetti if score is passing (>= 40%)
        if (res.data.attempt?.percentage >= 40) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if canvas-confetti is not available
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load results:', err);
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Computing final assessment marks...</p>
        </div>
      </div>
    );
  }

  const { attempt, student, review, allowReview } = data || {};
  const isPassed = attempt?.percentage >= 40;
  const sessionToken = localStorage.getItem('rm_ipr_student_session') || '';

  // Filter review items
  const filteredReview = (review || []).filter((item: any) => {
    if (reviewFilter === 'CORRECT') return item.isCorrect;
    if (reviewFilter === 'WRONG') return !item.isCorrect && item.selectedOption !== null;
    if (reviewFilter === 'UNANSWERED') return item.selectedOption === null;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Score Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Official Assessment Results • VTU BRMK557</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {student?.fullName}
            </h1>
            <p className="text-sm font-mono text-blue-400 mt-1">
              USN: {student?.usn} | Attempt ID: {attempt?.id?.slice(0, 8)}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Completed on: {new Date(attempt?.completedAt || attempt?.startedAt).toLocaleString()}
            </p>
          </div>

          {/* Big Score Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[200px]">
            <div className="text-4xl sm:text-5xl font-black text-white">
              {attempt?.totalScore}
              <span className="text-xl sm:text-2xl font-normal text-slate-300"> / 100</span>
            </div>
            <div className="mt-1 flex items-center justify-center space-x-2">
              <span className="text-base font-bold text-blue-300">
                {attempt?.percentage?.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isPassed ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
                }`}
              >
                {isPassed ? 'QUALIFIED' : 'NEEDS IMPROVEMENT'}
              </span>
            </div>
          </div>
        </div>

        {/* Download Scorecard CTA */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Download your certified academic scorecard and performance audit transcript:
          </p>
          <div className="flex items-center space-x-3">
            <a
              href={`/api/downloads/scorecard/${attempt?.id}/pdf`}
              download
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Scorecard</span>
            </a>
            <a
              href={`/api/downloads/scorecard/${attempt?.id}/docx`}
              download
              className="inline-flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Word (DOCX)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm text-center">
          <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Attempted
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{attempt?.totalAttempted}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">out of 100 questions</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-emerald-900/50 shadow-sm text-center">
          <div className="text-[11px] sm:text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{attempt?.totalCorrect}</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-500">+1.0 mark each</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-rose-900/50 shadow-sm text-center">
          <div className="text-[11px] sm:text-xs text-rose-400 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Incorrect</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">{attempt?.totalWrong}</div>
          <div className="text-[10px] sm:text-[11px] text-rose-500">0.0 penalty</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm text-center">
          <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Unanswered</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-300">{attempt?.totalUnanswered}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">0.0 marks</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-amber-900/50 shadow-sm text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] sm:text-xs text-amber-400 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Focus Alerts</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">{attempt?.totalWarnings}</div>
          <div className="text-[10px] sm:text-[11px] text-amber-500">tab switches</div>
        </div>
      </div>

      {/* Module Breakdown Table */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800 overflow-hidden text-white">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm sm:text-base">Module-by-Module Performance</h2>
          <span className="text-[11px] text-slate-400">20 MCQs per module</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-xs sm:text-sm">
            <thead className="bg-slate-950/60 text-slate-400 text-[10px] sm:text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">Module</th>
                <th className="px-4 sm:px-6 py-3 text-left">Title</th>
                <th className="px-3 sm:px-6 py-3 text-center">Attempted</th>
                <th className="px-3 sm:px-6 py-3 text-center">Correct</th>
                <th className="px-3 sm:px-6 py-3 text-center">Wrong</th>
                <th className="px-4 sm:px-6 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attempt?.moduleAttempts?.map((mod: any) => (
                <tr key={mod.moduleId} className="hover:bg-slate-800/40">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-white whitespace-nowrap">
                    Module {mod.moduleId}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300 min-w-[160px]">{mod.moduleTitle}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-medium text-slate-300 whitespace-nowrap">
                    {mod.attempted} / 20
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-emerald-400 whitespace-nowrap">
                    {mod.correct}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-medium text-rose-400 whitespace-nowrap">
                    {mod.wrong}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-black text-white whitespace-nowrap">
                    {mod.score} / 20
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post-Assessment Academic Downloads Repository (Unlocked only after attending test) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Assessment Completed • Academic Materials Unlocked</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Official Papers, Answer Keys & Prescribed Textbook
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Now that you have completed your assessment, you can download all official course materials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item 1: Candidate Scorecard */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl w-fit mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Official Scorecard</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your certified marks transcript with module breakdown and proctoring audit.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2">
              <a
                href={`/api/downloads/scorecard/${attempt?.id}/pdf`}
                download
                className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition"
              >
                PDF Scorecard
              </a>
              <a
                href={`/api/downloads/scorecard/${attempt?.id}/docx`}
                download
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg border border-slate-700 transition"
              >
                Word (DOCX)
              </a>
            </div>
          </div>

          {/* Item 2: Comprehensive 100Q Exam Paper */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl w-fit mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">100-MCQ Exam Paper</h3>
              <p className="text-xs text-slate-400 mt-1">
                The complete official question paper spanning all 5 modules with chapter citations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2">
              <a
                href={`/api/downloads/exam-paper/pdf?token=${sessionToken}`}
                download
                className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition"
              >
                PDF Paper
              </a>
              <a
                href={`/api/downloads/exam-paper/docx?token=${sessionToken}`}
                download
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg border border-slate-700 transition"
              >
                Word (DOCX)
              </a>
            </div>
          </div>

          {/* Item 3: Official Master Answer Key */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl w-fit mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Official Answer Key</h3>
              <p className="text-xs text-slate-400 mt-1">
                Full solutions key with verified answers, textbook page citations, and explanations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2">
              <a
                href={`/api/downloads/answer-key/pdf?token=${sessionToken}`}
                download
                className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg transition"
              >
                PDF Solutions
              </a>
              <a
                href={`/api/downloads/answer-key/docx?token=${sessionToken}`}
                download
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg border border-slate-700 transition"
              >
                Word (DOCX)
              </a>
            </div>
          </div>

          {/* Item 4: Course Textbook */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-2 bg-amber-600/20 text-amber-400 rounded-xl w-fit mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Prescribed Textbook</h3>
              <p className="text-xs text-slate-400 mt-1">
                The official 120-page BRMK557 RM & IPR curriculum reference manual.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2">
              <a
                href="/api/downloads/textbook?inline=true"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-2 rounded-lg transition"
              >
                Read Online ↗
              </a>
              <a
                href="/api/downloads/textbook"
                download
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg border border-slate-700 transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      {allowReview && review && review.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Textbook Solutions & Question Review</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect every answer against the textbook reference and full reasoning
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setReviewFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  reviewFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (100)
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('CORRECT')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  reviewFilter === 'CORRECT'
                    ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Correct ({attempt?.totalCorrect})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('WRONG')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  reviewFilter === 'WRONG'
                    ? 'bg-white text-rose-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                Incorrect ({attempt?.totalWrong})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('UNANSWERED')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  reviewFilter === 'UNANSWERED'
                    ? 'bg-white text-slate-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unanswered ({attempt?.totalUnanswered})
              </button>
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-6">
            {filteredReview.map((item: any) => {
              const optionKeys = ['A', 'B', 'C', 'D'] as const;

              return (
                <div
                  key={item.questionId}
                  className={`rounded-xl border p-5 transition ${
                    item.isCorrect
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : item.selectedOption === null
                      ? 'bg-slate-50/40 border-slate-200'
                      : 'bg-rose-50/20 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Module {item.moduleId} • Q{item.questionNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.selectedOption === null
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect
                        ? 'Correct (+1)'
                        : item.selectedOption === null
                        ? 'Unanswered (0)'
                        : 'Incorrect (0)'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
                    {item.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {optionKeys.map((k) => {
                      const isCorrectAnswer = k === item.correctAnswer;
                      const isStudentSelected = k === item.selectedOption;

                      let style = 'bg-white border-slate-200 text-slate-700';
                      if (isCorrectAnswer) {
                        style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                      } else if (isStudentSelected && !isCorrectAnswer) {
                        style = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                      }

                      return (
                        <div
                          key={k}
                          className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2 ${style}`}
                        >
                          <span className="font-bold shrink-0">{k})</span>
                          <span className="flex-1">{item.options[k]}</span>
                          {isCorrectAnswer && (
                            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                              Official Key
                            </span>
                          )}
                          {isStudentSelected && !isCorrectAnswer && (
                            <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Textbook citation & Explanation */}
                  <div className="bg-slate-100/80 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Textbook Citation: {item.chapterReference} (Page {item.pageReference})
                      </span>
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-700">Explanation:</strong> {item.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
