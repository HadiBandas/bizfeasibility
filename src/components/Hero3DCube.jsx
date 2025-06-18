import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Hero3DCube({ width = 400, height = 300 }) {
  const canvasRef = useRef(null);
  const groupRef = useRef();

  useEffect(() => {
    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Group for all cubes
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Cube materials
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.9 }),
    ];

    // Create cubes
    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = materials[i % materials.length];
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      group.add(cube);
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Mouse tracking for group movement and rotation
    let targetRotX = 0, targetRotY = 0;
    let targetPosX = 0, targetPosY = 0;
    let currentRotX = 0, currentRotY = 0;
    let currentPosX = 0, currentPosY = 0;

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetPosX = (x / (rect.width / 2)) * 3;
      targetPosY = (y / (rect.height / 2)) * -2;
      targetRotY = (x / (rect.width / 2)) * 0.3;
      targetRotX = (y / (rect.height / 2)) * -0.2;
    };
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let running = true;
    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      // Animate individual cubes
      group.children.forEach(function(cube, idx) {
        cube.rotation.x += 0.01 + idx * 0.002;
        cube.rotation.y += 0.01 + idx * 0.003;
        cube.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.002;
      });
      // Smooth group movement (follow mouse)
      currentPosX += (targetPosX - currentPosX) * 0.05;
      currentPosY += (targetPosY - currentPosY) * 0.05;
      group.position.x = currentPosX;
      group.position.y = currentPosY;
      // Smooth group rotation (tilt effect)
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      group.rotation.x = currentRotX;
      group.rotation.y = currentRotY;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      running = false;
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ opacity: 0.55, filter: 'blur(0.5px)', borderRadius: '18px', boxShadow: '0 8px 40px #0a1830cc' }}
    />
  );
}
