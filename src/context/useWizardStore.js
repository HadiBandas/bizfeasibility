import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- GEMINI API HELPER ---
const callGeminiAPI = async (prompt, isJson = false) => {
    // Mock Gemini API untuk testing
    console.log('Mock Gemini API called with prompt:', prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isJson) {
        // Mock response untuk generate business idea
        const mockIdeas = [
            { nama: "Kopi Durian Medan", deskripsi: "Warung kopi dengan menu unik kopi durian asli Medan, target mahasiswa dan pekerja kantoran." },
            { nama: "Roti Pisang Bakar Spesial", deskripsi: "Toko roti dengan varian pisang bakar dengan topping keju dan coklat, target keluarga dan anak muda." },
            { nama: "Es Teh Tarik Premium", deskripsi: "Minuman teh tarik dengan varian rasa unik seperti matcha dan taro, target mahasiswa dan pekerja." },
            { nama: "Nasi Goreng Seafood", deskripsi: "Warung nasi goreng dengan bahan seafood segar, target pekerja kantoran dan keluarga." },
            { nama: "Bakso Bakar Spesial", deskripsi: "Bakso dengan cara masak bakar dan bumbu rahasia, target mahasiswa dan anak muda." }
        ];
        
        const randomIdea = mockIdeas[Math.floor(Math.random() * mockIdeas.length)];
        return JSON.stringify(randomIdea);
    } else {
        // Check if this is a comprehensive report analysis
        if (prompt.includes('KESIMPULAN UTAMA') && prompt.includes('METRIK KEUANGAN')) {
            // Extract actual data from the prompt for personalized analysis
            const extractData = (prompt) => {
                const roiMatch = prompt.match(/ROI: ([\d.]+)%/);
                const paybackMatch = prompt.match(/Payback Period: ([\d.]+) tahun/);
                const irrMatch = prompt.match(/IRR: ([\d.]+)%/);
                const bepMatch = prompt.match(/BEP: ([\d]+) unit\/bulan/);
                const modalMatch = prompt.match(/Modal Awal: Rp ([\d.,]+)/);
                const hargaMatch = prompt.match(/Harga Jual: Rp ([\d.,]+)/);
                const volumeMatch = prompt.match(/Volume\/Bulan: ([\d.,]+)/);
                const namaMatch = prompt.match(/Nama: (.+)/);
                const kategoriMatch = prompt.match(/Kategori: (.+)/);
                const targetMatch = prompt.match(/Target Pasar: (.+)/);
                const kompetitorMatch = prompt.match(/Kompetitor: (.+)/);
                const netMarginMatch = prompt.match(/Net Margin: ([\d.]+)%/);
                const monthlyRevenueMatch = prompt.match(/Monthly Revenue: Rp ([\d.,]+)/);
                const monthlyNetProfitMatch = prompt.match(/Monthly Net Profit: Rp ([\d.,]+)/);
                
                return {
                    roi: parseFloat(roiMatch?.[1] || 0),
                    paybackPeriod: parseFloat(paybackMatch?.[1] || 0),
                    irr: parseFloat(irrMatch?.[1] || 0),
                    bepUnits: parseInt(bepMatch?.[1] || 0),
                    modal: parseInt(modalMatch?.[1]?.replace(/[.,]/g, '') || '0', 10),
                    hargaJual: parseInt(hargaMatch?.[1]?.replace(/[.,]/g, '') || '0', 10),
                    volume: parseInt(volumeMatch?.[1]?.replace(/[.,]/g, '') || '0', 10),
                    nama: namaMatch?.[1] || 'Bisnis Anda',
                    kategori: kategoriMatch?.[1] || 'Bisnis',
                    targetPasar: targetMatch?.[1] || '',
                    kompetitor: kompetitorMatch?.[1] || '',
                    netMargin: parseFloat(netMarginMatch?.[1] || 0),
                    monthlyRevenue: parseInt(monthlyRevenueMatch?.[1]?.replace(/[.,]/g, '') || '0', 10),
                    monthlyNetProfit: parseInt(monthlyNetProfitMatch?.[1]?.replace(/[.,]/g, '') || '0', 10)
                };
            };

            const data = extractData(prompt);
            
            // Generate personalized analysis based on actual data
            const generatePersonalizedAnalysis = (data) => {
                let kesimpulan = '';
                let analisisMetrik = '';
                let kekuatan = '';
                let tantangan = '';
                let rekomendasi = '';
                let roadmap = '';

                // KESIMPULAN UTAMA berdasarkan metrik
                if (data.roi > 50) {
                    kesimpulan = `Berdasarkan analisis komprehensif, ${data.nama} menunjukkan potensi yang SANGAT MENJANJIKAN dengan ROI ${data.roi}% yang berada di atas rata-rata industri.`;
                } else if (data.roi > 25) {
                    kesimpulan = `Berdasarkan analisis komprehensif, ${data.nama} menunjukkan potensi yang MENJANJIKAN dengan ROI ${data.roi}% yang memadai untuk dilanjutkan.`;
                } else {
                    kesimpulan = `Berdasarkan analisis komprehensif, ${data.nama} memerlukan OPTIMASI SIGNIFIKAN dengan ROI ${data.roi}% yang masih di bawah standar industri.`;
                }

                // ANALISIS METRIK KEUANGAN - Lebih singkat dan fokus
                analisisMetrik = `**ANALISIS METRIK KEUANGAN**
• ROI ${data.roi}% - ${data.roi > 30 ? 'Sangat baik' : data.roi > 20 ? 'Baik' : 'Perlu peningkatan'}
• Payback Period ${data.paybackPeriod} tahun - ${data.paybackPeriod < 2 ? 'Sangat cepat' : data.paybackPeriod < 4 ? 'Wajar' : 'Perlu strategi cash flow'}
• IRR ${data.irr}% - ${data.irr > 25 ? 'Tingkat pengembalian sangat baik' : data.irr > 15 ? 'Tingkat pengembalian memadai' : 'Perlu peningkatan'}
• BEP ${data.bepUnits} unit/bulan - ${data.volume > data.bepUnits ? 'Target volume sudah melebihi BEP' : 'Perlu revisi target volume'}
• Net margin ${data.netMargin}% - ${data.netMargin > 20 ? 'Profitabilitas sangat baik' : data.netMargin > 10 ? 'Profitabilitas memadai' : 'Perlu optimasi'}`;

                // KEKUATAN BISNIS SPESIFIK - Fokus pada poin utama
                kekuatan = `**KEKUATAN BISNIS SPESIFIK**
• Konsep ${data.nama} memiliki diferensiasi yang jelas dalam kategori ${data.kategori}
• Modal awal Rp ${data.modal.toLocaleString('id-ID')} ${data.modal < 10000000 ? 'terjangkau' : 'signifikan'} untuk skala usaha
• Potensi revenue Rp ${data.monthlyRevenue.toLocaleString('id-ID')}/bulan yang ${data.monthlyRevenue > 50000000 ? 'sangat menjanjikan' : 'memadai'}
• ${data.targetPasar ? `Target pasar "${data.targetPasar}" yang spesifik` : 'Target pasar yang perlu didefinisikan'}
• Net margin ${data.netMargin}% menunjukkan ${data.netMargin > 20 ? 'profitabilitas yang sangat baik' : data.netMargin > 10 ? 'profitabilitas yang memadai' : 'profitabilitas yang perlu ditingkatkan'}`;

                // TANTANGAN & RISIKO - Fokus pada risiko utama
                tantangan = `**TANTANGAN & RISIKO**
• Ketergantungan pada volume penjualan ${data.volume} unit/bulan untuk mencapai target
• ${data.paybackPeriod > 3 ? 'Payback period yang panjang' : 'Perlu strategi cash flow yang ketat'}
• ${data.kompetitor ? `Persaingan dengan ${data.kompetitor.split(',').length} kompetitor` : 'Persaingan di sektor yang ketat'}
• Fluktuasi biaya operasional dapat mempengaruhi margin profit
• ${data.monthlyNetProfit < 5000000 ? 'Profit bulanan yang masih rendah' : 'Perlu strategi scaling'}`;

                // REKOMENDASI STRATEGIS - Lebih konkret dan actionable
                rekomendasi = `**REKOMENDASI STRATEGIS**
• ${data.roi < 30 ? 'Implementasi cost control ketat untuk meningkatkan margin' : 'Fokus pada scaling up operasi'}
• ${data.bepUnits > data.volume * 0.8 ? 'Revisi target volume atau optimasi biaya' : 'Pertahankan target volume dan fokus customer acquisition'}
• ${data.paybackPeriod > 3 ? 'Implementasi cash flow management ketat' : 'Manfaatkan payback period cepat untuk reinvestasi'}
• ${data.netMargin < 15 ? 'Optimasi pricing strategy dan cost structure' : 'Pertahankan net margin dan fokus volume growth'}
• ${data.kompetitor ? 'Analisis kompetitor untuk menemukan celah pasar unik' : 'Lakukan riset kompetitor lebih mendalam'}`;

                // ROADMAP PENGEMBANGAN - Lebih singkat dan jelas
                roadmap = `**ROADMAP PENGEMBANGAN**
• Bulan 1-3: Fokus mencapai BEP ${data.bepUnits} unit/bulan dan brand awareness
• Bulan 4-6: ${data.paybackPeriod < 2 ? 'Mulai perencanaan ekspansi' : 'Konsolidasi operasi dan optimasi efisiensi'}
• Bulan 7-12: ${data.roi > 40 ? 'Implementasi scaling strategy' : 'Evaluasi ulang model bisnis dan pricing'}`;

                return `${kesimpulan}

${analisisMetrik}

${kekuatan}

${tantangan}

${rekomendasi}

${roadmap}`;
            };

            const mockReportAnalysis = generatePersonalizedAnalysis(data);
            return mockReportAnalysis;
        } else {
            // Mock response untuk analyze competitors
            const mockAnalyses = [
                "Berdasarkan analisis kompetitor, celah pasar yang bisa Anda ambil:\n• Fokus pada rasa lokal yang unik\n• Harga yang lebih terjangkau dari kompetitor\n• Lokasi strategis dekat kampus/perkantoran\n• Pelayanan yang lebih personal dan ramah",
                
                "Potensi keunggulan kompetitif Anda:\n• Menu yang tidak ada di kompetitor lain\n• Kualitas bahan baku yang lebih premium\n• Atmosfer tempat yang cozy dan Instagramable\n• Program loyalty untuk pelanggan tetap",
                
                "Strategi yang bisa diterapkan:\n• Diferensiasi produk dengan inovasi rasa\n• Marketing digital yang aktif di social media\n• Partnership dengan delivery service\n• Event dan promosi khusus hari tertentu"
            ];
            
            const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
            return randomAnalysis;
        }
    }
};

