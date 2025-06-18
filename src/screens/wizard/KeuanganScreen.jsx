import React, { useEffect } from 'react';
import useWizardStore from '../../context/useWizardStore';
import { calculateAllMetrics } from '../../utils/financeCalculations';

// --- ICONS ---
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// --- UI COMPONENTS ---
const Input = ({ label, tooltip, value, onChange, placeholder, type = 'text', maxLength, ...props }) => (
    <div>
        <div className="flex items-center mb-2">
            <label className="text-base font-medium text-gray-700">{label}</label>
            {tooltip && (
                <div className="relative group flex items-center">
                    <span className="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        {tooltip}
                    </div>
                </div>
            )}
        </div>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            {...props}
        />
        {maxLength && <p className="text-xs text-right text-gray-500 mt-1">{String(value || '').length}/{maxLength}</p>}
    </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', className = '', icon }) => {
    const baseClasses = 'w-full py-3 px-6 rounded-lg text-center font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
    const variantClasses = {
        primary: `bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 ${disabled ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`,
        secondary: `bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

// --- Komponen Baru ---
import { OperationalCosts } from '../../components/Finance/OperationalCosts';
import { KeuanganCalculatorPro } from '../../components/Finance/KeuanganCalculatorPro';
import { ScenarioSimulator } from '../../components/Finance/ScenarioSimulator';
import { FeasibilityConclusion } from '../../components/Finance/FeasibilityConclusion';

const KeuanganScreen = () => {
    const { keuangan, ideBisnis, actions } = useWizardStore();
    
    // [LOGIC UTAMA] Lakukan kalkulasi setiap kali ada perubahan data
    useEffect(() => {
        const allData = { ...keuangan, industryKey: ideBisnis.industryKey };
        const newMetrics = calculateAllMetrics(allData);
        // Hanya update jika metrics benar-benar berubah
        const isDifferent = JSON.stringify(newMetrics) !== JSON.stringify(keuangan.metrics);
        if (isDifferent) {
            actions.updateFinancialMetrics(newMetrics);
        }
        // eslint-disable-next-line
    }, [keuangan.modal, keuangan.hargaJual, keuangan.volume, keuangan.operasional, keuangan.scenario, ideBisnis.industryKey]);

    const handleNext = () => { if (actions.validateStep(3)) { actions.autoSave(); actions.nextStep(); } };
    const handleNumericInput = (field, value) => { 
        const numericValue = value.replace(/[^0-9]/g, ''); 
        actions.updateData('keuangan', { [field]: numericValue }); 
    };

    return (
         <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Proyeksi Keuangan</h2>
                <p className="text-gray-500 mt-1">Langkah 3 dari 4 • Mari kita hitung potensi keuntungan Anda.</p>
            </div>
            
            {/* Bagian Input Utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                    label="Modal Awal (Rp)" 
                    tooltip="Total biaya yang Anda butuhkan untuk memulai bisnis."
                    placeholder="Contoh: 5000000" 
                    value={keuangan.modal} 
                    onChange={(e) => handleNumericInput('modal', e.target.value)}
                />
                <Input 
                    label="Harga Jual per Unit (Rp)" 
                    tooltip="Harga jual rata-rata satu produk/jasa Anda."
                    placeholder="Contoh: 20000" 
                    value={keuangan.hargaJual} 
                    onChange={(e) => handleNumericInput('hargaJual', e.target.value)}
                />
                <Input 
                    label="Target Volume Penjualan / Bulan" 
                    tooltip="Berapa banyak produk/jasa yang Anda targetkan terjual dalam sebulan?"
                    placeholder="Contoh: 250" 
                    value={keuangan.volume} 
                    onChange={(e) => handleNumericInput('volume', e.target.value)}
                />
            </div>

            {/* Modul Biaya Operasional */}
            <OperationalCosts />
            
            {/* Kalkulator & Metrik Lanjutan */}
            <KeuanganCalculatorPro />
            
            {/* Simulator What-If */}
            <ScenarioSimulator />
            
            {/* Kesimpulan Kelayakan */}
            <FeasibilityConclusion />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={actions.prevStep} variant="secondary" icon={<ArrowLeftIcon/>}>Kembali</Button>
                <Button onClick={handleNext} disabled={!actions.validateStep(3)} icon={<ArrowRightIcon/>}>Lanjut ke Laporan</Button>
            </div>
        </div>
    );
};

export default KeuanganScreen; 