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
    <header className="bg-slate-950 text-white shadow-lg border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to={isAdminRoute ? '/admin/dashboard' : '/'}
          className="flex items-center space-x-3 group"
        >
          <div className="bg-gradient-to-tr from-blue-700 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-400 transition-all p-2 rounded-xl text-white shadow-md shadow-blue-900/30">
            {isAdminRoute ? <ShieldCheck className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-wide flex items-center space-x-2">
              <span className="text-white">
                {isAdminRoute ? 'EXAMINER PORTAL' : 'RM & IPR ASSESSMENT'}
              </span>
              <span className="text-[10px] font-mono bg-blue-900/90 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700/60 font-semibold">
                VTU BRMK557
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Research Methodology & Intellectual Property Rights
            </p>
          </div>
        </Link>

        {/* User Badges & Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Prescribed Textbook Quick Reference Button (Student Portal Only) */}
          {!isAdminRoute && (
            <a
              href="/api/downloads/textbook?inline=true"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
              title="Read Prescribed Textbook in New Tab"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Refer Textbook (PDF)</span>
            </a>
          )}

          {/* Student Status Badge (Only on student side when logged in) */}
          {!isAdminRoute && studentName && (
            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-200 truncate max-w-[140px] sm:max-w-none">
                  {studentName}
                </p>
                <p className="text-[11px] font-mono text-blue-400 font-semibold">{studentUsn}</p>
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
