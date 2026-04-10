import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, OrbitControls, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// ══════════════════════════════════════════════════════════════════════
//  SHARED UTILS
// ══════════════════════════════════════════════════════════════════════

function ArteryTube({ points, color, radius = 0.045, opacity = 0.9, speed = 1 }) {
  const curve  = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const ref    = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * speed * 4) * 0.5;
  });
  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 24, radius, 8, false]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.3} metalness={0.5} transparent opacity={opacity} />
    </mesh>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  LAYER 1 — MYOCARDIAL  (full anatomical beating heart)
// ══════════════════════════════════════════════════════════════════════

function MyocardialHeart({ riskScore }) {
  const groupRef = useRef();
  const innerRef = useRef();

  const isHigh   = riskScore > 65;
  const bodyCol  = isHigh ? '#7a0000' : '#8b0000';
  const emissCol = isHigh ? '#ff0000' : '#ff2244';
  const artCol   = isHigh ? '#ff4400' : '#ff6600';

  const leftCoronary  = useMemo(() => [new THREE.Vector3(-0.1, 0.8, 0.5), new THREE.Vector3(-0.5, 0.3, 0.8), new THREE.Vector3(-0.9, -0.2, 0.5), new THREE.Vector3(-0.8,-1.0, 0.0), new THREE.Vector3(-0.4,-1.3,-0.2)], []);
  const rightCoronary = useMemo(() => [new THREE.Vector3( 0.1, 0.8, 0.5), new THREE.Vector3( 0.6, 0.3, 0.7), new THREE.Vector3( 0.9,-0.2, 0.4), new THREE.Vector3( 0.85,-0.7,0.0), new THREE.Vector3( 0.5,-1.1,-0.3)], []);
  const diagBranch    = useMemo(() => [new THREE.Vector3(-0.5, 0.3, 0.8), new THREE.Vector3(-0.2,-0.2, 1.0), new THREE.Vector3( 0.2,-0.8, 0.7)], []);
  const aortaPath     = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(-0.2,1.2,0.2), new THREE.Vector3(-0.1,1.75,0.1), new THREE.Vector3( 0.2,1.9,0.0), new THREE.Vector3( 0.4,1.5,-0.2)]), []);
  const pulmoPath     = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3( 0.3,1.2,0.3), new THREE.Vector3( 0.5,1.55,0.1), new THREE.Vector3( 0.55,1.3,-0.15)]), []);

  useFrame(({ clock }) => {
    const t    = clock.getElapsedTime();
    const bpm  = 0.9 + riskScore / 55;
    const b1   = Math.max(0, Math.sin(t * bpm * Math.PI * 2)) ** 2;
    const b2   = Math.max(0, Math.sin(t * bpm * Math.PI * 2 - 1.1)) * 0.4;
    const s    = 1.0 + b1 * 0.09 + b2 * 0.04;
    if (groupRef.current) { groupRef.current.scale.set(s, s, s); groupRef.current.rotation.y += 0.003; groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.02; }
    if (innerRef.current) { innerRef.current.material.emissiveIntensity = 1.5 + b1 * 2.5; }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Glow shell */}
      <mesh><sphereGeometry args={[1.5, 32, 32]} /><meshStandardMaterial color={emissCol} emissive={emissCol} emissiveIntensity={0.08} transparent opacity={0.07} side={THREE.BackSide} /></mesh>
      {/* LV */}
      <mesh position={[-0.22,-0.2,0]}><sphereGeometry args={[1.1,32,32]} /><meshStandardMaterial color={bodyCol} emissive={emissCol} emissiveIntensity={0.4} roughness={0.65} metalness={0.18} /></mesh>
      {/* RV */}
      <mesh position={[0.42,-0.1,0.18]}><sphereGeometry args={[0.78,28,28]} /><meshStandardMaterial color={bodyCol} emissive={emissCol} emissiveIntensity={0.3} roughness={0.65} metalness={0.15} transparent opacity={0.95} /></mesh>
      {/* LA */}
      <mesh position={[-0.42,0.92,-0.1]}><sphereGeometry args={[0.5,24,24]} /><meshStandardMaterial color={bodyCol} emissive={emissCol} emissiveIntensity={0.35} roughness={0.5} metalness={0.25} /></mesh>
      {/* RA */}
      <mesh position={[0.42,0.82,0.14]}><sphereGeometry args={[0.42,24,24]} /><meshStandardMaterial color={bodyCol} emissive={emissCol} emissiveIntensity={0.3} roughness={0.5} metalness={0.22} /></mesh>
      {/* Apex */}
      <mesh position={[-0.14,-1.22,0.04]}><sphereGeometry args={[0.36,20,20]} /><meshStandardMaterial color={bodyCol} emissive={emissCol} emissiveIntensity={0.5} roughness={0.7} /></mesh>
      {/* Inner blood core */}
      <mesh ref={innerRef} position={[-0.08,-0.12,0.1]}><sphereGeometry args={[0.82,24,24]} /><meshStandardMaterial color="#cc0020" emissive="#ff0033" emissiveIntensity={1.5} transparent opacity={0.28} roughness={0} /></mesh>
      {/* Wireframe overlay */}
      <mesh><sphereGeometry args={[1.12,14,14]} /><meshBasicMaterial color={emissCol} wireframe transparent opacity={0.07} /></mesh>
      {/* Aorta */}
      <mesh><tubeGeometry args={[aortaPath,20,0.13,10,false]} /><meshStandardMaterial color={artCol} emissive={artCol} emissiveIntensity={0.8} roughness={0.3} metalness={0.6} /></mesh>
      {/* Pulmonary */}
      <mesh><tubeGeometry args={[pulmoPath,16,0.1,8,false]} /><meshStandardMaterial color={artCol} emissive={artCol} emissiveIntensity={0.7} roughness={0.4} metalness={0.5} transparent opacity={0.9} /></mesh>
      {/* Coronaries */}
      <ArteryTube points={leftCoronary}  color={artCol} radius={0.045} speed={riskScore/40} />
      <ArteryTube points={rightCoronary} color={artCol} radius={0.04}  speed={riskScore/40} />
      <ArteryTube points={diagBranch}    color={artCol} radius={0.03}  speed={riskScore/40} />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  LAYER 2 — VASCULAR  (arterial/vein tree network, blood flowing)
// ══════════════════════════════════════════════════════════════════════

function VascularNetwork({ riskScore }) {
  const groupRef  = useRef();
  const coreRef   = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.18;
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * (0.9 + riskScore / 50) * Math.PI * 2) * 0.12;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.material.emissiveIntensity = 1 + Math.max(0, Math.sin(t * 5)) * 1.5;
    }
  });

  const col  = riskScore > 65 ? '#ff2200' : '#00c8ff';
  const col2 = riskScore > 65 ? '#ff6600' : '#00f0ff';

  // Build a tree of arteries radiating from a central heart
  const vessels = useMemo(() => {
    const v = [];
    const addVessel = (from, to, r, off = 0) => v.push({ pts: [from, to], r, off });
    // Up (aorta and branches)
    addVessel(new THREE.Vector3(0,0,0), new THREE.Vector3(-0.2,2.0,0.1), 0.12, 0);
    addVessel(new THREE.Vector3(-0.1,1.5,0.1), new THREE.Vector3(-0.8,2.5,0.3), 0.08, 0.3);
    addVessel(new THREE.Vector3(-0.1,1.5,0.1), new THREE.Vector3( 0.6,2.4,0.2), 0.08, 0.5);
    addVessel(new THREE.Vector3(-0.1,1.5,0.1), new THREE.Vector3( 0.0,2.7,0.0), 0.07, 0.8);
    // Down (descending aorta)
    addVessel(new THREE.Vector3(0,0,0), new THREE.Vector3(0.2,-2.0,-0.1), 0.11, 0.1);
    addVessel(new THREE.Vector3(0.1,-1.0,-0.1), new THREE.Vector3(-0.6,-2.2,0.2), 0.07, 0.4);
    addVessel(new THREE.Vector3(0.1,-1.0,-0.1), new THREE.Vector3( 0.8,-2.1,0.3), 0.07, 0.6);
    // Left pulmonary vessels
    addVessel(new THREE.Vector3(0,0,0), new THREE.Vector3(-2.0, 0.4, 0.5), 0.09, 0.2);
    addVessel(new THREE.Vector3(-1.0,0.2,0.4), new THREE.Vector3(-3.0, 0.9, 0.6), 0.06, 0.4);
    addVessel(new THREE.Vector3(-1.0,0.2,0.4), new THREE.Vector3(-2.8,-0.4, 0.5), 0.055, 0.7);
    addVessel(new THREE.Vector3(-1.5,0.5,0.5), new THREE.Vector3(-2.2, 1.5, 0.4), 0.05, 0.9);
    // Right pulmonary vessels
    addVessel(new THREE.Vector3(0,0,0), new THREE.Vector3( 2.0, 0.4, 0.5), 0.09, 0.3);
    addVessel(new THREE.Vector3( 1.0,0.2,0.4), new THREE.Vector3( 3.0, 0.9, 0.6), 0.06, 0.5);
    addVessel(new THREE.Vector3( 1.0,0.2,0.4), new THREE.Vector3( 2.8,-0.4, 0.5), 0.055, 0.8);
    // Coronary-like surface
    addVessel(new THREE.Vector3(-0.1,0.7,0.8), new THREE.Vector3(-0.8,-0.5,0.9), 0.04, 0.6);
    addVessel(new THREE.Vector3( 0.2,0.6,0.8), new THREE.Vector3( 0.9,-0.4,0.8), 0.04, 0.5);
    return v;
  }, []);

  // Flowing blood particle balls
  const flowParticles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 180; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const r      = 0.4 + Math.random() * 2.8;
      const height = (Math.random() - 0.5) * 5;
      arr.push({ x: Math.cos(angle)*r, y: height, z: Math.sin(angle)*r*0.7, phase: Math.random()*Math.PI*2, speed: 0.5+Math.random()*1.5 });
    }
    return arr;
  }, []);

  return (
    <group>
      <group ref={groupRef}>
        {/* Vessel tubes */}
        {vessels.map((v, i) => {
          const curve = new THREE.CatmullRomCurve3(v.pts);
          return (
            <mesh key={i}>
              <tubeGeometry args={[curve, 12, v.r, 7, false]} />
              <meshStandardMaterial color={col} emissive={col2} emissiveIntensity={0.7 + v.off} roughness={0.3} metalness={0.6} transparent opacity={0.85} />
            </mesh>
          );
        })}
      </group>

      {/* Central heart pump */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color={riskScore > 65 ? '#cc0000' : '#004466'} emissive={col} emissiveIntensity={1} roughness={0.2} metalness={0.7} transparent opacity={0.85} />
      </mesh>

      {/* Blood flow particles along vessels */}
      {flowParticles.map((p, i) => {
        const FlowDot = () => {
          const meshRef = useRef();
          useFrame(({ clock }) => {
            if (!meshRef.current) return;
            const t = clock.getElapsedTime() * p.speed + p.phase;
            meshRef.current.position.set(
              p.x + Math.sin(t) * 0.15,
              p.y + Math.sin(t * 1.5 + p.phase) * 0.3,
              p.z + Math.cos(t) * 0.12
            );
            meshRef.current.material.opacity = 0.3 + Math.abs(Math.sin(t)) * 0.7;
          });
          return (
            <mesh ref={meshRef}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshBasicMaterial color={col2} transparent opacity={0.6} />
            </mesh>
          );
        };
        return <FlowDot key={i} />;
      })}
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  LAYER 3 — NEURAL  (nerve impulse electrical network)
// ══════════════════════════════════════════════════════════════════════

function NeuralNetwork({ riskScore }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.22;
  });

  const col    = riskScore > 65 ? '#ff6600' : '#a78bfa';
  const colHot = riskScore > 65 ? '#ff2200' : '#e040fb';

  // Node positions forming a brain-like cluster
  const nodes = useMemo(() => {
    const n = [];
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.4 + Math.random() * 1.2;
      n.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.85,
        r * Math.sin(phi) * Math.sin(theta)
      ));
    }
    return n;
  }, []);

  // Edges between nearby nodes (neural connections)
  const edges = useMemo(() => {
    const e = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.6) {
          e.push([nodes[i], nodes[j]]);
        }
      }
    }
    return e.slice(0, 90); // keep manageable
  }, [nodes]);

  // Impulse particles traveling along edges
  const impulses = useMemo(() => edges.slice(0, 40).map((e, i) => ({
    from: e[0], to: e[1],
    phase:  Math.random() * Math.PI * 2,
    speed:  1.5 + Math.random() * 3,
    color:  Math.random() > 0.5 ? col : colHot,
  })), [edges, col, colHot]);

  const ImpulseParticle = ({ from, to, phase, speed, color }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
      if (!ref.current) return;
      const t = ((clock.getElapsedTime() * speed + phase) % (Math.PI * 2)) / (Math.PI * 2);
      ref.current.position.lerpVectors(from, to, t);
      ref.current.material.emissiveIntensity = 1 + Math.sin(clock.getElapsedTime() * speed * 2) * 0.5;
    });
    return (
      <mesh ref={ref}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Central hub */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color={riskScore > 65 ? '#ff3300' : '#4c1d95'} emissive={col} emissiveIntensity={1.5} roughness={0.1} metalness={0.8} transparent opacity={0.85} />
      </mesh>

      {/* Neural connection lines */}
      {edges.map((e, i) => {
        const mid = new THREE.Vector3().addVectors(e[0], e[1]).multiplyScalar(0.5);
        mid.add(new THREE.Vector3((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3));
        const curve = new THREE.CatmullRomCurve3([e[0], mid, e[1]]);
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 6, 0.012, 4, false]} />
            <meshBasicMaterial color={i % 3 === 0 ? colHot : col} transparent opacity={0.35} />
          </mesh>
        );
      })}

      {/* Node spheres */}
      {nodes.map((n, i) => {
        const NodeSphere = () => {
          const ref = useRef();
          useFrame(({ clock }) => {
            if (ref.current) ref.current.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(clock.getElapsedTime() * (1 + i * 0.1))) * 2;
          });
          return (
            <mesh ref={ref} position={n}>
              <sphereGeometry args={[i % 7 === 0 ? 0.1 : 0.055, 8, 8]} />
              <meshStandardMaterial color={i % 5 === 0 ? colHot : col} emissive={i % 5 === 0 ? colHot : col} emissiveIntensity={1} />
            </mesh>
          );
        };
        return <NodeSphere key={i} />;
      })}

      {/* Impulse particles */}
      {impulses.map((imp, i) => <ImpulseParticle key={i} {...imp} />)}

      {/* Outer wireframe sphere */}
      <mesh><sphereGeometry args={[2.8, 18, 18]} /><meshBasicMaterial color={col} wireframe transparent opacity={0.07} /></mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  MAIN CANVAS — switches layer visualization