// --- MOCK FIREBASE UTILS ---
const mockFirebase = {
  saveProjectData: async (userId, projectId, data) => {
    console.log('Firebase: Saving data...', { userId, projectId, data });
    await new Promise(res => setTimeout(res, 500));
    if (Math.random() < 0.1) {
        console.error('Firebase: Gagal menyimpan data proyek.');
        return { success: false, error: 'Gagal menyimpan data proyek.' };
    }
    const newProjectId = projectId || `proj_${Date.now()}`;
    console.log(`Firebase: Data disimpan dengan ID proyek: ${newProjectId}`);
    return { success: true, projectId: newProjectId };
  },
  generatePdf: async (projectData) => {
    console.log('Firebase: Generating PDF...', { projectData });
    await new Promise(res => setTimeout(res, 1500));
    console.log('Firebase: PDF generated.');
    return { success: true, url: `https://mockstorage.com/pdfs/laporan_${projectData.ideBisnis.nama.replace(/\s/g, '_')}.pdf` };
  }
};

// Definisikan state awal untuk biaya operasional
const initialOperationalCosts = {
  tetap: [
    { id: 1, nama: 'Sewa Tempat/Kantor', jumlah: 0 },
    { id: 2, nama: 'Gaji Karyawan', jumlah: 0 },
  ],
  variabel: [
    { id: 1, nama: 'Bahan Baku Utama', perUnit: 0 },
    { id: 2, nama: 'Biaya Kemasan (Packaging)', perUnit: 0 },
  ],
};

