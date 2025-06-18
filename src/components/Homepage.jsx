import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero3DCube from './Hero3DCube';
import { motion } from 'framer-motion';

export default function Homepage() {
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);
  const matrixContainerRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsLightMode(savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      localStorage.setItem('theme', !prev ? 'light' : 'dark');
      return !prev;
    });
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Matrix Stream Generator
  useEffect(() => {
    const createMatrixStream = () => {
      const matrixContainer = matrixContainerRef.current;
      if (!matrixContainer) return;

      // Matrix characters (professional data stream)
      const matrixChars = '0123456789:. -|/\\';
      
      // Number of columns to create
      const numColumns = window.innerWidth > 768 ? 10 : window.innerWidth > 480 ? 5 : 2;
      
      // Clear existing columns
      matrixContainer.innerHTML = '';
      
      for (let i = 0; i < numColumns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        
        // Generate random characters for this column
        const columnLength = Math.floor(Math.random() * 20) + 15; // 15-35 characters
        for (let j = 0; j < columnLength; j++) {
          const char = document.createElement('div');
          char.className = 'matrix-character';
          char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          
          // Random animation delay for each character
          char.style.animationDelay = `${Math.random() * 2}s`;
          char.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2-5s
          
          column.appendChild(char);
        }
        
        matrixContainer.appendChild(column);
      }
    };

    createMatrixStream();
    
    // Recreate matrix stream on window resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(createMatrixStream, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Update matrix characters periodically
  useEffect(() => {
    const updateMatrixCharacters = () => {
      const matrixChars = document.querySelectorAll('.matrix-character');
      const matrixCharSet = '0123456789:. -|/\\';
      
      matrixChars.forEach(char => {
        // Randomly update some characters
        if (Math.random() < 0.1) { // 10% chance to update
          char.textContent = matrixCharSet[Math.floor(Math.random() * matrixCharSet.length)];
        }
      });
    };

    const interval = setInterval(updateMatrixCharacters, 2000);
    return () => clearInterval(interval);
  }, []);

  // Add interactive effects to widgets
  useEffect(() => {
    const heroWidgets = document.querySelectorAll('.hero-dynamic-widget');
    
    heroWidgets.forEach(widget => {
      // Add subtle scale effect on hover
      const handleMouseEnter = () => {
        widget.style.transform = 'translateY(-12px) scale(1.02)';
        widget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
      };
      
      const handleMouseLeave = () => {
        widget.style.transform = 'translateY(0) scale(1)';
        widget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
      };
      
      // Add click ripple effect
      const handleClick = (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 113, 227, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
          z-index: 10;
        `;
        
        const rect = widget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        widget.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      };
      
      widget.addEventListener('mouseenter', handleMouseEnter);
      widget.addEventListener('mouseleave', handleMouseLeave);
      widget.addEventListener('click', handleClick);
      
      return () => {
        widget.removeEventListener('mouseenter', handleMouseEnter);
        widget.removeEventListener('mouseleave', handleMouseLeave);
        widget.removeEventListener('click', handleClick);
      };
    });
  }, []);

  // Enhanced button interactions
  useEffect(() => {
    const heroBtn = document.querySelector('.hero-dynamic-btn');
    if (heroBtn) {
      const handleMouseEnter = () => {
        heroBtn.style.transform = 'scale(1.05) translateY(-2px)';
        heroBtn.style.boxShadow = '0 12px 32px rgba(0, 113, 227, 0.3)';
      };
      
      const handleMouseLeave = () => {
        heroBtn.style.transform = 'scale(1) translateY(0)';
        heroBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)';
      };
      
      const handleMouseMove = (e) => {
        const rect = heroBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        heroBtn.style.transform = `scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
      };
      
      heroBtn.addEventListener('mouseenter', handleMouseEnter);
      heroBtn.addEventListener('mouseleave', handleMouseLeave);
      heroBtn.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        heroBtn.removeEventListener('mouseenter', handleMouseEnter);
        heroBtn.removeEventListener('mouseleave', handleMouseLeave);
        heroBtn.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div className={isLightMode ? 'light-mode' : ''}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-blue-900 to-blue-700 opacity-90">
          <div className="loader border-4 border-white border-t-blue-400 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      <nav className={`w-full fixed top-0 z-40 ${isLightMode ? 'bg-white/90' : 'bg-blue-900/80'} backdrop-blur`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="font-extrabold text-2xl bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
            BizFeasibility Pro 🚀
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="font-medium hover:text-blue-500">Fitur</a>
            <a href="#how-it-works" className="font-medium hover:text-blue-500">Cara Kerja</a>
            <a href="#pricing" className="font-medium hover:text-blue-500">Harga</a>
            <a href="#contact" className="font-medium hover:text-blue-500">Kontak</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="border px-3 py-1 rounded-full text-sm"
            >
              {isLightMode ? '💡 Dark Mode' : '☀️ Light Mode'}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="ml-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </nav>

      <section className="hero-dynamic pt-32 pb-20 bg-gray-50 min-h-screen flex items-center" id="hero-dynamic-3d">
        <div ref={matrixContainerRef} className="matrix-container absolute inset-0 z-1 pointer-events-none">
          {/* Matrix columns will be generated by JavaScript */}
        </div>
        
        <div className="hero-dynamic-container max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
          <div className="hero-dynamic-left">
            <h1 className="hero-dynamic-title text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              Analisis Kelayakan Bisnis <span className="bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">Profesional</span>
            </h1>
            <p className="hero-dynamic-subtitle text-lg text-gray-600 mb-8">
              Platform terdepan untuk menganalisis kelayakan bisnis dengan AI, dilengkapi kalkulasi keuangan akurat dan template industri terlengkap.
            </p>
            <div className="hero-dynamic-actions flex gap-4">
              <button
                onClick={() => navigate('/register')}
                className="hero-dynamic-btn bg-gradient-to-r from-blue-400 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition"
              >
                Mulai Analisis
              </button>
              <a href="#features" className="hero-dynamic-link text-blue-600 font-medium underline underline-offset-2 flex items-center">
                Lihat Demo 1 Menit &rarr;
              </a>
            </div>
          </div>
          
          <div className="hero-dynamic-right relative flex flex-col items-center">
            {/* 3D Cube Canvas */}
            <div style={{position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Hero3DCube width={400} height={300} />
            </div>
            {/* Background Accent Blob */}
            <div className="hero-dynamic-blob absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-60 bg-gradient-to-br from-blue-100 to-blue-300 rounded-3xl blur-2xl opacity-70"></div>
            {/* Animated Data Widgets */}
            <div className="hero-dynamic-widgets relative z-2 flex flex-col gap-5">
              {/* ROI Card */}
              <div className="hero-dynamic-widget hero-dynamic-roi bg-white rounded-2xl shadow-xl p-6 w-80">
                <div className="hero-dynamic-roi-content">
                  <span className="hero-dynamic-widget-label text-sm text-blue-600 font-semibold">ROI</span>
                  <span className="hero-dynamic-widget-value text-2xl font-bold text-gray-900">35.2%</span>
                  <svg className="hero-dynamic-roi-chart w-16 h-6" viewBox="0 0 60 24" fill="none">
                    <polyline className="hero-dynamic-roi-line" points="0,20 15,12 30,16 45,6 60,10" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
              {/* Bar Chart Widget */}
              <div className="hero-dynamic-widget hero-dynamic-bar bg-white rounded-2xl shadow-xl p-6 w-20 h-20 self-end">
                <div className="hero-dynamic-bar-content flex items-center justify-center h-full">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect className="hero-dynamic-bar-rect" x="4" y="18" width="6" height="14" rx="2" fill="#3b82f6" />
                    <rect className="hero-dynamic-bar-rect" x="14" y="10" width="6" height="22" rx="2" fill="#3b82f6" />
                    <rect className="hero-dynamic-bar-rect" x="24" y="24" width="6" height="8" rx="2" fill="#3b82f6" />
                  </svg>
                </div>
              </div>
              {/* Pie Chart Widget */}
              <div className="hero-dynamic-widget hero-dynamic-pie bg-white rounded-2xl shadow-xl p-6 w-20 h-20 self-end">
                <div className="hero-dynamic-pie-content flex items-center justify-center h-full">
                  <svg width="36" height="36" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="#e3f1fc" />
                    <path className="hero-dynamic-pie-slice" d="M18 18 L18 2 A16 16 0 1 1 6.7 29.3 Z" fill="#3b82f6" />
                    <path className="hero-dynamic-pie-slice" d="M18 18 L18 2 A16 16 0 0 1 34 18 Z" fill="#1d4ed8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="main-features py-20 bg-gray-100" id="features">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
          <div className="main-features-mockup flex justify-center">
            <motion.div
              className="dashboard-mockup bg-white rounded-2xl shadow-xl p-8 w-80"
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'ROI', value: '35.2%' },
                  { label: 'IRR', value: '28.5%' },
                  { label: 'Payback Period', value: '2.1 tahun' },
                  { label: 'BEP', value: '850 unit' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="flex justify-between"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + idx * 0.15, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-blue-600">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="main-features-list">
            <h2 className="main-features-title text-3xl font-bold mb-8">Detail Fitur Utama</h2>
            <ul className="space-y-8">
              <li className="main-feature-item">
                <h3 className="text-xl font-bold mb-2">AI Bisnis</h3>
                <p className="text-gray-600">Dapatkan wawasan bisnis cerdas dan ide inovatif dengan kekuatan AI terdepan.</p>
              </li>
              <li className="main-feature-item">
                <h3 className="text-xl font-bold mb-2">Kalkulator Pro</h3>
                <p className="text-gray-600">Hitung ROI, IRR, dan Payback Period dengan akurasi tinggi untuk keputusan finansial yang solid.</p>
              </li>
              <li className="main-feature-item">
                <h3 className="text-xl font-bold mb-2">Scenario Simulator</h3>
                <p className="text-gray-600">Analisis berbagai skenario pasar dan keuangan untuk memahami dampak potensial pada bisnis Anda.</p>
              </li>
              <li className="main-feature-item">
                <h3 className="text-xl font-bold mb-2">Laporan Otomatis</h3>
                <p className="text-gray-600">Hasilkan laporan kelayakan bisnis siap presentasi dalam format Excel dan PDF secara otomatis.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stats py-20 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title text-3xl font-bold mb-12">Dipercaya Ribuan Pengusaha</h2>
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item">
              <div className="stat-number text-4xl font-bold text-blue-600">5,000+</div>
              <div className="stat-label text-gray-600">Bisnis Dianalisis</div>
            </div>
            <div className="stat-item">
              <div className="stat-number text-4xl font-bold text-blue-600">8</div>
              <div className="stat-label text-gray-600">Template Industri</div>
            </div>
            <div className="stat-item">
              <div className="stat-number text-4xl font-bold text-blue-600">95%</div>
              <div className="stat-label text-gray-600">Akurasi Prediksi</div>
            </div>
            <div className="stat-item">
              <div className="stat-number text-4xl font-bold text-blue-600">24/7</div>
              <div className="stat-label text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="cta-content">
            <h2 className="text-3xl font-bold mb-6">Mulai Analisis Bisnis Anda Sekarang</h2>
            <p className="text-xl mb-8 opacity-90">Dapatkan laporan kelayakan bisnis profesional dalam hitungan menit. Gratis untuk analisis pertama!</p>
            <div className="cta-buttons flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-white bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Mulai Gratis
              </button>
              <a href="#features" className="btn-secondary border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer py-12 bg-gray-900 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="mb-2">&copy; 2025 BizFeasibility Pro. Semua hak dilindungi.</p>
          <p className="mb-6">Dibuat dengan ❤️ untuk pengusaha Indonesia</p>
          <div className="footer-links flex gap-8 justify-center">
            <a href="#" className="hover:text-blue-400 transition">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-blue-400 transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-blue-400 transition">Hubungi Kami</a>
            <a href="#" className="hover:text-blue-400 transition">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}