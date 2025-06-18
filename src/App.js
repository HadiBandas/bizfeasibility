import React from 'react';
import useWizardStore from './context/useWizardStore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import HeroScene from './components/HeroScene';
import RegistrationForm from './components/RegistrationForm';
import AuthGuard from './components/AuthGuard';

// --- ICONS ---
const ProgressIcon = ({ isActive, isCompleted }) => {
  if (isCompleted) {
    return (
      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <div className={`w-6 h-6 rounded-full border-2 ${isActive ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>
      {isActive && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>}
    </div>
  );
};

// --- UI COMPONENTS ---
const ProgressBar = () => {
    const currentStep = useWizardStore((state) => state.currentStep);
    const progress = (currentStep - 1) / 3 * 100;

    const steps = [
        { num: 1, label: 'Ide' }, 
        { num: 2, label: 'Riset' }, 
        { num: 3, label: 'Keuangan' }, 
        { num: 4, label: 'Laporan' }
    ];

    return (
        <div className="mb-8">
            <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2">
                {steps.map(({ num, label }) => (
                    <div key={num} className="flex-1 text-center">
                        <div className={`text-xs font-semibold ${currentStep >= num ? 'text-green-600' : 'text-gray-500'}`}>
                            {label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SCREENS ---
import IdeBisnisScreen from './screens/wizard/IdeBisnisScreen';
import RisetPasarScreen from './screens/wizard/RisetPasarScreen';
import KeuanganScreen from './screens/wizard/KeuanganScreen';
import LaporanScreen from './screens/wizard/LaporanScreen';

// --- MAIN APP COMPONENT ---
export default function App() {
  const currentStep = useWizardStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <IdeBisnisScreen />;
      case 2: return <RisetPasarScreen />;
      case 3: return <KeuanganScreen />;
      case 4: return <LaporanScreen />;
      default: return <IdeBisnisScreen />;
    }
  };

  const handleStartAnalysis = () => {
    // Navigate to registration when "Mulai Analisis" is clicked
    window.location.href = '/register';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/hero-demo" element={
          <HeroScene onStartAnalysis={handleStartAnalysis} />
        } />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/wizard" element={
          <AuthGuard>
            <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex items-center justify-center p-4">
              <main className="w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-10">
                  <header className="text-center mb-6 border-b pb-4">
                    <h1 className="text-xl font-bold text-green-600">BizFeasibility Pro</h1>
                    <p className="text-sm text-gray-500">Analisis Kelayakan Bisnis dalam Genggaman</p>
                  </header>
                  <ProgressBar />
                  {renderStep()}
                </div>
                <footer className="text-center mt-6 text-xs text-gray-400">
                  <p>&copy; 2025 Mahasin Hadiyatulloh <br/> BizFeasibility App</p>
                </footer>
              </main>
            </div>
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
} 
