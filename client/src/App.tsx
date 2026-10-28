import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StudentLogin } from './pages/StudentLogin';
import { TestInstructions } from './pages/TestInstructions';
import { ActiveTest } from './pages/ActiveTest';
import { FinalResults } from './pages/FinalResults';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { DownloadCentre } from './pages/DownloadCentre';
import { PetPlayBackground } from './components/PetPlayBackground';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden">
        {/* Real Dog & Cat Running & Playing in the Page Background */}
        <PetPlayBackground />

        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<StudentLogin />} />
            <Route path="/instructions" element={<TestInstructions />} />
            <Route path="/test" element={<ActiveTest />} />
            <Route path="/results" element={<FinalResults />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/downloads" element={<DownloadCentre />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
