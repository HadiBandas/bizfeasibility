import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function randomPosition(existing, minDist, bounds, maxTry = 100) {
  let tryCount = 0;
  while (tryCount < maxTry) {
    const pos = [
      THREE.MathUtils.randFloat(bounds.x[0], bounds.x[1]),
      THREE.MathUtils.randFloat(bounds.y[0], bounds.y[1]),
      THREE.MathUtils.randFloat(bounds.z[0], bounds.z[1]),
    ];
    if (
      existing.every(
        (e) =>
          Math.sqrt(
            Math.pow(e[0] - pos[0], 2) +
              Math.pow(e[1] - pos[1], 2) +
              Math.pow(e[2] - pos[2], 2)
          ) >= minDist
      )
    ) {
      return pos;
    }
    tryCount++;
  }
  return null;
}

const CUBE_COLOR = 0x23272f; // dark blue/black
const CUBE_OPACITY = 0.92;
const CUBE_COUNT = 38;
const CUBE_SIZE_MIN = 0.32;
const CUBE_SIZE_MAX = 0.7;
const CUBE_MIN_DIST = 0.7;
const CUBE_BOUNDS = {
  x: [0.5, 3.5], // right side
  y: [-1.7, 1.7],
  z: [-2.5, 1.5],
};

function useThreeCubes(canvasRef, mouseRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    // Scene
    const scene = new THREE.Scene();
    // Camera
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    camera.position.set(2.2, 0, 7.5);
    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const point = new THREE.PointLight(0xffffff, 0.7);
    point.position.set(5, 5, 7);
    scene.add(point);
    // Group for all cubes
    const group = new THREE.Group();
    scene.add(group);
    // Generate non-overlapping positions
    const positions = [];
    for (let i = 0; i < CUBE_COUNT; i++) {
      const pos = randomPosition(positions, CUBE_MIN_DIST, CUBE_BOUNDS);
      if (pos) positions.push(pos);
    }
    // Create cubes
    const cubes = positions.map((pos, idx) => {
      const size = THREE.MathUtils.randFloat(CUBE_SIZE_MIN, CUBE_SIZE_MAX);
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshStandardMaterial({
        color: CUBE_COLOR,
        transparent: true,
        opacity: CUBE_OPACITY,
        roughness: 0.32,
        metalness: 0.18,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.userData = {
        floatSpeed: 4 + Math.random() * 4,
        floatPhase: Math.random() * Math.PI * 2,
        rotSpeed: 0.008 + Math.random() * 0.012,
        baseY: pos[1],
      };
      group.add(mesh);
      return mesh;
    });
    // Mouse interaction
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // Map to -1..1
      targetRotY = (x - 0.5) * 0.7; // left-right
      targetRotX = (y - 0.5) * 0.5; // up-down
    }
    window.addEventListener('mousemove', onMouseMove);
    // Animation loop
    let running = true;
    function animate() {
      if (!running) return;
      // Floating & rotation per cube
      const t = performance.now() * 0.001;
      cubes.forEach((cube) => {
        cube.position.y = cube.userData.baseY + Math.sin(t / cube.userData.floatSpeed + cube.userData.floatPhase) * 0.22;
        cube.rotation.x += cube.userData.rotSpeed;
        cube.rotation.y += cube.userData.rotSpeed * 0.7;
      });
      // Group rotation (cursor following)
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      group.rotation.x = currentRotX;
      group.rotation.y = currentRotY;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
    // Cleanup
    return () => {
      running = false;
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, [canvasRef, mouseRef]);
}

export default function HeroScene({ onStartAnalysis }) {
  const canvasRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  useThreeCubes(canvasRef, mouseRef);
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(120deg, #e3f1fc 0%, #fafdff 100%)', overflow: 'hidden' }}>
      {/* 3D Canvas (right half, absolute) */}
      <div className="absolute inset-0 flex justify-end items-center pointer-events-none" style={{zIndex:1}}>
        <canvas
          ref={canvasRef}
          width={900}
          height={700}
          style={{ width: '60vw', height: '90vh', maxWidth: 900, maxHeight: 700, minWidth: 320, minHeight: 320, display: 'block', filter: 'drop-shadow(0 8px 40px #23272f33)' }}
        />
      </div>
      {/* Floating widgets (ROI, bar, pie) */}
      <div className="absolute right-[16vw] top-[22vh] flex flex-col gap-6 z-10" style={{ pointerEvents: 'auto' }}>
        {/* ROI Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl px-7 py-5 flex items-center gap-6" style={{ minWidth: 220, minHeight: 70 }}>
          <div>
            <div className="text-xs font-semibold text-blue-700 mb-1">ROI</div>
            <div className="text-2xl font-bold text-gray-900">35.2%</div>
          </div>
          <svg width="60" height="28" viewBox="0 0 60 24" fill="none">
            <polyline points="0,20 15,12 30,16 45,6 60,10" stroke="#3b82f6" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
        {/* Bar Chart Widget */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center" style={{ width: 56, height: 56 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="18" width="6" height="14" rx="2" fill="#3b82f6" />
            <rect x="14" y="10" width="6" height="22" rx="2" fill="#3b82f6" />
            <rect x="24" y="24" width="6" height="8" rx="2" fill="#3b82f6" />
          </svg>
        </motion.div>
        {/* Pie Chart Widget */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center" style={{ width: 56, height: 56 }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="#e3f1fc" />
            <path d="M18 18 L18 2 A16 16 0 1 1 6.7 29.3 Z" fill="#3b82f6" />
            <path d="M18 18 L18 2 A16 16 0 0 1 34 18 Z" fill="#1d4ed8" />
          </svg>
        </motion.div>
      </div>
      {/* Left Content */}
      <div className="relative z-10 flex flex-col items-start justify-center pl-[8vw] pr-[2vw] w-[40vw] min-w-[320px] max-w-[520px]">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Analisis Kelayakan Bisnis <span className="text-blue-600">Profesional</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Platform terdepan untuk menganalisis kelayakan bisnis dengan AI, dilengkapi kalkulasi keuangan akurat dan template industri terlengkap.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-row gap-4 mb-2">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px #3b82f655" }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartAnalysis}
            className="bg-blue-600 text-white px-7 py-3 rounded-full font-semibold text-base shadow hover:bg-blue-700 transition-all duration-200"
            style={{ boxShadow: '0 4px 16px #3b82f633' }}
          >
            Mulai Analisis
          </motion.button>
          <a href="#features" className="text-blue-600 font-semibold text-base underline underline-offset-4 flex items-center hover:text-blue-700 transition-colors">
            Lihat Demo 1 Menit →
          </a>
        </motion.div>
      </div>
      {/* Floating blue dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(22)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
} 