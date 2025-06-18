import React from 'react';
import useWizardStore from '../../context/useWizardStore';
import { exportToExcel } from '../../utils/exportToExcel';

// --- ICONS (Inline SVG for portability) ---
const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
);

const PdfIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10,9 9,9 8,9"></polyline>
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const ExportButtons = () => {
    const { ideBisnis, risetPasar, keuangan, laporan, actions } = useWizardStore(state => ({
        ideBisnis: state.ideBisnis,
        risetPasar: state.risetPasar,
        keuangan: state.keuangan,
        laporan: state.laporan,
        actions: state.actions,
    }));

    const handleExcelExport = () => {
        const allData = { ideBisnis, risetPasar, keuangan };
        exportToExcel(allData);
    };

    const handlePdfExport = () => {
        actions.generateAndUploadPdf();
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Export Laporan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Excel Export */}
                <button
                    onClick={handleExcelExport}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <ExcelIcon />
                    <span>Export ke Excel</span>
                </button>

                {/* PDF Export */}
                <button
                    onClick={handlePdfExport}
                    disabled={laporan.isGenerating}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PdfIcon />
                    <span>{laporan.isGenerating ? 'Membuat PDF...' : 'Export ke PDF'}</span>
                </button>
            </div>

            {/* Download Link */}
            {laporan.pdfUrl && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <DownloadIcon />
                        <span className="font-medium text-green-800">PDF berhasil dibuat!</span>
                    </div>
                    <a 
                        href={laporan.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 underline text-sm mt-1 inline-block"
                    >
                        Download Laporan PDF
                    </a>
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    <strong>Excel:</strong> Data lengkap dalam format spreadsheet untuk analisis lanjutan.<br/>
                    <strong>PDF:</strong> Laporan profesional siap presentasi ke investor atau bank.
                </p>
            </div>
        </div>
    );
}; 