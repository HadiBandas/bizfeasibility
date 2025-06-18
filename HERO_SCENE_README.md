# HeroScene Component - 3D Interactive Hero Section

## Overview

The `HeroScene` component is a full-screen, interactive hero section featuring 3D animated cubes using Three.js and Framer Motion. It provides an engaging visual experience with mouse interaction, responsive design, and smooth animations. **This component now matches the exact content and styling from `homepage.html`**.

## Features

### 🎯 **Layout & Responsiveness**
- **Full-screen design**: 100vw × 100vh hero section
- **Responsive layout**: Optimized for mobile, tablet, and desktop
- **Content positioning**: Text and buttons positioned in foreground with high z-index
- **Tailwind CSS**: Modern styling with utility classes

### 🎲 **3D Cubes with Three.js**
- **40 animated cubes**: Rendered with collision detection
- **Variable sizes**: Cubes range from 0.2 to 0.5 units
- **Smart distribution**: No overlapping cubes (minimum 0.6 unit distance)
- **Bounding box**: x: -3 to 3, y: -2 to 2, z: -1 to -5
- **Performance optimized**: Uses `useMemo` and efficient rendering

### ✨ **Dynamic Animations**
- **Floating effect**: Sinusoidal up-down movement (4-8 second duration)
- **Rotation**: Slow rotation via `useFrame` (0.1-0.3 rad/s)
- **Framer Motion**: Smooth entrance animations with fade & scale
- **Interactive hover**: Cubes scale and change color on hover

### 🖱️ **Mouse Interaction**
- **Cursor tracking**: Special red cube follows mouse position
- **Smooth lerping**: Gradual movement to mouse coordinates
- **Button hover effect**: Camera zooms out when "Mulai Analisis" is hovered
- **3D coordinate mapping**: Mouse position converted to 3D space

### 🎨 **Visual Polish**
- **Professional lighting**: Ambient + point lights for depth
- **Gradient background**: Blue to white gradient canvas
- **Material properties**: Metalness, roughness, and transparency
- **Floating particles**: CSS-based particle overlay
- **Matrix data stream**: Animated falling characters in background

## Content Matching homepage.html

The component now includes:

### ✅ **Exact Text Content**
- **Title**: "Analisis Kelayakan Bisnis **Profesional**"
- **Subtitle**: "Platform terdepan untuk menganalisis kelayakan bisnis dengan AI, dilengkapi kalkulasi keuangan akurat dan template industri terlengkap."
- **Button**: "Mulai Analisis"
- **Link**: "Lihat Demo 1 Menit →"

### ✅ **Visual Elements**
- **ROI Card**: Shows 35.2% with animated line chart
- **Bar Chart Widget**: Animated bar chart with 3 bars
- **Pie Chart Widget**: Animated pie chart with blue slices
- **Matrix Background**: Falling data stream characters
- **Floating Particles**: 20 animated particles

### ✅ **Styling & Layout**
- **Grid Layout**: 2-column responsive grid
- **Typography**: Same font sizes and weights
- **Colors**: Blue gradient theme (#0071e3, #005bb5)
- **Animations**: Framer Motion entrance animations
- **Responsive**: Mobile-first design

## Installation & Dependencies

The component uses existing dependencies:
- `three` (already installed)
- `framer-motion` (already installed)
- `react` and `react-dom`

No additional packages required!

## Usage

### Basic Implementation

```jsx
import HeroScene from './components/HeroScene';

function App() {
  const handleStartAnalysis = () => {
    // Navigate to your wizard or analysis page
    window.location.href = '/wizard';
  };

  return (
    <HeroScene onStartAnalysis={handleStartAnalysis} />
  );
}
```

### Integration with React Router

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroScene from './components/HeroScene';

function App() {
  const handleStartAnalysis = () => {
    window.location.href = '/wizard';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroScene onStartAnalysis={handleStartAnalysis} />} />
        <Route path="/wizard" element={<WizardComponent />} />
      </Routes>
    </Router>
  );
}
```

## Component Structure

### ThreeScene Class
- **Scene management**: Handles Three.js scene, camera, and renderer
- **Cube generation**: Creates 40 cubes with collision detection
- **Animation loop**: Manages all 3D animations
- **Mouse interaction**: Handles cursor tracking and button hover effects

### MatrixStream Component
- **Matrix generation**: Creates falling data stream characters
- **Responsive columns**: Adapts to screen size (10/5/2 columns)
- **Character animation**: Random delays and durations
- **Window resize**: Recreates matrix on resize

### HeroScene Component
- **Layout management**: Responsive grid layout with content positioning
- **Event handling**: Mouse movement and button interactions
- **Animation coordination**: Syncs 3D scene with UI animations
- **Content rendering**: Hero text, buttons, and stat cards

## Key Features Explained

### 1. Collision Detection
```javascript
// Generate positions without overlapping
const minDistance = 0.6;
do {
  position = [
    (Math.random() - 0.5) * 6, // x: -3 to 3
    (Math.random() - 0.5) * 4, // y: -2 to 2
    -1 - Math.random() * 4,    // z: -1 to -5
  ];
  attempts++;
} while (
  attempts < 50 && 
  positions.some(pos => 
    Math.sqrt(
      Math.pow(position[0] - pos[0], 2) + 
      Math.pow(position[1] - pos[1], 2) + 
      Math.pow(position[2] - pos[2], 2)
    ) < minDistance
  )
);
```

### 2. Mouse Follower Cube
```javascript
// Smooth lerping to mouse position
const targetX = this.mousePosition.x * 3;
const targetY = this.mousePosition.y * 2;

