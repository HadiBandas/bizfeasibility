import React, { useState, useEffect } from 'react';
import useWizardStore from '../../context/useWizardStore';
import { INDUSTRY_TEMPLATES } from '../../constants/industryTemplates';

const MetricCard = ({ title, value, unit, color = "blue", benchmark = null, isGood = null }) => {
    const colorClasses = {
        blue: "text-blue-600",
        green: "text-green-600", 
        red: "text-red-600",
        yellow: "text-yellow-600"
    };

    const getStatusIcon = () => {
        if (isGood === null) return null;
        if (isGood) {
            return (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-500">{title}</p>
                {getStatusIcon()}
            </div>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>
                {typeof value === 'number' && isFinite(value) ? value.toFixed(2) : '0'} {unit}
            </p>
            {benchmark && (
                <p className="text-xs text-gray-400 mt-1">
                    Benchmark: {benchmark}
                </p>
            )}
        </div>
    );
};

export const KeuanganCalculatorPro = () => {
    const { keuangan, ideBisnis } = useWizardStore(state => ({
        keuangan: state.keuangan,
        ideBisnis: state.ideBisnis,
    }));

    const { metrics } = keuangan;
    const template = INDUSTRY_TEMPLATES[ideBisnis.industryKey];

    // Evaluasi metrik terhadap benchmark
    const evaluateMetric = (value, benchmark, isHigherBetter = true) => {
        if (!benchmark || !value || !isFinite(value)) return null;
        return isHigherBetter ? value >= benchmark : value <= benchmark;
    };

    const isIrrGood = evaluateMetric(metrics.irr, template?.parameter?.minIRR, true);
    const isPaybackGood = evaluateMetric(metrics.paybackPeriod, template?.parameter?.maxPayback, false);
    const isRoiGood = evaluateMetric(metrics.roi, template?.parameter?.minROI, true);
    const isMarginGood = evaluateMetric(metrics.netMargin, template?.parameter?.minMargin, true);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Kalkulator Keuangan Pro</h3>
            
            {/* Metrik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    title="ROI (Return on Investment)"
                    value={metrics.roi}
                    unit="%"
                    color="green"
                    benchmark={template?.parameter?.minROI ? `Min ${template.parameter.minROI}%` : null}
                    isGood={isRoiGood}
                />
                <MetricCard 
                    title="Payback Period"
                    value={metrics.paybackPeriod}
                    unit="tahun"
                    color="blue"
                    benchmark={template?.parameter?.maxPayback ? `Max ${template.parameter.maxPayback} tahun` : null}
                    isGood={isPaybackGood}
                />
                <MetricCard 
                    title="IRR (Internal Rate of Return)"
                    value={metrics.irr}
                    unit="%"
                    color="green"
                    benchmark={template?.parameter?.minIRR ? `Min ${template.parameter.minIRR}%` : null}
                    isGood={isIrrGood}
                />
                <MetricCard 
                    title="BEP (Break Even Point)"
                    value={metrics.bepUnits}
                    unit="unit/bulan"
                    color="blue"
                />
            </div>

            {/* Metrik Margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard 
                    title="Gross Margin"
                    value={metrics.grossMargin}
                    unit="%"
                    color="green"
                />
                <MetricCard 
                    title="Net Margin"
                    value={metrics.netMargin}
                    unit="%"
                    color="green"
                    benchmark={template?.parameter?.minMargin ? `Min ${template.parameter.minMargin}%` : null}
                    isGood={isMarginGood}
                />
            </div>

            {/* Ringkasan Keuangan */}
            <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-3">Ringkasan Keuangan Bulanan</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Pendapatan:</p>
                        <p className="font-semibold text-green-600">
                            Rp {(metrics.monthlyRevenue || 0).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Laba Kotor:</p>
                        <p className="font-semibold text-blue-600">
                            Rp {(metrics.monthlyGrossProfit || 0).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Laba Bersih:</p>
                        <p className="font-semibold text-green-600">
                            Rp {(metrics.monthlyNetProfit || 0).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Visualisasi BEP */}
            <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-3">Visualisasi Break Even Point</h4>
                <div className="h-32 flex items-end justify-around gap-4 p-4 bg-gray-50 rounded">
                    <div className="flex flex-col items-center w-1/3">
                        <div 
                            className="w-full bg-blue-200 rounded-t-md transition-all duration-500" 
                            style={{ height: `${Math.min((metrics.totalFixedCosts || 0) / 1000000 * 20, 100)}px` }}
                        ></div>
                        <p className="text-xs text-center mt-2">Biaya Tetap</p>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                        <div 
                            className="w-full bg-green-200 rounded-t-md transition-all duration-500" 
                            style={{ height: `${Math.min((metrics.monthlyRevenue || 0) / 1000000 * 20, 100)}px` }}
                        ></div>
                        <p className="text-xs text-center mt-2">Pendapatan</p>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                        <div 
                            className="w-full bg-yellow-200 rounded-t-md transition-all duration-500" 
                            style={{ height: `${Math.min((metrics.monthlyNetProfit || 0) / 1000000 * 20, 100)}px` }}
                        ></div>
                        <p className="text-xs text-center mt-2">Laba Bersih</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                    BEP tercapai pada {Math.ceil(metrics.bepUnits || 0)} unit per bulan
                </p>
            </div>
        </div>
    );
}; 