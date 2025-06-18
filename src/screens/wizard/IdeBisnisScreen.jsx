import React, { useState, useEffect } from 'react';
import useWizardStore from '../../context/useWizardStore';
import { INDUSTRY_TEMPLATES } from '../../constants/industryTemplates';

// --- ICONS (Inline SVG for portability) ---
const HelpCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3zM22 12l-2.8 1-1 2.8 1 2.8 2.8 1 2.8-1 1-2.8-1-2.8-2.8-1zM3 12l-2.8 1-1 2.8 1 2.8 2.8 1 2.8-1 1-2.8-1-2.8-2.8-1z" />
    </svg>
);

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
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
                    <span className="ml-2"><HelpCircleIcon /></span>
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
                     <span className="ml-2"><HelpCircleIcon /></span>
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

const Select = ({ label, tooltip, value, onChange, children }) => (
     <div>
        <div className="flex items-center mb-2">
            <label className="text-base font-medium text-gray-700">{label}</label>
            {tooltip && (
                <Tooltip text={tooltip}>
                    <span className="ml-2"><HelpCircleIcon /></span>
                </Tooltip>
            )}
        </div>
        <div className="relative">
             <select
                value={value}
                onChange={onChange}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
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

const JanganPusingModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full animate-fade-in-up">
                <div className="flex items-center mb-4"><AlertTriangleIcon /><h2 className="text-xl font-bold ml-2">Butuh Bantuan?</h2></div>
                <p className="text-gray-600 mb-6">Sepertinya Anda sedikit bingung. Apakah Anda ingin melihat contoh studi kasus "Warung Kopi Sederhana" untuk mendapatkan inspirasi?</p>
                <div className="flex justify-end space-x-3">
                    <Button onClick={onClose} variant="secondary">Nanti Saja</Button>
                    <Button onClick={onConfirm}>Ya, Tampilkan</Button>
                </div>
            </div>
        </div>
    );
};

const IdeBisnisScreen = () => {
    const { ideBisnis, uiState, actions } = useWizardStore();
    
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (actions.checkInactivity() && !ideBisnis.nama) { setShowModal(true); }
        }, 120000);
        return () => clearTimeout(timer);
    }, [ideBisnis.nama, actions.checkInactivity]);

    const handleNext = () => { if (actions.validateStep(1)) { actions.autoSave(); actions.nextStep(); } };
    
    // Buat opsi dari konstanta baru
    const KATEGORI_INDUSTRI = Object.entries(INDUSTRY_TEMPLATES).map(([key, value]) => ({
        label: value.nama,
        value: key,
    }));

    const handleCategoryChange = (e) => {
        const newIndustryKey = e.target.value;
        actions.updateData('ideBisnis', { 
            kategori: INDUSTRY_TEMPLATES[newIndustryKey]?.nama || '', 
            industryKey: newIndustryKey 
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <JanganPusingModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => { actions.loadContoh(); setShowModal(false); }}/>
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Ceritakan Ide Bisnis Anda</h2>
                <p className="text-gray-500 mt-1">Langkah 1 dari 4 • Jangan overthinking, cukup tulis yang terlintas.</p>
            </div>
            <div className="space-y-4">
                 <Select 
                    label="Pilih Industri Bisnis" 
                    tooltip="Pilih industri yang paling sesuai dengan ide bisnis Anda untuk mendapatkan benchmark yang tepat."
                    value={ideBisnis.industryKey} 
                    onChange={handleCategoryChange}
                >
                    <option value="">Pilih Industri</option>
                    {KATEGORI_INDUSTRI.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                </Select>
                 <Button 
                    onClick={actions.generateBusinessIdea} 
                    disabled={!ideBisnis.kategori || uiState.isGeneratingIdea} 
                    variant="gemini" 
                    icon={<SparklesIcon/>}
                >
                    {uiState.isGeneratingIdea ? 'Mencari ide...' : '✨ Beri Saya Ide Nama & Deskripsi'}
                 </Button>
                <Input 
                    label="Nama Bisnis" 
                    tooltip="Nama yang mudah diingat dan menggambarkan bisnis Anda." 
                    placeholder="Contoh: Roti Unik Durian" 
                    value={ideBisnis.nama} 
                    onChange={(e) => actions.updateData('ideBisnis', { nama: e.target.value })} 
                    maxLength={50}
                />
                <Textarea 
                    label="Deskripsi Singkat" 
                    tooltip="Jelaskan produk/jasa, target customer, dan keunikan bisnis Anda dalam 1-2 kalimat." 
                    placeholder="Contoh: Kami menjual roti dengan rasa durian asli Medan, menargetkan ibu-ibu dan anak muda." 
                    value={ideBisnis.deskripsi} 
                    onChange={(e) => actions.updateData('ideBisnis', { deskripsi: e.target.value })} 
                    maxLength={250} 
                    rows={5}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={actions.loadContoh} variant="secondary">Lihat Contoh</Button>
                <Button onClick={handleNext} disabled={!actions.validateStep(1)} icon={<ArrowRightIcon/>}>Lanjut ke Riset Pasar</Button>
            </div>
        </div>
    );
};

export default IdeBisnisScreen; 