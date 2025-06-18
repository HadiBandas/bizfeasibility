import React from 'react';
import useWizardStore from '../../context/useWizardStore';
import { userService } from '../../utils/userService';

// --- ICONS ---
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// --- UI COMPONENTS ---
const Button = ({ children, onClick, disabled, variant = 'primary', className = '', icon }) => {
    const baseClasses = 'w-full py-3 px-6 rounded-lg text-center font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
    const variantClasses = {
        primary: `bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 ${disabled ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`,
        secondary: `bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        gemini: `bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 focus:ring-purple-500 ${disabled ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`,
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

// --- Komponen Baru ---
import { ExportButtons } from '../../components/Export/ExportButtons';
import { FeasibilityConclusion } from '../../components/Finance/FeasibilityConclusion';
import AIAnalysisDisplay from '../../components/Finance/AIAnalysisDisplay';

const LaporanScreen = () => {
    const { ideBisnis, risetPasar, keuangan, laporan, uiState, actions } = useWizardStore();
    const [saveStatus, setSaveStatus] = React.useState(null);
    
    const handleAnalyzeAndSave = async () => {
        // Ambil data user dari localStorage
        const user = userService.getUserData();
        if (!user || !user.email) {
            setSaveStatus('Gagal: Data user tidak ditemukan.');
            return;
        }
        // Gabungkan semua data
        const reportData = {
            user: {
                nama: user.nama,
                email: user.email,
                phone: user.phone,
                domisili: user.domisili,
                userId: user.userId || null
            },
            ideBisnis,
            risetPasar,
            keuangan
        };
        // Simpan ke Firestore
        const result = await userService.saveFullReport(user.email, reportData);
        if (result.success) {
            setSaveStatus('Data berhasil disimpan!');
        } else {
            setSaveStatus('Gagal menyimpan data: ' + (result.error?.message || JSON.stringify(result.error)));
        }
        // Lanjutkan analisis AI
        actions.analyzeReportWithAI();
    };

    const DataPill = ({label, value}) => (
        <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Ringkasan Laporan Kelayakan</h2>
                <p className="text-gray-500 mt-1">Langkah 4 dari 4 • Semua data Anda dalam satu tampilan.</p>
            </div>

            {/* Kesimpulan Kelayakan */}
            <FeasibilityConclusion />

            {/* Ringkasan Data */}
            <div className="space-y-6 bg-white p-6 border rounded-lg">
                <div>
                    <h3 className="text-xl font-bold mb-3">1. Ide Bisnis</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DataPill label="Nama Bisnis" value={ideBisnis.nama} />
                        <DataPill label="Kategori" value={ideBisnis.kategori} />
                        <div className="sm:col-span-2">
                            <DataPill label="Deskripsi" value={ideBisnis.deskripsi} />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">2. Riset Pasar</h3>
                     <DataPill label="Target Pasar" value={risetPasar.target} />
                     <div className="mt-4">
                        <h4 className="font-semibold mb-2">Kompetitor:</h4>
                        <ul className="list-disc list-inside space-y-2">
                            {risetPasar.kompetitor.map(k => (
                                <li key={k.id}>{k.nama} (Keunggulan: {k.keunggulan})</li>
                            ))}
                        </ul>
                     </div>
                     {risetPasar.aiAnalysis && (
                        <div className="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                            <h4 className="font-bold text-purple-800">Analisis dari AI ✨</h4>
                            <p className="text-purple-700 whitespace-pre-wrap mt-2">{risetPasar.aiAnalysis}</p>
                        </div>
                     )}
                </div>
                 <div>
                    <h3 className="text-xl font-bold mb-3">3. Proyeksi Keuangan</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <DataPill label="Modal Awal" value={keuangan.metrics && keuangan.metrics.totalFixedCosts !== undefined ? `Rp ${Number(keuangan.metrics.totalFixedCosts).toLocaleString('id-ID')}` : '-'} />
                        <DataPill label="Harga Jual" value={keuangan.metrics && keuangan.metrics.totalVariableCostPerUnit !== undefined ? `Rp ${Number(keuangan.metrics.totalVariableCostPerUnit).toLocaleString('id-ID')}` : '-'} />
                        <DataPill label="Volume/Bulan" value={keuangan.metrics && keuangan.metrics.monthlyRevenue !== undefined ? Number(keuangan.metrics.monthlyRevenue).toLocaleString('id-ID') : '-'} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <DataPill label="ROI" value={keuangan.metrics && keuangan.metrics.roi !== undefined ? `${keuangan.metrics.roi.toFixed(2)}%` : '-'} />
                        <DataPill label="Payback Period" value={keuangan.metrics && keuangan.metrics.paybackPeriod !== undefined ? `${keuangan.metrics.paybackPeriod.toFixed(1)} tahun` : '-'} />
                        <DataPill label="IRR" value={keuangan.metrics && keuangan.metrics.irr !== undefined ? `${keuangan.metrics.irr.toFixed(2)}%` : '-'} />
                        <DataPill label="BEP" value={keuangan.metrics && keuangan.metrics.bepUnits !== undefined ? `${Math.ceil(keuangan.metrics.bepUnits)} unit/bulan` : '-'} />
                    </div>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-white p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-4">Analisis AI Komprehensif</h3>
                <p className="text-gray-600 mb-4">Dapatkan analisis mendalam dari AI tentang kelayakan bisnis Anda berdasarkan semua data yang telah diinput.</p>
                
                <Button 
                    onClick={handleAnalyzeAndSave} 
                    disabled={uiState.isAnalyzingReport} 
                    variant="gemini" 
                    icon={<SparklesIcon/>}
                >
                    {uiState.isAnalyzingReport ? 'Menganalisis...' : '✨ Analisis Result dengan AI'}
                </Button>

                {saveStatus && (
                    <div className={`mt-2 text-sm ${saveStatus.startsWith('Gagal') ? 'text-red-600' : 'text-green-600'}`}>{saveStatus}</div>
                )}

                {uiState.isAnalyzingReport && (
                    <div className="text-center text-gray-500 mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                        Menganalisis data bisnis Anda...
                    </div>
                )}
                
                {/* AI Analysis Display */}
                {laporan.aiAnalysis && (
                    <div className="mt-6">
                        <AIAnalysisDisplay analysis={laporan.aiAnalysis} />
                    </div>
                )}
            </div>

            {/* Export Buttons */}
            <ExportButtons />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={actions.prevStep} variant="secondary" icon={<ArrowLeftIcon/>}>Kembali</Button>
                <Button onClick={actions.resetWizard} variant="secondary">Mulai Proyek Baru</Button>
            </div>
        </div>
    );
};

export default LaporanScreen; 