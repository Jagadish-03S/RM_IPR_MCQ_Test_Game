import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldAlert,
  Search,
  RotateCcw,
  Trash2,
  Download,
  Eye,
  X,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ATTEMPTS' | 'CONFIG' | 'REPORTS'>('ATTEMPTS');
  const [overview, setOverview] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('totalScore');
  const sortOrder = 'desc';

  // Selected Attempt Detail Modal
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [attemptDetail, setAttemptDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Test Config Form State
  const [config, setConfig] = useState<any>({
    testTitle: 'RM & IPR MCQ Test Game',
    marksPerCorrect: 1.0,
    negativeMarksPerWrong: 0.0,
    marksUnanswered: 0.0,
    timeLimitMinutesPerModule: 20,
    allowAnswerReview: true,
    isTestActive: true,
    maxFocusWarnings: 5,
    usnRegexPattern: '^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$'
  });
  const [configSavedMsg, setConfigSavedMsg] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashRes, attRes, cfgRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAttempts({ search: searchQuery, status: statusFilter, sortBy, sortOrder }),
        adminApi.getConfig()
      ]);

      setOverview(dashRes.data.overview);
      setAttempts(attRes.data.attempts);
      if (cfgRes.data.config) {
        setConfig(cfgRes.data.config);
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('rm_ipr_admin_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, sortOrder, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('rm_ipr_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [fetchDashboardData, navigate]);

  // Open detailed attempt modal
  const handleOpenAttemptDetail = async (id: string) => {
    try {
      setSelectedAttemptId(id);
      setLoadingDetail(true);
      const res = await adminApi.getAttemptDetail(id);
      setAttemptDetail(res.data);
    } catch (err) {
      console.error('Failed to load attempt detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Reset Attempt
  const handleResetAttempt = async (id: string, studentName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to reset the assessment attempt for ${studentName}? This will clear their answers and allow them to retake the test from Module 1.`
      )
    ) {
      return;
    }

    try {
      await adminApi.resetAttempt(id);
      alert(`Attempt for ${studentName} has been reset.`);
      if (selectedAttemptId === id) {
        setSelectedAttemptId(null);
      }
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to reset attempt.');
    }
  };

  // Delete Candidate Attempt / Record
  const handleDeleteAttempt = async (id: string, studentName: string, usn?: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete candidate ${studentName} (${usn || ''}) from the list? All their attempt data, responses, and records will be deleted.`
      )
    ) {
      return;
    }

    try {
      await adminApi.deleteAttempt(id);
      alert(`Candidate ${studentName} was permanently deleted from the list.`);
      if (selectedAttemptId === id) {
        setSelectedAttemptId(null);
      }
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete candidate.');
    }
  };

  // Secure Direct Admin Report Downloader
  const handleDownloadReport = async (format: 'csv' | 'pdf' | 'docx') => {
    const token = localStorage.getItem('rm_ipr_admin_token') || '';
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `RM_IPR_Assessment_Report_${timestamp}.${format}`;

    try {
      const response = await fetch(
        `/api/downloads/admin-report/${format}?token=${encodeURIComponent(token)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download report.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || 'Error downloading administrator report.');
    }
  };

  // Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSavedMsg(null);
    try {
      await adminApi.updateConfig({
        testTitle: config.testTitle,
        marksPerCorrect: Number(config.marksPerCorrect),
        negativeMarksPerWrong: Number(config.negativeMarksPerWrong),
        marksUnanswered: Number(config.marksUnanswered),
        timeLimitMinutesPerModule: Number(config.timeLimitMinutesPerModule),
        allowAnswerReview: Boolean(config.allowAnswerReview),
        isTestActive: Boolean(config.isTestActive),
        maxFocusWarnings: Number(config.maxFocusWarnings),
        usnRegexPattern: config.usnRegexPattern
      });
      setConfigSavedMsg('Configuration updated successfully!');
      setTimeout(() => setConfigSavedMsg(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update configuration.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading examiner analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 relative z-10">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-700/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Examiner Assessment Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            VTU Course Code BRMK557 • Candidate Performance & Proctoring Audit
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('ATTEMPTS')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'ATTEMPTS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidate Attempts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REPORTS')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'REPORTS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Consolidated Reports
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CONFIG')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'CONFIG'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Test Settings
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Candidates</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{overview.totalStudents}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">registered identities</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <div className="text-xs font-semibold text-blue-600 uppercase">Total Tests</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{overview.totalAttempts}</div>
            <div className="text-[11px] text-blue-500 mt-0.5">attempts logged</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Completed</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {overview.completedAttempts}
            </div>
            <div className="text-[11px] text-emerald-500 mt-0.5">all 5 modules done</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
            <div className="text-xs font-semibold text-amber-600 uppercase">In Progress</div>
            <div className="text-2xl font-black text-amber-700 mt-1">
              {overview.inProgressAttempts}
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5">active tests</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm">
            <div className="text-xs font-semibold text-indigo-600 uppercase">Average Score</div>
            <div className="text-2xl font-black text-indigo-700 mt-1">
              {overview.averageScore}
            </div>
            <div className="text-[11px] text-indigo-500 mt-0.5">out of 100 marks</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm">
            <div className="text-xs font-semibold text-rose-600 uppercase">Focus Alerts</div>
            <div className="text-2xl font-black text-rose-700 mt-1">
              {overview.totalWarnings}
            </div>
            <div className="text-[11px] text-rose-500 mt-0.5">tab switch events</div>
          </div>
        </div>
      )}

      {/* TAB 1: CANDIDATE ATTEMPTS */}
      {activeTab === 'ATTEMPTS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search candidate name or USN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
              >
                <option value="totalScore">Sort by Score</option>
                <option value="name">Sort by Name</option>
                <option value="usn">Sort by USN</option>
                <option value="startedAt">Sort by Date</option>
                <option value="warnings">Sort by Warnings</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">Candidate</th>
                  <th className="px-5 py-3 text-left">USN</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">M1</th>
                  <th className="px-4 py-3 text-center">M2</th>
                  <th className="px-4 py-3 text-center">M3</th>
                  <th className="px-4 py-3 text-center">M4</th>
                  <th className="px-4 py-3 text-center">M5</th>
                  <th className="px-5 py-3 text-right">Total Score</th>
                  <th className="px-5 py-3 text-center">Focus Alerts</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-slate-400">
                      No assessment attempts match the specified query.
                    </td>
                  </tr>
                ) : (
                  attempts.map((att) => {
                    const modScores = [1, 2, 3, 4, 5].map(
                      (m) => att.moduleAttempts?.find((ma: any) => ma.moduleId === m)?.score ?? '-'
                    );

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {att.student.fullName}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-blue-600">
                          {att.student.usn}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              att.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {att.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        {modScores.map((score, i) => (
                          <td key={i} className="px-4 py-3.5 text-center text-xs text-slate-600">
                            {score}
                          </td>
                        ))}
                        <td className="px-5 py-3.5 text-right font-black text-slate-900">
                          {att.totalScore}
                          <span className="text-[11px] font-normal text-slate-400 ml-1">
                            ({att.percentage.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              att.totalWarnings > 0
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {att.totalWarnings}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAttemptDetail(att.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Inspect Detailed Attempt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetAttempt(att.id, att.student.fullName)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition"
                            title="Reset Attempt"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAttempt(att.id, att.student.fullName, att.student.usn)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"
                            title="Delete Candidate from List"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONSOLIDATED REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Consolidated Performance Reports & Data Export
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Download complete cohort assessment records, module breakdowns, percentages, and focus integrity audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 hover:bg-slate-100/60 transition flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-emerald-600 text-white rounded-lg w-fit mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Spreadsheet Report (CSV)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Full student marksheet compatible with Microsoft Excel, Google Sheets, or institutional ERPs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadReport('csv')}
                className="mt-4 inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 hover:bg-slate-100/60 transition flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-blue-600 text-white rounded-lg w-fit mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Official PDF Report</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Formatted university assessment audit transcript with candidate ranks, marks, and proctoring log.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadReport('pdf')}
                className="mt-4 inline-flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Report</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 hover:bg-slate-100/60 transition flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-indigo-600 text-white rounded-lg w-fit mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Word Document (DOCX)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fully editable summary report formatted for departmental meeting minutes and academic reviews.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadReport('docx')}
                className="mt-4 inline-flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download DOCX Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEST CONFIGURATION */}
      {activeTab === 'CONFIG' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Assessment Engine Configuration</h2>
          <p className="text-xs text-slate-500 mb-6">
            Configure examination rules, scoring metrics, time constraints, and USN pattern matching.
          </p>

          {configSavedMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{configSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Assessment Title
              </label>
              <input
                type="text"
                value={config.testTitle}
                onChange={(e) => setConfig({ ...config, testTitle: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Marks per Correct
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={config.marksPerCorrect}
                  onChange={(e) => setConfig({ ...config, marksPerCorrect: parseFloat(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Penalty per Wrong
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={config.negativeMarksPerWrong}
                  onChange={(e) => setConfig({ ...config, negativeMarksPerWrong: parseFloat(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Time Limit / Module (min)
                </label>
                <input
                  type="number"
                  value={config.timeLimitMinutesPerModule}
                  onChange={(e) => setConfig({ ...config, timeLimitMinutesPerModule: parseInt(e.target.value, 10) })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Max Allowed Focus Alerts
                </label>
                <input
                  type="number"
                  value={config.maxFocusWarnings}
                  onChange={(e) => setConfig({ ...config, maxFocusWarnings: parseInt(e.target.value, 10) })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  USN Regex Pattern
                </label>
                <input
                  type="text"
                  value={config.usnRegexPattern}
                  onChange={(e) => setConfig({ ...config, usnRegexPattern: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isTestActive}
                  onChange={(e) => setConfig({ ...config, isTestActive: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-semibold text-slate-800">
                  Assessment Active (Allow new student logins)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.allowAnswerReview}
                  onChange={(e) => setConfig({ ...config, allowAnswerReview: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-semibold text-slate-800">
                  Allow Answer Review (Show correct options & textbook citations on submission)
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow transition"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detailed Attempt Modal */}
      {selectedAttemptId && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base">Candidate Assessment Audit</h3>
                <p className="text-xs text-slate-400">
                  {attemptDetail?.attempt?.student?.fullName} ({attemptDetail?.attempt?.student?.usn})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAttemptId(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loadingDetail ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-xs text-slate-500">Loading audit trail...</p>
                </div>
              ) : (
                <>
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold">Total Score</div>
                      <div className="text-xl font-black text-slate-900">
                        {attemptDetail?.attempt?.totalScore} / 100
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold">Percentage</div>
                      <div className="text-xl font-black text-blue-600">
                        {attemptDetail?.attempt?.percentage?.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold">Status</div>
                      <div className="text-sm font-bold text-slate-800 mt-1">
                        {attemptDetail?.attempt?.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold">Focus Warnings</div>
                      <div className="text-xl font-black text-rose-600">
                        {attemptDetail?.attempt?.totalWarnings}
                      </div>
                    </div>
                  </div>

                  {/* Focus Events Log */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Tab Switch & Focus Anomaly Audit Trail</span>
                    </h4>

                    {attemptDetail?.focusEvents?.length === 0 ? (
                      <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        No window blur or tab-switch anomalies recorded during this attempt.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 text-xs">
                        {attemptDetail?.focusEvents?.map((ev: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between py-1 px-2 border-b border-slate-200/60 last:border-0">
                            <span className="font-mono text-slate-600">
                              {new Date(ev.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="font-semibold text-slate-800">
                              Module {ev.moduleId}: {ev.eventType}
                            </span>
                            <span className="text-slate-500">
                              Away: {(ev.durationAwayMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Question Responses Inspection */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Candidate Responses Breakdown (100 Questions)
                    </h4>
                    <div className="space-y-3 max-h-72 overflow-y-auto border border-slate-200 rounded-xl p-3">
                      {attemptDetail?.questions?.map((q: any) => (
                        <div
                          key={q.questionId}
                          className={`p-3 rounded-lg border text-xs ${
                            q.isCorrect
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : q.selectedOption === null
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-700">
                              M{q.moduleId} Q{q.questionNumber}: {q.question.substring(0, 75)}...
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold ${
                                q.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : q.selectedOption === null
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {q.isCorrect
                                ? 'Correct (+1)'
                                : q.selectedOption === null
                                ? 'Unanswered'
                                : 'Wrong (0)'}
                            </span>
                          </div>
                          <div className="text-slate-600 space-x-3">
                            <span>
                              Selected:{' '}
                              <strong className={q.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                                {q.selectedOption || 'None'}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Official Key: <strong>{q.correctAnswer}</strong>
                            </span>
                            <span>•</span>
                            <span className="text-slate-500">
                              {q.chapterReference} (p. {q.pageReference})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() =>
                    handleResetAttempt(
                      attemptDetail?.attempt?.id,
                      attemptDetail?.attempt?.student?.fullName
                    )
                  }
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Attempt</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteAttempt(
                      attemptDetail?.attempt?.id,
                      attemptDetail?.attempt?.student?.fullName,
                      attemptDetail?.attempt?.student?.usn
                    )
                  }
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Candidate</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAttemptId(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
