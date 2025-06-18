import * as XLSX from 'xlsx';

/**
 * Meng-export data kelayakan bisnis ke file Excel (.xlsx).
 * @param {object} allData - Objek lengkap dari state Zustand (ideBisnis, risetPasar, keuangan).
 */
export const exportToExcel = (allData) => {
    const { ideBisnis, risetPasar, keuangan } = allData;
    const { metrics } = keuangan;

    // Sheet 1: Ringkasan
    const summaryData = [
        ["Nama Proyek", ideBisnis.nama],
        ["Industri", ideBisnis.kategori],
        ["Deskripsi", ideBisnis.deskripsi],
        [], // Baris kosong
        ["KESIMPULAN METRIK"],
        ["ROI", `${metrics.roi?.toFixed(2) || 0}%`],
        ["Payback Period", `${metrics.paybackPeriod?.toFixed(1) || 0} tahun`],
        ["IRR", `${metrics.irr?.toFixed(2) || 0}%`],
        ["BEP", `${Math.ceil(metrics.bepUnits || 0)} unit/bulan`],
        ["Gross Margin", `${metrics.grossMargin?.toFixed(2) || 0}%`],
        ["Net Margin", `${metrics.netMargin?.toFixed(2) || 0}%`],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

    // Sheet 2: Detail Keuangan
    const financeData = [
        ["MODAL & PENDAPATAN"],
        ["Modal Awal", keuangan.modal],
        ["Harga Jual / Unit", keuangan.hargaJual],
        ["Volume / Bulan", keuangan.volume],
        [],
        ["BIAYA TETAP / BULAN"],
        ...(keuangan.operasional?.tetap || []).map(cost => [cost.nama, cost.jumlah]),
        ["Total Biaya Tetap", metrics.totalFixedCosts || 0],
        [],
        ["BIAYA VARIABEL / UNIT"],
        ...(keuangan.operasional?.variabel || []).map(cost => [cost.nama, cost.perUnit]),
        ["Total Biaya Variabel / Unit", metrics.totalVariableCostPerUnit || 0],
    ];
    const financeWs = XLSX.utils.aoa_to_sheet(financeData);

    // Sheet 3: Riset Pasar
    const marketData = [
        ["TARGET PASAR"],
        ["Deskripsi Target", risetPasar.target],
        [],
        ["KOMPETITOR"],
        ["Nama", "Keunggulan", "Estimasi Harga"],
        ...(risetPasar.kompetitor || []).map(k => [k.nama, k.keunggulan, k.harga]),
        [],
        ["ANALISIS AI"],
        [risetPasar.aiAnalysis || "Belum dianalisis"],
    ];
    const marketWs = XLSX.utils.aoa_to_sheet(marketData);
    
    // Buat Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");
    XLSX.utils.book_append_sheet(wb, financeWs, "Detail Keuangan");
    XLSX.utils.book_append_sheet(wb, marketWs, "Riset Pasar");

    // Unduh file
    XLSX.writeFile(wb, `Laporan Kelayakan - ${ideBisnis.nama || 'Proyek'}.xlsx`);
}; 