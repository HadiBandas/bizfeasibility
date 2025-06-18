/**
 * Berisi parameter dan benchmark keuangan untuk berbagai industri.
 * - minROI: Minimum Return on Investment yang dianggap sehat (dalam %).
 * - minIRR: Minimum Internal Rate of Return (dalam %).
 * - maxPayback: Maksimum Payback Period yang bisa diterima (dalam tahun).
 * - minMargin: Minimum Net Profit Margin (dalam %).
 * - fixedCosts: Contoh biaya tetap yang umum di industri ini.
 * - variableCosts: Contoh biaya variabel yang umum.
 * - benchmark: Data pembanding, cth: persentase biaya marketing dari pendapatan.
 */
export const INDUSTRY_TEMPLATES = {
  food: {
    nama: "Makanan & Minuman",
    parameter: { minROI: 20, minIRR: 18, maxPayback: 2.5, minMargin: 15 },
    saranBiayaTetap: ["Sewa tempat (dapur/outlet)", "Gaji chef/barista", "Listrik & Air", "Marketing & Promosi"],
    saranBiayaVariabel: ["Bahan baku per porsi", "Kemasan (box/gelas)", "Biaya platform delivery (GoFood/GrabFood)"],
  },
  fashion: {
    nama: "Fashion & Aksesoris",
    parameter: { minROI: 25, minIRR: 20, maxPayback: 3, minMargin: 20 },
    saranBiayaTetap: ["Sewa butik/gudang", "Gaji desainer/penjahit", "Biaya photoshoot produk", "Langganan platform e-commerce"],
    saranBiayaVariabel: ["Kain & benang per item", "Biaya maklun (jika ada)", "Packaging eksklusif", "Komisi reseller"],
  },
  tech: {
    nama: "Teknologi & Digital",
    parameter: { minROI: 30, minIRR: 25, maxPayback: 4, minMargin: 25 },
    saranBiayaTetap: ["Gaji developer & engineer", "Biaya server & cloud (AWS/GCP)", "Sewa kantor", "Lisensi software"],
    saranBiayaVariabel: ["Biaya API per request", "Komisi App Store/Play Store", "Biaya akuisisi customer (Ads)"],
  },
  health: {
    nama: "Kesehatan & Kecantikan",
    parameter: { minROI: 22, minIRR: 19, maxPayback: 3.5, minMargin: 18 },
    saranBiayaTetap: ["Sewa klinik/salon", "Gaji terapis/dokter", "Biaya lisensi & sertifikasi", "Asuransi malpraktik"],
    saranBiayaVariabel: ["Produk habis pakai per treatment", "Botol & kemasan produk", "Biaya sterilisasi alat"],
  },
  education: {
    nama: "Pendidikan & Kursus",
    parameter: { minROI: 18, minIRR: 15, maxPayback: 3, minMargin: 20 },
    saranBiayaTetap: ["Sewa ruang kelas/kantor", "Gaji pengajar/tutor", "Pengembangan kurikulum", "Platform e-learning"],
    saranBiayaVariabel: ["Materi cetak per siswa", "Fee untuk pengajar tamu", "Sertifikat kelulusan"],
  },
  service: {
    nama: "Jasa & Layanan",
    parameter: { minROI: 25, minIRR: 22, maxPayback: 2, minMargin: 30 },
    saranBiayaTetap: ["Sewa kantor", "Gaji staf ahli", "Software CRM & Project Management", "Asuransi profesional"],
    saranBiayaVariabel: ["Biaya transportasi per proyek", "Material penunjang per klien", "Komisi untuk tim sales"],
  },
  retail: {
    nama: "Retail & E-commerce",
    parameter: { minROI: 15, minIRR: 18, maxPayback: 3.5, minMargin: 10 },
    saranBiayaTetap: ["Sewa toko/gudang", "Gaji kasir & staf", "Sistem POS (Point of Sale)", "Biaya marketplace"],
    saranBiayaVariabel: ["Harga pokok pembelian barang", "Biaya pengiriman (Shipping)", "Biaya pemrosesan pembayaran"],
  },
  other: {
    nama: "Lainnya",
    parameter: { minROI: 15, minIRR: 15, maxPayback: 4, minMargin: 10 },
    saranBiayaTetap: ["Sewa", "Gaji", "Marketing"],
    saranBiayaVariabel: ["Bahan Baku", "Komisi"],
  }
}; 