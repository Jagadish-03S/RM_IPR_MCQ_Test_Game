import React from 'react';
import { Github, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Academic Meta */}
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-bold text-sm tracking-wider text-slate-200">
                RM & IPR ASSESSMENT ENGINE
              </span>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800/60 font-semibold">
                BRMK557
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Visvesvaraya Technological University (VTU) • Research Methodology & Intellectual Property Rights
            </p>
          </div>

          {/* Creator Attribution & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner">
              <span className="text-slate-500">Designed & Developed by</span>
              <strong className="text-blue-400 font-semibold tracking-wide">Jagadish S</strong>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/sjaga"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition"
                title="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub</span>
              </a>

              <a
                href="mailto:sjagadish89772@gmail.com"
                className="flex items-center space-x-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition"
                title="Contact Developer"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <p>© {new Date().getFullYear()} RM & IPR Assessment Platform. Derived strictly from prescribed textbook BRMK557.</p>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>All 100 MCQs Textbook Verified</span>
            <span>•</span>
            <span>Academic Integrity Proctoring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
