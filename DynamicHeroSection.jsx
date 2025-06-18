import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MatrixStream = () => {
  const [matrixColumns, setMatrixColumns] = useState([]);
  
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  useEffect(() => {
    const generateMatrixColumns = () => {
      const numColumns = window.innerWidth > 768 ? 10 : window.innerWidth > 480 ? 5 : 2;
      const columns = [];
      
      for (let i = 0; i < numColumns; i++) {
        const columnLength = Math.floor(Math.random() * 20) + 15;
        const characters = [];
        
        for (let j = 0; j < columnLength; j++) {
          characters.push({
            id: `${i}-${j}`,
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
            delay: Math.random() * 2,
            duration: Math.random() * 3 + 2
          });
        }
        
        columns.push({
          id: i,
          left: `${5 + i * 10}%`,
          duration: 7 + Math.random() * 6,
          delay: Math.random() * 2,
          characters
        });
      }
      
      setMatrixColumns(columns);
    };
    
    generateMatrixColumns();
    
    const handleResize = () => {
      setTimeout(generateMatrixColumns, 300);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {matrixColumns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute top-0 w-5 flex flex-col items-center"
          style={{ left: column.left }}
          animate={{
            y: ['-100%', '100vh']
          }}
          transition={{
            duration: column.duration,
            delay: column.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {column.characters.map((char) => (
            <motion.div
              key={char.id}
              className="text-[#0071e3] font-mono text-sm font-bold text-shadow-lg"
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-20, 0, 0, 20]
              }}
              transition={{
                duration: char.duration,
                delay: char.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {char.char}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const DynamicHeroSection = () => {
  return (
    <section className="bg-[#f8f8f8] py-30 overflow-hidden relative">
      {/* Matrix Data Stream Background */}
      <MatrixStream />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-15 items-center px-6 relative z-20">
        
        {/* LEFT COLUMN */}
        <motion.div 
          className="flex flex-col items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.h1 
            className="font-['SF_Pro_Display'] text-5xl lg:text-6xl font-bold leading-tight text-[#222] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            Analisis Kelayakan Bisnis Profesional
          </motion.h1>
          
          <motion.p 
            className="font-['SF_Pro_Text'] text-lg text-[#555] leading-relaxed font-normal mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Platform terdepan untuk menganalisis kelayakan bisnis dengan AI, dilengkapi kalkulasi keuangan akurat dan template industri terlengkap.
          </motion.p>
          
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <motion.button
              className="h-12 px-9 rounded-3xl bg-gradient-to-r from-[#0071e3] to-[#005bb5] text-white font-['SF_Pro_Display'] text-lg font-semibold shadow-lg relative overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 12px 32px rgba(0, 113, 227, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 17 
              }}
            >
              Mulai Analisis
            </motion.button>
            
            <motion.a 
              href="#" 
              className="text-[#0071e3] font-['SF_Pro_Text'] text-base font-medium border-b border-transparent hover:border-[#0071e3] transition-all duration-300"
              whileHover={{ y: -1 }}
            >
              Lihat Demo 1 Menit →
            </motion.a>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div 
          className="relative min-h-[400px] flex items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          
          {/* Background Accent Blob */}
          <motion.div 
            className="absolute left-1/2 top-1/2 w-96 h-72 bg-gradient-to-br from-[#e3f1fc] via-[#b3d8fa] to-[#e3f1fc] rounded-[100px_120px_100px_120px/120px_100px_120px_100px] blur-8 opacity-80 -z-10"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Animated Data Widgets */}
          <div className="relative z-10 flex flex-col gap-5">
            
            {/* ROI Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-5 w-50 h-30 cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [0, -6, 0]
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut", 
                delay: 0.8,
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
              }}
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[#0071e3] font-semibold tracking-wide">ROI</span>
                <span className="text-2xl font-bold text-[#222] mb-2">35.2%</span>
                <svg className="w-15 h-6" viewBox="0 0 60 24" fill="none">
                  <motion.polyline 
                    points="0,20 15,12 30,16 45,6 60,10" 
                    stroke="#0071e3" 
                    strokeWidth="2" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }}
                  />
                </svg>
              </div>
            </motion.div>
            
            {/* Bar Chart Widget */}
            <motion.div 
              className="bg-white rounded-full shadow-lg p-5 w-20 h-20 cursor-pointer relative overflow-hidden self-end"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
              }}
            >
              <div className="flex items-center justify-center h-full">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <motion.rect 
                    x="4" y="18" width="6" height="14" rx="2" 
                    fill="#0071e3"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeOut", 
                      delay: 1.4,
                      type: "spring",
                      stiffness: 200
                    }}
                  />
                  <motion.rect 
                    x="14" y="10" width="6" height="22" rx="2" 
                    fill="#0071e3"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeOut", 
                      delay: 1.5,
                      type: "spring",
                      stiffness: 200
                    }}
                  />
                  <motion.rect 
                    x="24" y="24" width="6" height="8" rx="2" 
                    fill="#0071e3"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeOut", 
                      delay: 1.6,
                      type: "spring",
                      stiffness: 200
                    }}
                  />
                </svg>
              </div>
            </motion.div>
            
            {/* Pie Chart Widget */}
            <motion.div 
              className="bg-white rounded-full shadow-lg p-5 w-20 h-20 cursor-pointer relative overflow-hidden self-end"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
              }}
            >
              <div className="flex items-center justify-center h-full">
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="#e3f1fc" />
                  <motion.path 
                    d="M18 18 L18 2 A16 16 0 1 1 6.7 29.3 Z" 
                    fill="#0071e3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 1.8 }}
                  />
                  <motion.path 
                    d="M18 18 L18 2 A16 16 0 0 1 34 18 Z" 
                    fill="#005bb5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 2.0 }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DynamicHeroSection; 