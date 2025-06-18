import React from 'react';
import useWizardStore from '../../context/useWizardStore';
import { INDUSTRY_TEMPLATES } from '../../constants/industryTemplates';

const getConclusion = (metrics, template) => {
    if (!template || !metrics.irr) {
        return {
            status: 'LOADING',
            title: 'Menunggu Data...',
            message: 'Lengkapi data modal, harga, volume, dan biaya untuk melihat kesimpulan kelayakan.',
            recommendations: []
        };
    }

    const { minIRR, maxPayback, minROI, minMargin } = template.parameter;
    const isIrrOk = metrics.irr >= minIRR;
    const isPaybackOk = metrics.paybackPeriod <= maxPayback;
    const isRoiOk = metrics.roi >= minROI;
    const isMarginOk = metrics.netMargin >= minMargin;

    const score = (isIrrOk ? 1 : 0) + (isPaybackOk ? 1 : 0) + (isRoiOk ? 1 : 0) + (isMarginOk ? 1 : 0);
    const totalMetrics = 4;

    let recommendations = [];
    
    if (!isIrrOk) {
        recommendations.push(`Tingkatkan IRR dari ${metrics.irr.toFixed(1)}% menjadi minimal ${minIRR}%`);
    }
    if (!isPaybackOk) {
        recommendations.push(`Kurangi Payback Period dari ${metrics.paybackPeriod.toFixed(1)} tahun menjadi maksimal ${maxPayback} tahun`);
    }
    if (!isRoiOk) {
        recommendations.push(`Tingkatkan ROI dari ${metrics.roi.toFixed(1)}% menjadi minimal ${minROI}%`);
    }
    if (!isMarginOk) {
        recommendations.push(`Tingkatkan Net Margin dari ${metrics.netMargin.toFixed(1)}% menjadi minimal ${minMargin}%`);
    }

    if (score === totalMetrics) {
        return { 
            status: 'LAYAK', 
            title: 'Sangat Layak! 🎉', 
            message: 'Berdasarkan benchmark industri, metrik keuangan Anda sangat solid. Potensi tinggi untuk dilanjutkan.',
            recommendations: ['Pertimbangkan untuk scaling up bisnis', 'Evaluasi peluang ekspansi pasar']
        };
    }
    if (score >= totalMetrics * 0.75) {
        return { 
            status: 'PERTIMBANGKAN', 
            title: 'Layak dengan Pertimbangan ⚠️', 
            message: `Beberapa metrik sudah baik, namun ada ${totalMetrics - score} parameter yang belum memenuhi benchmark. Tinjau kembali strategi harga atau efisiensi biaya.`,
            recommendations
        };
    }
    if (score >= totalMetrics * 0.5) {
        return { 
            status: 'RISIKO SEDANG', 
            title: 'Risiko Sedang ⚠️', 
            message: `Hanya ${score} dari ${totalMetrics} metrik yang memenuhi benchmark industri. Diperlukan revisi model bisnis yang signifikan.`,
            recommendations
        };
    }
    return { 
        status: 'RISIKO TINGGI', 
        title: 'Risiko Tinggi ❌', 
        message: 'Metrik keuangan Anda berada di bawah benchmark industri. Diperlukan revisi model bisnis yang signifikan atau pertimbangkan ulang ide bisnis.',
        recommendations
    };
};

const RecommendationItem = ({ text }) => (
    <div className="flex items-start space-x-2">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm">{text}</p>
    </div>
);

export const FeasibilityConclusion = () => {
    const { metrics, industryKey } = useWizardStore(state => ({
        metrics: state.keuangan.metrics,
        industryKey: state.ideBisnis.industryKey,
    }));

    const template = INDUSTRY_TEMPLATES[industryKey];
    const conclusion = getConclusion(metrics, template);

    const colorClasses = {
        'LAYAK': 'bg-green-100 border-green-500 text-green-800',
        'PERTIMBANGKAN': 'bg-yellow-100 border-yellow-500 text-yellow-800',
        'RISIKO SEDANG': 'bg-orange-100 border-orange-500 text-orange-800',
        'RISIKO TINGGI': 'bg-red-100 border-red-500 text-red-800',
        'LOADING': 'bg-gray-100 border-gray-400 text-gray-800',
    };

    const iconClasses = {
        'LAYAK': 'text-green-600',
        'PERTIMBANGKAN': 'text-yellow-600',
        'RISIKO SEDANG': 'text-orange-600',
        'RISIKO TINGGI': 'text-red-600',
        'LOADING': 'text-gray-600',
    };

    return (
        <div className={`border-l-4 p-6 rounded-r-lg ${colorClasses[conclusion.status]}`}>
            <div className="flex items-start space-x-3">
                <div className={`text-2xl ${iconClasses[conclusion.status]}`}>
                    {conclusion.status === 'LAYAK' && '🎉'}
                    {conclusion.status === 'PERTIMBANGKAN' && '⚠️'}
                    {conclusion.status === 'RISIKO SEDANG' && '⚠️'}
                    {conclusion.status === 'RISIKO TINGGI' && '❌'}
                    {conclusion.status === 'LOADING' && '⏳'}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">{conclusion.title}</h3>
                    <p className="text-sm mb-4">{conclusion.message}</p>
                    
                    {conclusion.recommendations && conclusion.recommendations.length > 0 && (
                        <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Rekomendasi Perbaikan:</h4>
                            <div className="space-y-2">
                                {conclusion.recommendations.map((rec, index) => (
                                    <RecommendationItem key={index} text={rec} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 