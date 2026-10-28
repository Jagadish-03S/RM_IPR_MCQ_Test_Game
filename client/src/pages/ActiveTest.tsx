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

  // Restart assessment after tab switch disqualification
  const handleRestartTest = async () => {
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-slate-900 border border-rose-900/60 rounded-3xl p-8 text-center shadow-2xl text-white space-y-6">
          <div className="inline-flex p-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-3xl">
            <AlertOctagon className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
              Integrity Violation Detected
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-3 text-white tracking-tight">
              Assessment Terminated
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              You switched browser tabs or minimized the assessment window. Under strict examination regulations, switching tabs even once results in immediate disqualification and locks you out of the test.
            </p>
          </div>

          <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-4 text-xs text-rose-300 space-y-1.5 text-left">
            <div className="font-bold text-rose-200">Violation Status:</div>
            <p>• Event Type: Browser Tab Switch / Window Blur</p>
            <p>• Limit Permitted: 0 Tab Switches (Zero Tolerance)</p>
            <p>• Action: Current attempt invalidated & locked</p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleRestartTest}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Assessment from Beginning (Module 1)</span>
            </button>

            <a
              href="/api/downloads/textbook?inline=true"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 text-xs text-slate-400 hover:text-slate-200 py-2 transition"
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading Module {currentModuleId} Questions...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = questions.filter((q) => answers[q.id] && answers[q.id] !== '').length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isFinalModule = currentModuleId === 5;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Test Controls Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Module {currentModuleId} of 5
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {moduleTitle}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Attempted: <strong className="text-slate-800">{answeredCount}</strong> / {questions.length} questions
            </p>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-wrap gap-y-2">
            {/* Refer Textbook Button */}
            <a
              href="/api/downloads/textbook?inline=true"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition"
              title="Open Textbook Reference"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Textbook ↗</span>
            </a>

            {/* Focus Monitor Badge */}
            <FocusMonitor
              moduleId={currentModuleId}
              initialWarnings={totalWarnings}
              onWarningCountChange={(count) => setTotalWarnings(count)}
              onDisqualified={() => setIsDisqualified(true)}
            />

            {/* Countdown Timer */}
            <Timer
              initialMinutes={timeLimitMinutes}
              startedAt={moduleStartedAt}
              onTimeExpired={handleTimeExpired}
            />

            {/* Submit Module Button */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isFinalModule ? 'Finish Assessment' : `Submit Module ${currentModuleId}`}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-7xl mx-auto mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Question, Right Navigator */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Question Card */}
        <div className="lg:col-span-2 space-y-4">
          {currentQ ? (
            <QuestionCard
              question={currentQ}
              selectedOption={answers[currentQ.id] || null}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <div className="bg-white p-8 rounded-xl text-center text-slate-500">
              No questions found for this module.
            </div>
          )}

          {/* Previous / Next Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition flex items-center space-x-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow transition flex items-center space-x-2"
              >
                <span>Review & Submit Module</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator Grid & Module Details */}
        <div className="space-y-4">
          <QuestionGrid
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            questions={questions}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Module Progression Policy
            </h4>
            <p>
              You must submit all 20 questions in Module {currentModuleId} before Module{' '}
              {currentModuleId < 5 ? currentModuleId + 1 : 5} unlocks.
            </p>
            <p className="text-slate-500">
              Answers are securely saved immediately on the server when selected.
            </p>
          </div>
        </div>
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