// ══════════════════════════════════════════════════════════════════════

export default function DigitalTwinCanvas({ riskScore = 20, activeLayer = 'Myocardial' }) {
  const isHigh = riskScore > 65;

  const lightConfig = {
    Myocardial: { main: isHigh ? '#ff0000' : '#ff3366', fill: '#330011', bg: '#050508' },
    Vascular:   { main: isHigh ? '#ff2200' : '#00e5ff', fill: '#001a33', bg: '#020810' },
    Neural:     { main: isHigh ? '#ff6600' : '#9d4edd', fill: '#1a0033', bg: '#060308' },
  };
  const lc = lightConfig[activeLayer] || lightConfig.Myocardial;

  return (
    <Canvas camera={{ position: [0, 0, 9.5], fov: 44 }} shadows className="w-full h-full">
      <color attach="background" args={[lc.bg]} />
      <fog   attach="fog"        args={[lc.bg, 14, 28]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[0,  4,  4]} intensity={5}   color={lc.main} castShadow />
      <pointLight position={[0, -3, -4]} intensity={2}   color={lc.fill} />
      <pointLight position={[-4, 0,  2]} intensity={2.5} color={lc.main} />
      <spotLight  position={[0,  8,  6]} intensity={3}   color="#ffffff" angle={0.4} castShadow />

      <PresentationControls
        global
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 1500 }}
      >
        {activeLayer === 'Myocardial' && <MyocardialHeart riskScore={riskScore} />}
        {activeLayer === 'Vascular'   && <VascularNetwork  riskScore={riskScore} />}
        {activeLayer === 'Neural'     && <NeuralNetwork    riskScore={riskScore} />}
      </PresentationControls>

      <Sparkles
        count={activeLayer === 'Neural' ? 800 : isHigh ? 400 : 150}
        scale={activeLayer === 'Vascular' ? 12 : 8}
        size={activeLayer === 'Neural' ? 5 : 2.5}
        speed={isHigh ? 2.5 : (activeLayer === 'Neural' ? 1.5 : 0.5)}
        color={lc.main}
      />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
