import React from 'react';
import useWizardStore from '../../context/useWizardStore';

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

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3zM22 12l-2.8 1-1 2.8 1 2.8 2.8 1 2.8-1 1-2.8-1-2.8-2.8-1zM3 12l-2.8 1-1 2.8 1 2.8 2.8 1 2.8-1 1-2.8-1-2.8-2.8-1z" />
    </svg>
);

// --- UI COMPONENTS ---
const Tooltip = ({ text, children }) => (
    <div className="relative group flex items-center">
        {children}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            {text}
        </div>
    </div>
);

const Input = ({ label, tooltip, value, onChange, placeholder, type = 'text', maxLength, ...props }) => (
    <div>
        <div className="flex items-center mb-2">
            <label className="text-base font-medium text-gray-700">{label}</label>
            {tooltip && (
                <Tooltip text={tooltip}>
                    <span className="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </span>
                </Tooltip>
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

const Textarea = ({ label, tooltip, value, onChange, placeholder, maxLength, rows=4 }) => (
    <div>
        <div className="flex items-center mb-2">
            <label className="text-base font-medium text-gray-700">{label}</label>
            {tooltip && (
                <Tooltip text={tooltip}>
                     <span className="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                     </span>
                </Tooltip>
            )}
        </div>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
        {maxLength && <p className="text-xs text-right text-gray-500 mt-1">{String(value || '').length}/{maxLength}</p>}
    </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', className = '', icon }) => {
    const baseClasses = 'w-full py-3 px-6 rounded-lg text-center font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
    const variantClasses = {
        primary: `bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 ${disabled ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`,
        secondary: `bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        gemini: `bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 focus:ring-indigo-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

const RisetPasarScreen = () => {
    const { risetPasar, uiState, actions } = useWizardStore();
    
    const handleNext = () => { if (actions.validateStep(2)) { actions.autoSave(); actions.nextStep(); } };
    
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Analisis Pasar & Kompetitor</h2>
                <p className="text-gray-500 mt-1">Langkah 2 dari 4 • Siapa target Anda dan siapa pesaing Anda?</p>
            </div>
            <div className="space-y-6">
                <Textarea 
                    label="Target Pasar" 
                    tooltip="Jelaskan siapa calon pelanggan utama Anda. (Contoh: Mahasiswa, pekerja kantoran, ibu rumah tangga)" 
                    placeholder="Contoh: Mahasiswa di sekitar kampus Telkom University dan pekerja kantoran di area perkantoran Sudirman." 
                    value={risetPasar.target} 
                    onChange={(e) => actions.updateData('risetPasar', { target: e.target.value })} 
                    maxLength={200}
                />
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-medium text-gray-700">Analisis Kompetitor</h3>
                        <Tooltip text="Sebutkan minimal 1 pesaing utama Anda.">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </span>
                        </Tooltip>
                    </div>
                    <div className="space-y-4">
                       {risetPasar.kompetitor.map((k, index) => (
                           <div key={k.id} className="bg-white p-4 border rounded-lg space-y-3 relative">
                               <button 
                                   onClick={() => actions.removeKompetitor(index)} 
                                   className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full"
                                   title="Hapus kompetitor"
                               >
                                   <TrashIcon/>
                               </button>
                               <Input 
                                   label={`Nama Kompetitor ${index+1}`} 
                                   value={k.nama} 
                                   onChange={e => actions.updateKompetitor(index, 'nama', e.target.value)} 
                                   placeholder="Contoh: Kopi Kenangan"
                               />
                               <Input 
                                   label="Keunggulan Mereka" 
                                   value={k.keunggulan} 
                                   onChange={e => actions.updateKompetitor(index, 'keunggulan', e.target.value)} 
                                   placeholder="Contoh: Banyak cabang, harga murah"
                               />
                               <Input 
                                   label="Estimasi Harga Jual Mereka" 
                                   type="number" 
                                   value={k.harga} 
                                   onChange={e => actions.updateKompetitor(index, 'harga', e.target.value)} 
                                   placeholder="Contoh: 20000"
                               />
                           </div>
                       ))}
                       <Button onClick={actions.addKompetitor} variant="secondary">+ Tambah Kompetitor</Button>
                    </div>
                </div>
                 <Button 
                    onClick={actions.analyzeCompetitors} 
                    disabled={risetPasar.kompetitor.length === 0 || uiState.isAnalyzingCompetitors} 
                    variant="gemini" 
                    icon={<SparklesIcon/>}
                >
                    {uiState.isAnalyzingCompetitors ? 'Menganalisis...' : '✨ Analisis Kompetitor Saya'}
                 </Button>

                {uiState.isAnalyzingCompetitors && <div className="text-center text-gray-500">Menganalisis...</div>}
                
                {risetPasar.aiAnalysis && (
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-purple-800">Analisis dari AI ✨</h4>
                        <p className="text-purple-700 whitespace-pre-wrap mt-2">{risetPasar.aiAnalysis}</p>
                    </div>
                )}

            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={actions.prevStep} variant="secondary" icon={<ArrowLeftIcon/>}>Kembali</Button>
                <Button onClick={handleNext} disabled={!actions.validateStep(2)} icon={<ArrowRightIcon/>}>Lanjut ke Keuangan</Button>
            </div>
        </div>
    );
};

export default RisetPasarScreen; 