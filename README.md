# BizFeasibility Pro 🚀

Aplikasi analisis kelayakan bisnis profesional dengan fitur keuangan lengkap, dibangun menggunakan React, Zustand, dan Gemini AI.

## ✨ Fitur Utama

### 🏭 Template Kelayakan Industri
- **8 Industri**: Makanan & Minuman, Fashion, Tech, Health, Education, Service, Retail, Other
- **Benchmark Otomatis**: Parameter ROI, IRR, Payback Period, dan Margin sesuai standar industri
- **Saran Biaya**: Rekomendasi biaya tetap dan variabel berdasarkan industri

### 💰 Modul Biaya Operasional
- **Biaya Tetap**: Sewa, gaji, utilities, marketing, dll
- **Biaya Variabel**: Bahan baku, kemasan, komisi per unit
- **Kalkulasi Otomatis**: Total biaya dan BEP real-time
- **CRUD Operations**: Tambah, edit, hapus biaya dengan mudah

### 📊 Kalkulator Keuangan Pro
- **ROI (Return on Investment)**: Perhitungan akurat dengan benchmark industri
- **IRR (Internal Rate of Return)**: Menggunakan metode Newton-Raphson
- **Payback Period**: Waktu balik modal dalam tahun (support pecahan)
- **BEP (Break Even Point)**: Jumlah unit untuk mencapai titik impas
- **Gross/Net Margin**: Margin kotor dan bersih dengan visualisasi

### 🔮 Simulator Skenario "What-If"
- **Slider Interaktif**: Perubahan harga bahan (±50%), volume (±70%), biaya tetap (±30%)
- **Impact Analysis**: Dampak real-time pada metrik keuangan
- **Visualisasi**: Grafik perubahan dengan indikator naik/turun

### 🎯 Kesimpulan Kelayakan
- **Multi-Parameter**: Evaluasi berdasarkan 4 metrik utama
- **Status Otomatis**: Layak, Pertimbangkan, Risiko Sedang, Risiko Tinggi
- **Rekomendasi**: Saran perbaikan spesifik untuk setiap metrik

### 📤 Export & Laporan
- **Excel Export**: Data lengkap dalam format spreadsheet
- **PDF Generation**: Laporan profesional siap presentasi
- **Multi-Sheet**: Ringkasan, Detail Keuangan, Riset Pasar

## 🛠️ Teknologi

- **Frontend**: React 18, Zustand (State Management)
- **Styling**: Tailwind CSS
- **AI Integration**: Gemini API untuk analisis bisnis
- **Export**: XLSX library untuk Excel
- **Architecture**: Modular, scalable, mobile-ready

## 🚀 Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/your-username/bizfeasibility-pro.git
cd bizfeasibility-pro
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
```bash
# Buat file .env jika diperlukan untuk API keys
cp .env.example .env
```

4. **Run Development Server**
```bash
npm start
```

5. **Build Production**
```bash
npm run build
```

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── common/           # Komponen UI umum
│   ├── Finance/          # Komponen keuangan
│   │   ├── KeuanganCalculatorPro.jsx
│   │   ├── OperationalCosts.jsx
│   │   ├── ScenarioSimulator.jsx
│   │   └── FeasibilityConclusion.jsx
│   └── Export/           # Komponen export
│       └── ExportButtons.jsx
├── constants/
│   └── industryTemplates.js  # Template industri
├── context/
│   └── useWizardStore.js     # Zustand store
├── screens/
│   └── wizard/           # Screen wizard
│       ├── IdeBisnisScreen.jsx
│       ├── RisetPasarScreen.jsx
│       ├── KeuanganScreen.jsx
│       └── LaporanScreen.jsx
├── utils/
│   ├── financeCalculations.js  # Kalkulasi keuangan
│   └── exportToExcel.js        # Export utilities
└── App.js                # Entry point
```

## 🎯 Cara Penggunaan

### 1. Ide Bisnis
- Pilih industri yang sesuai
- Gunakan AI untuk generate nama dan deskripsi
- Isi detail bisnis Anda

### 2. Riset Pasar
- Definisikan target pasar
- Analisis kompetitor (minimal 1)
- Dapatkan insight AI untuk celah pasar

### 3. Proyeksi Keuangan
- Input modal awal, harga jual, volume
- Detail biaya operasional (tetap & variabel)
- Lihat kalkulasi otomatis metrik keuangan
- Eksperimen dengan skenario "what-if"

### 4. Laporan & Export
- Review kesimpulan kelayakan
- Export ke Excel atau PDF
- Download laporan profesional

## 🔧 Konfigurasi

### Template Industri
Edit `src/constants/industryTemplates.js` untuk menambah atau mengubah parameter industri:

```javascript
export const INDUSTRY_TEMPLATES = {
  your_industry: {
    nama: "Nama Industri",
    parameter: { 
      minROI: 20, 
      minIRR: 18, 
      maxPayback: 2.5, 
      minMargin: 15 
    },
    saranBiayaTetap: ["Biaya 1", "Biaya 2"],
    saranBiayaVariabel: ["Biaya per unit 1", "Biaya per unit 2"],
  }
};
```

### Kalkulasi Keuangan
Modifikasi `src/utils/financeCalculations.js` untuk menyesuaikan formula:

```javascript
export const calculateROI = (netProfit, initialInvestment) => {
  if (initialInvestment === 0) return 0;
  return (netProfit / initialInvestment) * 100;
};
```

## 📊 Metrik Keuangan

### ROI (Return on Investment)
```
ROI = (Laba Bersih Tahunan / Modal Awal) × 100%
```

### IRR (Internal Rate of Return)
Menggunakan metode Newton-Raphson untuk menemukan discount rate di mana NPV = 0.

### Payback Period
```
Payback Period = Modal Awal / Arus Kas Tahunan
```

### BEP (Break Even Point)
```
BEP = Biaya Tetap / (Harga Jual - Biaya Variabel per Unit)
```

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

- **Email**: contact@bizfeasibility.com
- **Website**: https://bizfeasibility.com
- **GitHub**: https://github.com/your-username/bizfeasibility-pro

## 🙏 Acknowledgments

- **Gemini AI** untuk analisis bisnis cerdas
- **React Community** untuk framework yang luar biasa
- **Tailwind CSS** untuk styling yang elegan
- **Zustand** untuk state management yang sederhana

---

**BizFeasibility Pro** - Membuat analisis kelayakan bisnis menjadi mudah dan profesional! 🎉 