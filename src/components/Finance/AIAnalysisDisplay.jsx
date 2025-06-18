import React from 'react';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const AIAnalysisDisplay = ({ analysis }) => {
  if (!analysis) return null;

  // Parse the analysis text to extract different sections
  const parseAnalysis = (text) => {
    const sections = text.split('\n\n');
    const result = {
      kesimpulan: '',
      metrik: [],
      kekuatan: [],
      tantangan: [],
      rekomendasi: [],
      roadmap: []
    };

    sections.forEach(section => {
      const trimmedSection = section.trim();
      
      // Check for conclusion (first section or contains "Berdasarkan analisis komprehensif")
      if (trimmedSection.includes('Berdasarkan analisis komprehensif') && !result.kesimpulan) {
        result.kesimpulan = trimmedSection;
      }
      // Check for metrics analysis
      else if (trimmedSection.includes('ANALISIS METRIK KEUANGAN')) {
        const lines = trimmedSection.split('\n').filter(line => line.trim().startsWith('•'));
        result.metrik = lines.map(line => line.replace('•', '').trim());
      }
      // Check for strengths
      else if (trimmedSection.includes('KEKUATAN BISNIS SPESIFIK')) {
        const lines = trimmedSection.split('\n').filter(line => line.trim().startsWith('•'));
        result.kekuatan = lines.map(line => line.replace('•', '').trim());
      }
      // Check for challenges
      else if (trimmedSection.includes('TANTANGAN & RISIKO')) {
        const lines = trimmedSection.split('\n').filter(line => line.trim().startsWith('•'));
        result.tantangan = lines.map(line => line.replace('•', '').trim());
      }
      // Check for recommendations
      else if (trimmedSection.includes('REKOMENDASI STRATEGIS')) {
        const lines = trimmedSection.split('\n').filter(line => line.trim().startsWith('•'));
        result.rekomendasi = lines.map(line => line.replace('•', '').trim());
      }
      // Check for roadmap
      else if (trimmedSection.includes('ROADMAP PENGEMBANGAN')) {
        const lines = trimmedSection.split('\n').filter(line => line.trim().startsWith('•'));
        result.roadmap = lines.map(line => line.replace('•', '').trim());
      }
    });

    return result;
  };

  const parsedData = parseAnalysis(analysis);

  // Extract key highlights for summary
  const getKeyHighlights = () => {
    const highlights = [];
    
    // Extract ROI info from conclusion
    const roiMatch = parsedData.kesimpulan.match(/ROI ([\d.]+)%/);
    if (roiMatch) {
      const roi = parseFloat(roiMatch[1]);
      if (roi > 50) {
        highlights.push({ type: 'success', text: `ROI ${roi}% - Sangat Menjanjikan` });
      } else if (roi > 25) {
        highlights.push({ type: 'warning', text: `ROI ${roi}% - Menjanjikan` });
      } else {
        highlights.push({ type: 'danger', text: `ROI ${roi}% - Perlu Optimasi` });
      }
    }

    // Extract key metrics
    if (parsedData.metrik.length > 0) {
      const paybackMatch = parsedData.metrik[0].match(/Payback Period ([\d.]+) tahun/);
      if (paybackMatch) {
        const payback = parseFloat(paybackMatch[1]);
        if (payback < 2) {
          highlights.push({ type: 'success', text: `Payback ${payback} tahun - Cepat` });
        } else if (payback < 4) {
          highlights.push({ type: 'warning', text: `Payback ${payback} tahun - Wajar` });
        } else {
          highlights.push({ type: 'danger', text: `Payback ${payback} tahun - Panjang` });
        }
      }
    }

    // Add top strength and challenge
    if (parsedData.kekuatan.length > 0) {
      highlights.push({ type: 'success', text: parsedData.kekuatan[0].substring(0, 60) + '...' });
    }
    if (parsedData.tantangan.length > 0) {
      highlights.push({ type: 'danger', text: parsedData.tantangan[0].substring(0, 60) + '...' });
    }

    return highlights;
  };

  const keyHighlights = getKeyHighlights();

  const HighlightCard = ({ title, items, icon: Icon, colorClass, bgClass }) => (
    <div className={`${bgClass} border-l-4 ${colorClass} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon />
        </div>
        <h3 className="font-bold text-lg ml-3 text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${colorClass.replace('border-', 'bg-')}`}></div>
            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Highlights Summary */}
      {keyHighlights.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg border-yellow-500 bg-yellow-100">
              <StarIcon />
            </div>
            <h3 className="font-bold text-xl ml-3 text-yellow-800">Highlight Utama</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyHighlights.map((highlight, index) => (
              <div key={index} className={`flex items-center space-x-2 p-3 rounded-lg ${
                highlight.type === 'success' ? 'bg-green-100 text-green-800' :
                highlight.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  highlight.type === 'success' ? 'bg-green-500' :
                  highlight.type === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Conclusion Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg border-purple-500 bg-purple-100">
            <SparklesIcon />
          </div>
          <h3 className="font-bold text-xl ml-3 text-purple-800">Kesimpulan Utama</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg font-medium">
          {parsedData.kesimpulan}
        </p>
      </div>

      {/* Metrics Analysis */}
      {parsedData.metrik.length > 0 && (
        <HighlightCard
          title="Analisis Metrik Keuangan"
          items={parsedData.metrik}
          icon={TrendingUpIcon}
          colorClass="border-blue-500"
          bgClass="bg-blue-50"
        />
      )}

      {/* Strengths */}
      {parsedData.kekuatan.length > 0 && (
        <HighlightCard
          title="Kekuatan Bisnis"
          items={parsedData.kekuatan}
          icon={CheckCircleIcon}
          colorClass="border-green-500"
          bgClass="bg-green-50"
        />
      )}

      {/* Challenges */}
      {parsedData.tantangan.length > 0 && (
        <HighlightCard
          title="Tantangan & Risiko"
          items={parsedData.tantangan}
          icon={AlertTriangleIcon}
          colorClass="border-orange-500"
          bgClass="bg-orange-50"
        />
      )}

      {/* Recommendations */}
      {parsedData.rekomendasi.length > 0 && (
        <HighlightCard
          title="Rekomendasi Strategis"
          items={parsedData.rekomendasi}
          icon={TargetIcon}
          colorClass="border-purple-500"
          bgClass="bg-purple-50"
        />
      )}

      {/* Roadmap */}
      {parsedData.roadmap.length > 0 && (
        <HighlightCard
          title="Roadmap Pengembangan"
          items={parsedData.roadmap}
          icon={TrendingUpIcon}
          colorClass="border-indigo-500"
          bgClass="bg-indigo-50"
        />
      )}
    </div>
  );
};

export default AIAnalysisDisplay; 