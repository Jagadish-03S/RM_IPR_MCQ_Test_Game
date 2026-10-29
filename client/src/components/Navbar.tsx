import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ShieldCheck, LogOut, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const studentName = localStorage.getItem('rm_ipr_student_name');
  const studentUsn = localStorage.getItem('rm_ipr_student_usn');
  const adminToken = localStorage.getItem('rm_ipr_admin_token');

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isTestActivePage = location.pathname === '/test';

  const handleStudentLogout = () => {
    if (isTestActivePage) {
      if (
        !window.confirm(
          'Are you sure you want to exit? Your answered questions are saved, but your module timer may continue.'
        )
      ) {
        return;
      }
    }
    localStorage.removeItem('rm_ipr_student_session');
    localStorage.removeItem('rm_ipr_student_name');
    localStorage.removeItem('rm_ipr_student_usn');
    navigate('/');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('rm_ipr_admin_token');
    localStorage.removeItem('rm_ipr_admin_name');
    navigate('/admin/login');
  };

  return (
    <header className="bg-slate-950/95 text-white shadow-lg border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to={isAdminRoute ? '/admin/dashboard' : '/'}
          className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0"
        >
          <div className="bg-gradient-to-tr from-blue-700 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-400 transition-all p-1.5 sm:p-2 rounded-xl text-white shadow-md shadow-blue-900/30 shrink-0">
            {isAdminRoute ? <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" /> : <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-base tracking-wide flex items-center space-x-1.5 sm:space-x-2 truncate">
              <span className="text-white truncate">
                {isAdminRoute ? 'EXAMINER' : 'RM & IPR'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono bg-blue-900/90 text-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-700/60 font-semibold shrink-0">
                BRMK557
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block truncate">
              Research Methodology & Intellectual Property Rights
            </p>
          </div>
        </Link>

        {/* User Badges & Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {/* Admin Portal Direct Link for Examiners */}
          {!isAdminRoute && (
            <Link
              to="/admin/login"
              className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-indigo-300 hover:text-white bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-700/60 px-2.5 sm:px-3 py-1.5 rounded-lg transition font-semibold shadow-sm"
              title="Examiner & Administrator Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Student Portal Link when in Admin route */}
          {isAdminRoute && (
            <Link
              to="/"
              className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-blue-300 hover:text-white bg-blue-950/70 hover:bg-blue-900/90 border border-blue-700/60 px-2.5 sm:px-3 py-1.5 rounded-lg transition font-semibold shadow-sm"
              title="Return to Student Portal"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>Student Portal</span>
            </Link>
          )}

          {/* Prescribed Textbook Quick Reference Button (Student Portal Only) */}
          {!isAdminRoute && (
            <a
              href="/api/downloads/textbook?inline=true"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 text-[11px] sm:text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
              title="Read Prescribed Textbook in New Tab"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Textbook PDF</span>
            </a>
          )}

          {/* Student Status Badge (Only on student side when logged in) */}
          {!isAdminRoute && studentName && (
            <div className="flex items-center space-x-2 sm:space-x-3 border-l border-slate-800 pl-2 sm:pl-4">
              <div className="text-right">
                <p className="text-[11px] sm:text-xs font-bold text-slate-200 truncate max-w-[85px] sm:max-w-[140px]">
                  {studentName}
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono text-blue-400 font-semibold truncate max-w-[85px] sm:max-w-none">
                  {studentUsn}
                </p>
              </div>
              <button
                type="button"
                onClick={handleStudentLogout}
                title="Exit Session"
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Admin Status Badge (Only on admin side when logged in) */}
          {isAdminRoute && adminToken && (
            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
              <span className="hidden sm:inline-block text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/60">
                Administrator Authenticated
              </span>
              <button
                type="button"
                onClick={handleAdminLogout}
                title="Admin Sign Out"
                className="flex items-center space-x-1 text-xs text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900 px-2.5 py-1.5 rounded-lg border border-rose-900 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
