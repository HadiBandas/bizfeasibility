/**
 * Menghitung Return on Investment (ROI).
 * @param {number} netProfit - Laba bersih tahunan.
 * @param {number} initialInvestment - Modal awal.
 * @returns {number} ROI dalam persentase.
 */
export const calculateROI = (netProfit, initialInvestment) => {
  if (initialInvestment === 0) return 0;
  return (netProfit / initialInvestment) * 100;
};

/**
 * Menghitung Payback Period (waktu balik modal).
 * @param {number} initialInvestment - Modal awal.
 * @param {number} annualCashFlow - Arus kas bersih tahunan (Net Profit + Depresiasi).
 * @returns {number} Payback period dalam tahun (bisa pecahan).
 */
export const calculatePaybackPeriod = (initialInvestment, annualCashFlow) => {
  if (annualCashFlow <= 0) return Infinity; // Tidak akan pernah balik modal
  return initialInvestment / annualCashFlow;
};

/**
 * Menghitung Break Even Point (BEP) dalam unit.
 * @param {number} totalFixedCosts - Total biaya tetap per periode (misal, per bulan).
 * @param {number} pricePerUnit - Harga jual per unit.
 * @param {number} variableCostPerUnit - Biaya variabel per unit.
 * @returns {number} Jumlah unit yang harus terjual untuk mencapai BEP.
 */
export const calculateBEPUnits = (totalFixedCosts, pricePerUnit, variableCostPerUnit) => {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    if (contributionMargin <= 0) return Infinity;
    return totalFixedCosts / contributionMargin;
};

/**
 * Menghitung Internal Rate of Return (IRR) menggunakan metode Newton-Raphson.
 * Ini adalah perhitungan iteratif untuk menemukan discount rate di mana NPV = 0.
 * @param {number[]} cashFlows - Array arus kas. Elemen pertama HARUS negatif (investasi awal).
 * @param {number} [guess=0.1] - Tebakan awal untuk IRR.
 * @returns {number} IRR dalam persentase.
 * @dev Ini adalah implementasi yang disederhanakan. Untuk presisi tinggi, library keuangan direkomendasikan.
 */
export const calculateIRR = (cashFlows, guess = 0.1) => {
  const maxIterations = 100;
  const tolerance = 1e-6;
  let irr = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dNpv = 0; // Turunan pertama NPV terhadap r (rate)
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + irr, t);
      if (t > 0) {
        dNpv -= t * cashFlows[t] / Math.pow(1 + irr, t + 1);
      }
    }
    
    if (Math.abs(npv) < tolerance) {
      return irr * 100;
    }
    
    if (dNpv === 0) break; // Hindari division by zero
    
    irr = irr - npv / dNpv;
  }
  return NaN; // Gagal konvergen
};

/**
 * Fungsi utama untuk mengkalkulasi semua metrik keuangan.
 * @param {object} data - Kumpulan data dari state (keuangan, scenario).
 * @returns {object} Objek berisi semua metrik yang telah dihitung.
 */
export const calculateAllMetrics = (data) => {
    const { modal, hargaJual, volume, operasional, scenario } = data;

    // Terapkan skenario "What-If"
    const scenarioMultiplier = {
        bahan: 1 + (scenario?.hargaBahan / 100 || 0),
        volume: 1 + (scenario?.volumeJual / 100 || 0),
        tetap: 1 + (scenario?.biayaTetap / 100 || 0),
    };

    const numModal = Number(modal) || 0;
    const numHargaJual = Number(hargaJual) || 0;
    const numVolume = (Number(volume) || 0) * scenarioMultiplier.volume;
    
    const totalFixedCosts = (operasional?.tetap || []).reduce((acc, cost) => acc + Number(cost.jumlah || 0), 0) * scenarioMultiplier.tetap;
    const totalVariableCostPerUnit = (operasional?.variabel || []).reduce((acc, cost) => acc + Number(cost.perUnit || 0), 0) * scenarioMultiplier.bahan;
    
    if (numHargaJual === 0 || numVolume === 0) return {};

    const monthlyRevenue = numHargaJual * numVolume;
    const monthlyVariableCosts = totalVariableCostPerUnit * numVolume;
    const monthlyGrossProfit = monthlyRevenue - monthlyVariableCosts;
    const monthlyNetProfit = monthlyGrossProfit - totalFixedCosts;
    
    const annualNetProfit = monthlyNetProfit * 12;

    // Asumsi arus kas tahunan sama dengan laba bersih (penyederhanaan)
    const annualCashFlow = annualNetProfit;

    // Buat array arus kas untuk 5 tahun untuk kalkulasi IRR
    // Tahun 0: Investasi awal (negatif)
    // Tahun 1-5: Arus kas tahunan
    const cashFlowsForIRR = [-numModal, ...Array(5).fill(annualCashFlow)];

    return {
        roi: calculateROI(annualNetProfit, numModal),
        paybackPeriod: calculatePaybackPeriod(numModal, annualCashFlow),
        irr: calculateIRR(cashFlowsForIRR),
        bepUnits: calculateBEPUnits(totalFixedCosts, numHargaJual, totalVariableCostPerUnit),
        grossMargin: (monthlyGrossProfit / monthlyRevenue) * 100,
        netMargin: (monthlyNetProfit / monthlyRevenue) * 100,
        totalFixedCosts: totalFixedCosts,
        totalVariableCostPerUnit: totalVariableCostPerUnit,
        monthlyNetProfit: monthlyNetProfit,
        monthlyRevenue: monthlyRevenue,
        monthlyGrossProfit: monthlyGrossProfit,
    };
}; 