// --- ZUSTAND STORE ---
const useWizardStore = create(
  persist(
    (set, get) => ({
      // STATE
      currentStep: 1,
      projectId: null,
      userId: 'user_123',
      lastInteraction: Date.now(),
      ideBisnis: { nama: '', deskripsi: '', kategori: '', industryKey: 'food' },
      risetPasar: { target: '', kompetitor: [], keyword: '', aiAnalysis: '' },
      keuangan: {
        modal: '',
        hargaJual: '',
        volume: '',
        operasional: initialOperationalCosts,
        metrics: {
          roi: 0,
          paybackPeriod: 0,
          irr: 0,
          bepUnits: 0,
          grossMargin: 0,
          netMargin: 0,
          totalFixedCosts: 0,
          totalVariableCostPerUnit: 0,
          monthlyNetProfit: 0,
          monthlyRevenue: 0,
          monthlyGrossProfit: 0,
        },
        scenario: {
          hargaBahan: 0,
          volumeJual: 0,
          biayaTetap: 0,
        }
      },
      laporan: { pdfUrl: null, isGenerating: false },
      uiState: { isGeneratingIdea: false, isAnalyzingCompetitors: false, isAnalyzingReport: false },
      
      // ACTIONS
      actions: {
        // --- Navigation ---
        nextStep: () => set(state => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
        prevStep: () => set(state => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
        goToStep: (step) => set({ currentStep: step }),

        // --- Data Updates ---
        updateData: (stepKey, data) => set(state => ({
            [stepKey]: { ...state[stepKey], ...data },
            lastInteraction: Date.now()
        })),
        addKompetitor: () => set(state => ({ 
          risetPasar: { 
            ...state.risetPasar, 
            kompetitor: [...state.risetPasar.kompetitor, { id: Date.now(), nama: '', keunggulan: '', harga: '' }] 
          }
        })),
        updateKompetitor: (index, field, value) => set(state => ({ 
          risetPasar: { 
            ...state.risetPasar, 
            kompetitor: state.risetPasar.kompetitor.map((k, i) => i === index ? { ...k, [field]: value } : k) 
          }
        })),
        removeKompetitor: (index) => set(state => ({ 
          risetPasar: { 
            ...state.risetPasar, 
            kompetitor: state.risetPasar.kompetitor.filter((_, i) => i !== index) 
          }
        })),
        setUiState: (key, value) => set(state => ({ uiState: { ...state.uiState, [key]: value }})),

        // --- Operational Costs Actions ---
        updateFixedCost: (index, field, value) => set(state => {
          const newFixedCosts = [...state.keuangan.operasional.tetap];
          newFixedCosts[index] = { ...newFixedCosts[index], [field]: value };
          return { 
            keuangan: { 
              ...state.keuangan, 
              operasional: { 
                ...state.keuangan.operasional, 
                tetap: newFixedCosts 
              }
            }
          };
        }),
        addFixedCost: () => set(state => {
          const newFixedCosts = [...state.keuangan.operasional.tetap, { id: Date.now(), nama: '', jumlah: 0 }];
          return { 
            keuangan: { 
              ...state.keuangan, 
              operasional: { 
                ...state.keuangan.operasional, 
                tetap: newFixedCosts 
              }
            }
          };
        }),
        removeFixedCost: (index) => set(state => {
          const newFixedCosts = state.keuangan.operasional.tetap.filter((_, i) => i !== index);
          return { 
            keuangan: { 
              ...state.keuangan, 
              operasional: { 
                ...state.keuangan.operasional, 
                tetap: newFixedCosts 
              }
            }
          };
        }),
        updateVariableCost: (index, field, value) => set(state => {
          const newVariableCosts = [...state.keuangan.operasional.variabel];
          newVariableCosts[index] = { ...newVariableCosts[index], [field]: value };
          return { 
            keuangan: { 
              ...state.keuangan, 
              operasional: { 
                ...state.keuangan.operasional, 
                variabel: newVariableCosts 
              }
            }
          };
        }),
        addVariableCost: () => set(state => {
          const newVariableCosts = [...state.keuangan.operasional.variabel, { id: Date.now(), nama: '', perUnit: 0 }];
          return { 
            keuangan: { 
              ...state.keuangan, 
              operasional: { 
                ...state.keuangan.operasional, 
                variabel: newVariableCosts 
              }
            }
          };
        }),
        removeVariableCost: (index) => set(state => {
          const newVariableCosts = state.keuangan.operasional.variabel.filter((_, i) => i !== index);
          return { 
            keuangan: { 
              ...state.keuangan, 
              operasional: { 
                ...state.keuangan.operasional, 
                variabel: newVariableCosts 
              }
            }
          };
        }),

        // --- Financial Metrics Actions ---
        updateFinancialMetrics: (newMetrics) => set(state => ({
          keuangan: { ...state.keuangan, metrics: { ...state.keuangan.metrics, ...newMetrics }}
        })),

        // --- Scenario Actions ---
        updateScenario: (key, value) => set(state => ({
          keuangan: { ...state.keuangan, scenario: { ...state.keuangan.scenario, [key]: value }}
        })),

        // --- Gemini-Powered Actions ---
        generateBusinessIdea: async () => {
            const { ideBisnis } = get();
            if (!ideBisnis.kategori) return;

            get().actions.setUiState('isGeneratingIdea', true);
            const prompt = `Anda adalah seorang konsultan bisnis yang kreatif. Berikan satu ide nama bisnis dan deskripsi singkat (maksimal 40 kata) untuk kategori bisnis: "${ideBisnis.kategori}". Nama harus unik dan mudah diingat. Deskripsi harus menarik. Jawab dalam format JSON.`;
            
            const result = await callGeminiAPI(prompt, true);
            
            if (result) {
                try {
                    const parsedResult = JSON.parse(result);
                    get().actions.updateData('ideBisnis', { nama: parsedResult.nama, deskripsi: parsedResult.deskripsi });
                } catch (e) {
                    console.error("Failed to parse Gemini JSON response", e);
                }
            }
            get().actions.setUiState('isGeneratingIdea', false);
        },

        analyzeCompetitors: async () => {
            const { ideBisnis, risetPasar } = get();
            if (risetPasar.kompetitor.length === 0) return;

            get().actions.setUiState('isAnalyzingCompetitors', true);
            get().actions.updateData('risetPasar', { aiAnalysis: '' });

            const competitorInfo = risetPasar.kompetitor.map(c => `- ${c.nama} (Keunggulan: ${c.keunggulan})`).join('\n');
            const prompt = `Anda adalah seorang analis bisnis strategis. Bisnis saya adalah "${ideBisnis.nama}". Kompetitor saya adalah:\n${competitorInfo}\n\n Berikan analisis singkat (maksimal 100 kata) tentang potensi celah pasar atau keunggulan unik yang bisa saya ambil. Berikan dalam format poin-poin singkat.`;
            
            const analysis = await callGeminiAPI(prompt);
            
            if (analysis) {
                get().actions.updateData('risetPasar', { aiAnalysis: analysis });
            }
            get().actions.setUiState('isAnalyzingCompetitors', false);
        },

        analyzeReportWithAI: async () => {
            const { ideBisnis, risetPasar, keuangan } = get();
            get().actions.setUiState('isAnalyzingReport', true);

            // Pastikan semua data keuangan bertipe number
            const modal = Number(keuangan.modal) || 0;
            const hargaJual = Number(keuangan.hargaJual) || 0;
            const volume = Number(keuangan.volume) || 0;
            const metrics = keuangan.metrics || {};
            const roi = Number(metrics.roi) || 0;
            const paybackPeriod = Number(metrics.paybackPeriod) || 0;
            const irr = Number(metrics.irr) || 0;
            const bepUnits = Number(metrics.bepUnits) || 0;
            const netMargin = Number(metrics.netMargin) || 0;
            const monthlyRevenue = Number(metrics.monthlyRevenue) || 0;
            const monthlyNetProfit = Number(metrics.monthlyNetProfit) || 0;

            // Prepare comprehensive data for AI analysis
            const businessData = {
                nama: ideBisnis.nama,
                kategori: ideBisnis.kategori,
                deskripsi: ideBisnis.deskripsi,
                targetPasar: risetPasar.target,
                kompetitor: risetPasar.kompetitor.map(c => `${c.nama} (${c.keunggulan})`).join(', '),
                modal,
                hargaJual,
                volume,
                metrics: {
                  roi,
                  paybackPeriod,
                  irr,
                  bepUnits,
                  netMargin,
                  monthlyRevenue,
                  monthlyNetProfit
                }
            };

            const prompt = `Anda adalah seorang Business Analyst Assistant profesional yang ahli dalam analisis kelayakan bisnis. \n\nBerdasarkan data bisnis berikut, berikan analisis yang PERSONAL dan SPESIFIK sesuai dengan data yang diinput user:\n\n**DATA BISNIS:**\n- Nama: ${businessData.nama}\n- Kategori: ${businessData.kategori}\n- Deskripsi: ${businessData.deskripsi}\n- Target Pasar: ${businessData.targetPasar}\n- Kompetitor: ${businessData.kompetitor}\n- Modal Awal: Rp ${modal.toLocaleString('id-ID')}\n- Harga Jual: Rp ${hargaJual.toLocaleString('id-ID')}\n- Volume/Bulan: ${volume}\n\n**METRIK KEUANGAN AKTUAL:**\n- ROI: ${roi.toFixed(2)}%\n- Payback Period: ${paybackPeriod.toFixed(1)} tahun\n- IRR: ${irr.toFixed(2)}%\n- BEP: ${Math.ceil(bepUnits)} unit/bulan\n- Net Margin: ${netMargin.toFixed(2)}%\n- Monthly Revenue: Rp ${monthlyRevenue.toLocaleString('id-ID')}\n- Monthly Net Profit: Rp ${monthlyNetProfit.toLocaleString('id-ID')}\n\nBerikan analisis yang PERSONAL dan SPESIFIK dalam format berikut:\n\n**KESIMPULAN UTAMA** (2-3 kalimat yang spesifik berdasarkan data di atas)\n\n**ANALISIS METRIK KEUANGAN** (analisis detail setiap metrik):\n• Dengan ROI ${roi.toFixed(2)}%, Anda perlu...\n• Payback Period ${paybackPeriod.toFixed(1)} tahun menunjukkan...\n• IRR ${irr.toFixed(2)}% mengindikasikan...\n• BEP ${Math.ceil(bepUnits)} unit/bulan berarti...\n\n**KEKUATAN BISNIS SPESIFIK** (berdasarkan data yang diinput):\n• [Sesuai dengan nama bisnis, kategori, dan target pasar]\n\n**TANTANGAN & RISIKO** (berdasarkan kompetitor dan metrik):\n• [Sesuai dengan data kompetitor dan analisis keuangan]\n\n**REKOMENDASI STRATEGIS KONKRET** (4-5 rekomendasi yang actionable):\n• [Rekomendasi spesifik berdasarkan ROI, BEP, dan target pasar]\n\n**ROADMAP PENGEMBANGAN** (berdasarkan metrik keuangan):\n• Bulan 1-3: [Sesuai dengan BEP dan cash flow]\n• Bulan 4-6: [Berdasarkan payback period]\n• Bulan 7-12: [Berdasarkan ROI dan IRR]\n\nGunakan data spesifik dari user dan berikan rekomendasi yang konkret dan actionable.`;

            const analysis = await callGeminiAPI(prompt);
            if (analysis) {
                set(state => ({
                    laporan: { 
                        ...state.laporan, 
                        aiAnalysis: analysis 
                    }
                }));
            }
            get().actions.setUiState('isAnalyzingReport', false);
        },
        
        // --- Validation ---
        validateStep: (step) => {
          const state = get();
          switch (step) {
            case 1:
              return !!(state.ideBisnis.nama.trim() && state.ideBisnis.kategori && state.ideBisnis.deskripsi.trim().length > 10);
            case 2:
              return !!(state.risetPasar.target.trim() && state.risetPasar.kompetitor.length > 0 && state.risetPasar.kompetitor.every(k => k.nama && k.keunggulan));
            case 3:
              const { modal, hargaJual, volume } = state.keuangan;
              return !!(Number(modal) > 0 && Number(hargaJual) > 0 && Number(volume) > 0);
            case 4:
                return get().actions.validateStep(1) && get().actions.validateStep(2) && get().actions.validateStep(3);
            default:
              return false;
          }
        },

        // --- Business Logic & API Calls ---
        autoSave: async () => {
            const { userId, projectId, ideBisnis, risetPasar, keuangan } = get();
            const dataToSave = { ideBisnis, risetPasar, keuangan };
            const result = await mockFirebase.saveProjectData(userId, projectId, dataToSave);
            if(result.success && !projectId){
                set({ projectId: result.projectId });
            }
        },
        generateAndUploadPdf: async () => {
            set({ laporan: { ...get().laporan, isGenerating: true } });
            const { ideBisnis, risetPasar, keuangan } = get();
            const result = await mockFirebase.generatePdf({ ideBisnis, risetPasar, keuangan });
            if (result.success) {
                set({ laporan: { pdfUrl: result.url, isGenerating: false } });
            } else {
                set({ laporan: { ...get().laporan, isGenerating: false } });
            }
        },

        // --- Utility ---
        resetWizard: () => set({
            currentStep: 1,
            projectId: null,
            lastInteraction: Date.now(),
            ideBisnis: { nama: '', deskripsi: '', kategori: '', industryKey: 'food' },
            risetPasar: { target: '', kompetitor: [], keyword: '', aiAnalysis: '' },
            keuangan: {
              modal: '',
              hargaJual: '',
              volume: '',
              operasional: initialOperationalCosts,
              metrics: {
                roi: 0,
                paybackPeriod: 0,
                irr: 0,
                bepUnits: 0,
                grossMargin: 0,
                netMargin: 0,
                totalFixedCosts: 0,
                totalVariableCostPerUnit: 0,
                monthlyNetProfit: 0,
                monthlyRevenue: 0,
                monthlyGrossProfit: 0,
              },
              scenario: {
                hargaBahan: 0,
                volumeJual: 0,
                biayaTetap: 0,
              }
            },
            laporan: { pdfUrl: null, isGenerating: false, aiAnalysis: '' },
        }),
        checkInactivity: () => (Date.now() - get().lastInteraction > 120000), // 2 minutes
        loadContoh: () => set({
            ideBisnis: {
                nama: 'Warung Kopi Sederhana',
                deskripsi: 'Warung kopi dengan konsep cozy dan menu unik seperti kopi durian, pisang bakar spesial, dan snack lokal. Target mahasiswa dan pekerja kantoran di sekitar kampus.',
                kategori: 'Makanan & Minuman',
                industryKey: 'food'
            },
            lastInteraction: Date.now(),
        }),
      }
    }),
    {
      name: 'bizfeasibility-pro-storage',
      storage: createJSONStorage(() => sessionStorage), 
      partialize: (state) => ({
        ...Object.fromEntries(Object.entries(state).filter(([key]) => !['actions', 'uiState'].includes(key))),
        laporan: { pdfUrl: null, isGenerating: false },
      }),
    }
  )
);

export default useWizardStore; 