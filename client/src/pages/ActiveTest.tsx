import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, AlertCircle, BookOpen, AlertOctagon, RotateCcw } from 'lucide-react';
import { studentApi } from '../services/api';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionGrid } from '../components/QuestionGrid';
import { Timer } from '../components/Timer';
import { FocusMonitor } from '../components/FocusMonitor';
import { ModuleSubmitModal } from '../components/ModuleSubmitModal';

export const ActiveTest: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<number>(1);
  const [moduleTitle, setModuleTitle] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(20);
  const [moduleStartedAt, setModuleStartedAt] = useState<string | null>(null);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [totalWarnings, setTotalWarnings] = useState<number>(0);

  // Load Attempt Status and active module
  const loadModuleData = useCallback(async (targetModuleId?: number) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Get current attempt status
      const attemptRes = await studentApi.getAttempt();
      const currentAttempt = attemptRes.data.attempt;
      setTotalWarnings(currentAttempt.totalWarnings || 0);

      if (currentAttempt.status === 'COMPLETED') {
        navigate('/results');
        return;
      }

      if (currentAttempt.status === 'DISQUALIFIED') {
        setIsDisqualified(true);
        setLoading(false);
        return;
      }

      setIsDisqualified(false);
      const modId = targetModuleId || currentAttempt.currentModuleId || 1;
      setCurrentModuleId(modId);

      // 2. Fetch questions and saved responses for this module
      const modRes = await studentApi.getModuleQuestions(modId);
      const modData = modRes.data;

      setModuleTitle(modData.moduleTitle);
      setQuestions(modData.questions);
      setTimeLimitMinutes(modData.timeLimitMinutes || 20);
      setModuleStartedAt(modData.startedAt || new Date().toISOString());

      // Map saved responses
      const initialAnswers: Record<string, string | null> = {};
      modData.questions.forEach((q: any) => {
        initialAnswers[q.id] = null;
      });
      if (modData.savedResponses && Array.isArray(modData.savedResponses)) {
        modData.savedResponses.forEach((r: any) => {
          initialAnswers[r.questionId] = r.selectedOption;
        });
      }
      setAnswers(initialAnswers);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error('Failed to load active module:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to load test module.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('rm_ipr_student_session');
    if (!token) {
      navigate('/');
      return;
    }
    loadModuleData();
  }, [navigate, loadModuleData]);

  // Handle option selection & autosave
  const handleSelectOption = async (option: string | null) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    // Optimistic UI update
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option
    }));

    try {
      await studentApi.saveAnswer(currentQ.id, option);
    } catch (err: any) {
      console.error('Autosave error:', err);
      setErrorMsg('Failed to save response. Please check your connection.');
    }
  };

  // Handle module submission
  const handleConfirmSubmitModule = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const elapsedSeconds = moduleStartedAt
        ? Math.floor((Date.now() - new Date(moduleStartedAt).getTime()) / 1000)
        : 0;

      const res = await studentApi.submitModule(currentModuleId, elapsedSeconds);
      setIsSubmitModalOpen(false);

      if (res.data.isComplete) {
        // All 5 modules completed!
        navigate('/results');
      } else {
        // Advance to next module
        const nextModId = res.data.nextModuleId;
        await loadModuleData(nextModId);
      }
    } catch (err: any) {
      console.error('Submit module error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to submit module.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit when timer expires
  const handleTimeExpired = useCallback(() => {
    handleConfirmSubmitModule();
  }, [currentModuleId, moduleStartedAt]);

  const handleRestartTest = async () => {
    if (
      !window.confirm(
        'Are you sure you want to restart your examination? This will reset all your answered modules and start fresh from Module 1.'
      )
    ) {
      return;
    }
    try {
      setLoading(true);
      await studentApi.restartTest();
      setIsDisqualified(false);
      await loadModuleData(1);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to restart assessment.');
      setLoading(false);
    }
  };

  if (isDisqualified) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-6 px-3 sm:px-6 relative z-10">
        <div className="max-w-lg w-full bg-slate-900/95 border border-rose-900/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl text-white space-y-4 sm:space-y-6">
          <div className="inline-flex p-3 sm:p-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl sm:rounded-3xl">
            <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div>
            <span className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
              Integrity Violation Detected
            </span>
            <h1 className="text-xl sm:text-3xl font-black mt-3 text-white tracking-tight">
              Assessment Terminated
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              You switched browser tabs or minimized the assessment window. Switching tabs results in immediate disqualification.
            </p>
          </div>

          <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs text-rose-300 space-y-1.5 text-left">
            <div className="font-bold text-rose-200">Violation Status:</div>
            <div>• Browser Window Focus: Lost</div>
            <div>• Single Tab Switch Rule: Enforced</div>
            <div>• Current Attempt: Disqualified</div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleRestartTest}
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition active:scale-98 text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Assessment from Module 1</span>
            </button>

            <a
              href="/api/downloads/textbook?inline=true"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 text-xs text-slate-400 hover:text-slate-200 py-1 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Review Course Textbook before Restarting ↗</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">Loading Module {currentModuleId} Questions...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = questions.filter((q) => answers[q.id] && answers[q.id] !== '').length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isFinalModule = currentModuleId === 5;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-3 sm:py-6 px-2.5 sm:px-6 lg:px-8 pb-24 sm:pb-8 relative z-10">
      {/* Test Controls Bar */}
      <div className="max-w-7xl mx-auto mb-3 sm:mb-6">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-800 p-3 sm:p-5 shadow-xl text-white space-y-2.5 sm:space-y-3">
          {/* Top Row: Module Badge + Timer + Submit Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                M{currentModuleId} / 5
              </span>
              <h1 className="text-xs sm:text-base font-bold text-white truncate max-w-[140px] sm:max-w-md">
                {moduleTitle}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Timer
                initialMinutes={timeLimitMinutes}
                startedAt={moduleStartedAt}
                onTimeExpired={handleTimeExpired}
              />

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow transition flex items-center space-x-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isFinalModule ? 'Finish Exam' : `Submit M${currentModuleId}`}
                </span>
                <span className="sm:hidden">Submit</span>
              </button>
            </div>
          </div>

          {/* Second Row: Proctoring Status & Textbook */}
          <div className="flex items-center justify-between text-xs text-slate-400 gap-2 flex-wrap">
            <FocusMonitor
              moduleId={currentModuleId}
              initialWarnings={totalWarnings}
              onWarningCountChange={(count) => setTotalWarnings(count)}
              onDisqualified={() => setIsDisqualified(true)}
            />

            <div className="flex items-center space-x-3 text-[11px]">
              <span>
                Attempted: <strong className="text-emerald-400">{answeredCount}</strong> / {questions.length}
              </span>
              <a
                href="/api/downloads/textbook?inline=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Textbook</span>
              </a>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Mobile Horizontal Question Ribbon (1 to 20) */}
          <div className="lg:hidden pt-1">
            <QuestionGrid
              variant="ribbon"
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answers={answers}
              questions={questions}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-7xl mx-auto mb-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Question, Right Navigator */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Active Question Card */}
        <div className="lg:col-span-2 space-y-4">
          {currentQ ? (
            <QuestionCard
              question={currentQ}
              selectedOption={answers[currentQ.id] || null}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <div className="bg-slate-900/90 p-8 rounded-2xl text-center text-slate-400 border border-slate-800">
              No questions found for this module.
            </div>
          )}

          {/* Desktop Previous / Next Navigation Controls */}
          <div className="hidden sm:flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold shadow-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/40 transition flex items-center space-x-2 active:scale-98"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/40 transition flex items-center space-x-2 active:scale-98"
              >
                <span>Review & Submit Module</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator Grid & Module Details (Desktop) */}
        <div className="hidden lg:block space-y-4">
          <QuestionGrid
            variant="grid"
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            questions={questions}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />

          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 text-xs text-slate-400 space-y-2">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Examination Instructions
            </h4>
            <p>
              Complete all 20 questions in Module {currentModuleId}. You can review and change options anytime before submitting.
            </p>
            <p className="text-slate-500">
              Your selections are automatically saved immediately on the server.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3 sm:hidden shadow-2xl flex items-center justify-between">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <div className="text-center select-none">
          <span className="text-xs font-mono font-black text-amber-400">
            Q {currentIndex + 1}
          </span>
          <span className="text-[10px] text-slate-400 font-medium"> / {questions.length}</span>
        </div>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-blue-900/40"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-emerald-900/40"
          >
            <span>Submit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Module Submission Confirmation Modal */}
      <ModuleSubmitModal
        isOpen={isSubmitModalOpen}
        moduleId={currentModuleId}
        moduleTitle={moduleTitle}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        isFinalModule={isFinalModule}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmSubmitModule}
        onCancel={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};