this.followerCube.position.x += (targetX - this.followerCube.position.x) * 0.1;
this.followerCube.position.y += (targetY - this.followerCube.position.y) * 0.1;
```

### 3. Matrix Data Stream
```javascript
// Generate matrix characters
const matrixChars = '0123456789:. -|/\\';
const numColumns = window.innerWidth > 768 ? 10 : window.innerWidth > 480 ? 5 : 2;

for (let i = 0; i < numColumns; i++) {
  const column = document.createElement('div');
  column.className = 'matrix-column';
  // Add characters with random delays
}
```

## Customization Options

### Colors & Materials
```javascript
// Cube material properties
const material = new THREE.MeshStandardMaterial({
  color: 0x1d4ed8,        // Blue color
  transparent: true,
  opacity: 0.8,
  metalness: 0.1,
  roughness: 0.3
});

// Follower cube (red)
const followerMaterial = new THREE.MeshStandardMaterial({
  color: 0xef4444,        // Red color
  transparent: true,
  opacity: 0.9,
  metalness: 0.3,
  roughness: 0.2
});
```

### Animation Parameters
```javascript
// Floating speed: 4-8 seconds
const floatSpeed = 4 + Math.random() * 4;

// Rotation speed: 0.1-0.3 rad/s
const rotationSpeed = 0.1 + Math.random() * 0.2;

// Camera zoom on hover
if (this.isButtonHovered) {
  this.camera.position.z = 8;  // Zoomed out
} else {
  this.camera.position.z = 5;  // Normal view
}
```

## Performance Considerations

### Optimization Techniques
1. **Efficient rendering**: Uses `requestAnimationFrame` for smooth 60fps
2. **Memory management**: Proper cleanup in `destroy()` method
3. **Collision detection**: Limited to 50 attempts per cube
4. **Material reuse**: Shared materials for similar cubes
5. **Event optimization**: Debounced mouse movement handling
6. **Matrix optimization**: Responsive column count based on screen size

### Browser Compatibility
- **WebGL support**: Requires WebGL-capable browser
- **Three.js**: Compatible with modern browsers
- **CSS animations**: Fallback for older browsers

## Troubleshooting

### Common Issues

1. **Black screen**: Check WebGL support
   ```javascript
   if (!window.WebGLRenderingContext) {
     console.error('WebGL not supported');
   }
   ```

2. **Performance issues**: Reduce cube count
   ```javascript
   // Change from 40 to 20 cubes
   for (let i = 0; i < 20; i++) {
   ```

3. **Memory leaks**: Ensure proper cleanup
   ```javascript
   useEffect(() => {
     return () => {
       if (sceneRef.current) {
         sceneRef.current.destroy();
       }
     };
   }, []);
   ```

4. **Matrix not showing**: Check CSS classes
   ```css
   /* Ensure matrix-container is in index.css */
   .matrix-container {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     overflow: hidden;
     z-index: 1;
     pointer-events: none;
   }
   ```

## Demo Access

Visit `/hero-demo` route to see the component in action:
```
http://localhost:3000/hero-demo
```

## Comparison with homepage.html

### ✅ **Identical Content**
- Same title and subtitle text
- Same button text and styling
- Same widget cards (ROI, Bar Chart, Pie Chart)
- Same matrix background animation

### ✅ **Identical Styling**
- Same color scheme and gradients
- Same typography and spacing
- Same responsive breakpoints
- Same animation timings

### ✅ **Enhanced Features**
- **3D cubes**: Additional 3D interactive elements
- **Mouse tracking**: Special cube follows cursor
- **Performance**: Optimized React component
- **Maintainability**: Modular component structure

## Future Enhancements

### Potential Improvements
1. **Instanced rendering**: For better performance with more cubes
2. **Particle effects**: Additional visual effects
3. **Sound integration**: Audio feedback on interactions
4. **VR support**: WebXR compatibility
5. **Custom shaders**: Advanced visual effects

### Accessibility
1. **Keyboard navigation**: Support for keyboard-only users
2. **Reduced motion**: Respect `prefers-reduced-motion`
3. **Screen reader**: ARIA labels and descriptions
4. **High contrast**: Alternative color schemes

## License

This component is part of the BizFeasibility Pro project and follows the same licensing terms.

---

**Created with ❤️ for the BizFeasibility Pro team**

**Updated to match homepage.html content exactly** 