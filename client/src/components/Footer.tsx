import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/95 text-slate-200 border-t border-slate-700/80 mt-auto transition-colors relative z-20 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          {/* Brand & Academic Meta */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-black text-sm sm:text-base tracking-wider text-white">
                RM & IPR ASSESSMENT SYSTEM
              </span>
              <span className="text-[11px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                VTU BRMK557
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg font-medium leading-relaxed">
              Visvesvaraya Technological University • Research Methodology & Intellectual Property Rights
            </p>
          </div>

          {/* Creator Attribution & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-200 bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl shadow-md">
              <span className="text-slate-300 font-medium">Developed by</span>
              <strong className="text-amber-400 font-black text-sm tracking-wide">Jagadish S</strong>
            </div>

            <div className="flex items-center space-x-2.5">
              <Link
                to="/admin/login"
                className="flex items-center space-x-1.5 text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 px-3.5 py-2 rounded-xl font-bold transition shadow-sm active:scale-95"
                title="Examiner & Administrator Portal"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Admin Login</span>
              </Link>

              <a
                href="https://github.com/Jagadish-03S"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3.5 py-2 rounded-xl font-bold transition shadow-sm active:scale-95"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4 text-white" />
                <span>GitHub</span>
              </a>

              <a
                href="mailto:sjgadish89772@gmail.com"
                className="flex items-center space-x-1.5 text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 px-3.5 py-2 rounded-xl font-bold transition shadow-md shadow-blue-900/40 active:scale-95"
                title="Contact Developer"
              >
                <Mail className="w-4 h-4 text-white" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 font-medium gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} RM & IPR Educational Testing Portal. Prescribed Textbook BRMK557.</p>
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100 MCQs Verified</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-blue-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proctoring Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
