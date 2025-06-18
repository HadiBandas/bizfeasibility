import React, { useState, useEffect } from 'react';
import useWizardStore from '../../context/useWizardStore';
import { calculateAllMetrics } from '../../utils/financeCalculations';

const ScenarioSlider = ({ label, value, onChange, min, max, unit = "%" }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm text-gray-500">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400">
                <span>{min}{unit}</span>
                <span>0{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
};

const ImpactCard = ({ title, baseValue, newValue, unit, color = "blue" }) => {
    const change = newValue - baseValue;
    const changePercent = baseValue !== 0 ? (change / baseValue) * 100 : 0;
    
    const colorClasses = {
        blue: "text-blue-600",
        green: "text-green-600",
        red: "text-red-600"
    };

    const getChangeColor = () => {
        if (change > 0) return "text-green-600";
        if (change < 0) return "text-red-600";
        return "text-gray-600";
    };

    const getChangeIcon = () => {
        if (change > 0) return "↗";
        if (change < 0) return "↘";
        return "→";
    };

    return (
        <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <div className="flex items-center justify-between">
                <p className={`text-lg font-semibold ${colorClasses[color]}`}>
                    {typeof newValue === 'number' && isFinite(newValue) ? newValue.toFixed(2) : '0'} {unit}
                </p>
                <div className={`text-sm font-medium ${getChangeColor()}`}>
                    {getChangeIcon()} {changePercent.toFixed(1)}%
                </div>
            </div>
        </div>
    );
};

export const ScenarioSimulator = () => {
    const { keuangan, actions } = useWizardStore(state => ({
        keuangan: state.keuangan,
        actions: state.actions,
    }));

    const { scenario } = keuangan;

    // Hitung metrik base (tanpa skenario)
    const baseMetrics = calculateAllMetrics({
        ...keuangan,
        scenario: { hargaBahan: 0, volumeJual: 0, biayaTetap: 0 }
    });

    // Hitung metrik dengan skenario
    const scenarioMetrics = calculateAllMetrics(keuangan);

    const handleScenarioChange = (key, value) => {
        actions.updateScenario(key, value);
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Simulator Skenario "What-If"</h3>
            <p className="text-sm text-gray-600">
                Geser slider untuk melihat dampak perubahan variabel kunci pada metrik keuangan Anda.
            </p>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScenarioSlider
                    label="Perubahan Harga Bahan Baku"
                    value={scenario?.hargaBahan || 0}
                    onChange={(value) => handleScenarioChange('hargaBahan', value)}
                    min={-50}
                    max={50}
                />
                <ScenarioSlider
                    label="Perubahan Volume Penjualan"
                    value={scenario?.volumeJual || 0}
                    onChange={(value) => handleScenarioChange('volumeJual', value)}
                    min={-70}
                    max={70}
                />
                <ScenarioSlider
                    label="Perubahan Biaya Tetap"
                    value={scenario?.biayaTetap || 0}
                    onChange={(value) => handleScenarioChange('biayaTetap', value)}
                    min={-30}
                    max={30}
                />
            </div>

            {/* Impact Analysis */}
            <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-4">Dampak pada Metrik Keuangan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ImpactCard
                        title="ROI"
                        baseValue={baseMetrics.roi || 0}
                        newValue={scenarioMetrics.roi || 0}
                        unit="%"
                        color="green"
                    />
                    <ImpactCard
                        title="Payback Period"
                        baseValue={baseMetrics.paybackPeriod || 0}
                        newValue={scenarioMetrics.paybackPeriod || 0}
                        unit="tahun"
                        color="blue"
                    />
                    <ImpactCard
                        title="IRR"
                        baseValue={baseMetrics.irr || 0}
                        newValue={scenarioMetrics.irr || 0}
                        unit="%"
                        color="green"
                    />
                    <ImpactCard
                        title="Net Margin"
                        baseValue={baseMetrics.netMargin || 0}
                        newValue={scenarioMetrics.netMargin || 0}
                        unit="%"
                        color="green"
                    />
                </div>
            </div>

            {/* Monthly Impact */}
            <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-4">Dampak Bulanan</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ImpactCard
                        title="Pendapatan Bulanan"
                        baseValue={baseMetrics.monthlyRevenue || 0}
                        newValue={scenarioMetrics.monthlyRevenue || 0}
                        unit="Rp"
                        color="green"
                    />
                    <ImpactCard
                        title="Laba Kotor Bulanan"
                        baseValue={baseMetrics.monthlyGrossProfit || 0}
                        newValue={scenarioMetrics.monthlyGrossProfit || 0}
                        unit="Rp"
                        color="blue"
                    />
                    <ImpactCard
                        title="Laba Bersih Bulanan"
                        baseValue={baseMetrics.monthlyNetProfit || 0}
                        newValue={scenarioMetrics.monthlyNetProfit || 0}
                        unit="Rp"
                        color="green"
                    />
                </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
                <button
                    onClick={() => {
                        handleScenarioChange('hargaBahan', 0);
                        handleScenarioChange('volumeJual', 0);
                        handleScenarioChange('biayaTetap', 0);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                    Reset Skenario
                </button>
            </div>
        </div>
    );
}; 