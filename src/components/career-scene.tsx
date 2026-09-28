"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type SkillNode = { name: string; score: number; evidence: string; group: string; color: string };
type Props = {
  mode: "hero" | "galaxy" | "skills";
  skills?: SkillNode[];
  activeSkill?: string;
  onSelectSkill?: (name: string) => void;
  reducedMotion?: boolean;
};

const conceptNodes = [
  { name: "PYTHON", color: "#77d8f4", position: [-2.1, 1.1, -0.3] as [number, number, number] },
  { name: "MACHINE LEARNING", color: "#ab9bff", position: [1.95, 1.18, 0.2] as [number, number, number] },
  { name: "SQL", color: "#e9b477", position: [-2.2, -0.86, 0.4] as [number, number, number] },
  { name: "DEEP LEARNING", color: "#a99af7", position: [2.25, -0.72, -0.1] as [number, number, number] },
  { name: "DOCKER", color: "#78d6b8", position: [-0.15, 2.25, -0.4] as [number, number, number] },
  { name: "CLOUD", color: "#78d6b8", position: [0.4, -2.25, -0.5] as [number, number, number] },
  { name: "SYSTEM DESIGN", color: "#76cdea", position: [-1.3, -1.9, -0.4] as [number, number, number] },
  { name: "STATISTICS", color: "#dc91b6", position: [1.36, 1.95, -0.5] as [number, number, number] },
  { name: "MLOPS", color: "#6bd6c1", position: [2.45, 0.35, -0.5] as [number, number, number] },
];

function NeuralCore({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const orbitA = useRef<THREE.Group>(null);
  const orbitB = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, state.pointer.y * 0.1, 3, delta);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -state.pointer.x * 0.08, 3, delta);
    }
    if (halo.current) halo.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.025);
    if (orbitA.current) orbitA.current.rotation.z += delta * 0.09;
    if (orbitB.current) orbitB.current.rotation.z -= delta * 0.055;
  });

  return <group ref={group}>
    <group ref={orbitA} rotation={[0.78, 0.33, 0]}>
      <mesh><torusGeometry args={[1.02, 0.008, 7, 100, 5.35]} /><meshStandardMaterial color="#7ed8ed" emissive="#44b9d5" emissiveIntensity={1.1} transparent opacity={0.76} /></mesh>
      <mesh rotation={[0, 0, 2.3]}><torusGeometry args={[1.02, 0.012, 7, 22, 0.28]} /><meshBasicMaterial color="#e6ffff" toneMapped={false} /></mesh>
    </group>
    <group ref={orbitB} rotation={[1.15, -0.4, 1.03]}>
      <mesh><torusGeometry args={[1.12, 0.005, 6, 100, 4.55]} /><meshStandardMaterial color="#b3a2fa" emissive="#806edf" emissiveIntensity={0.72} transparent opacity={0.45} /></mesh>
      <mesh rotation={[0, 0, 3.8]}><torusGeometry args={[1.12, 0.013, 7, 22, 0.22]} /><meshBasicMaterial color="#d7ceff" toneMapped={false} /></mesh>
    </group>
    <mesh><sphereGeometry args={[1.24, 32, 32]} /><meshBasicMaterial color="#5cb9d4" transparent opacity={0.018} side={THREE.BackSide} /></mesh>
    <mesh ref={halo}><icosahedronGeometry args={[0.84, 2]} /><meshPhysicalMaterial color="#4a8da5" emissive="#1c657d" emissiveIntensity={0.5} roughness={0.24} metalness={0.26} transparent opacity={0.26} wireframe /></mesh>
    <mesh><icosahedronGeometry args={[0.67, 1]} /><meshPhysicalMaterial color="#152b3b" emissive="#174d66" emissiveIntensity={0.78} roughness={0.18} metalness={0.36} transparent opacity={0.7} transmission={0.16} thickness={0.5} /></mesh>
    <mesh rotation={[0.44, 0.6, 0.2]}><octahedronGeometry args={[0.43, 0]} /><meshStandardMaterial color="#244454" emissive="#397792" emissiveIntensity={0.52} wireframe transparent opacity={0.82} /></mesh>
    <mesh rotation={[0.2, 0.5, 0.8]}><icosahedronGeometry args={[0.25, 1]} /><meshBasicMaterial color="#c5f5ff" wireframe transparent opacity={0.76} /></mesh>
    <mesh><dodecahedronGeometry args={[0.11, 1]} /><meshBasicMaterial color="#e6fbff" toneMapped={false} /></mesh>
    {Array.from({ length: 12 }, (_, index) => {
      const angle = index * Math.PI / 6;
      const point: [number, number, number] = [Math.cos(angle) * 0.61, Math.sin(angle) * 0.61, (index % 3 - 1) * 0.17];
      return <group key={index}><mesh position={point}><sphereGeometry args={[index % 3 === 0 ? 0.035 : 0.022, 10, 10]} /><meshBasicMaterial color={index % 4 === 0 ? "#b09cff" : "#9cecff"} /></mesh><Line points={[[0, 0, 0], point]} color="#89daf0" transparent opacity={0.28} lineWidth={0.7} /></group>;
    })}
    <pointLight color="#72dafa" intensity={1.3} distance={3.4} />
  </group>;
}

function SignalPulse({ start, end, color, phase, reducedMotion }: { start: [number, number, number]; end: [number, number, number]; color: string; phase: number; reducedMotion: boolean }) {
  const pulse = useRef<THREE.Mesh>(null);
  const startPoint = useMemo(() => new THREE.Vector3(...start), [start]);
  const endPoint = useMemo(() => new THREE.Vector3(...end), [end]);
  useFrame((state) => {
    if (!pulse.current || reducedMotion) return;
    const progress = (state.clock.elapsedTime * 0.16 + phase) % 1;
    pulse.current.position.lerpVectors(startPoint, endPoint, progress);
  });
  if (reducedMotion) return null;
  return <mesh ref={pulse} position={start}>
    <sphereGeometry args={[0.022, 10, 10]} />
    <meshBasicMaterial color={color} toneMapped={false} />
  </mesh>;
}

function OrbitNode({
  color,
  position,
  score = 50,
  selected = false,
  reducedMotion = false,
  onSelect,
  onHover,
}: {
  color: string;
  position: [number, number, number];
  score?: number;
  selected?: boolean;
  reducedMotion?: boolean;
  onSelect?: () => void;
  onHover?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const radius = 0.075 + Math.min(score, 100) * 0.00155;
  return <Float speed={reducedMotion ? 0 : 0.72} rotationIntensity={0.07} floatIntensity={0.12}>
    <group position={position} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); onHover?.(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }} onClick={(event) => { event.stopPropagation(); onSelect?.(); }}>
      <mesh scale={hovered || selected ? 1.34 : 1}><sphereGeometry args={[radius, 24, 24]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered || selected ? 1.45 : 0.58} roughness={0.26} metalness={0.18} /></mesh>
      {(hovered || selected) && <mesh><sphereGeometry args={[radius * 1.9, 20, 20]} /><meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.BackSide} /></mesh>}
    </group>
  </Float>;
}

function NeuralConnections({ nodes, focusIndex, reducedMotion }: { nodes: { position: [number, number, number]; color: string }[]; focusIndex?: number; reducedMotion: boolean }) {
  const pairs = useMemo(() => nodes.map((node, index) => [node.position, nodes[(index + 1) % nodes.length].position]), [nodes]);
  return <group>{pairs.map((points, index) => {
    const focus = focusIndex === undefined || index === focusIndex || (index + 1) % nodes.length === focusIndex;
    return <group key={index}><Line points={points} color={focus ? nodes[index].color : "#527187"} transparent opacity={focus ? 0.38 : 0.1} lineWidth={focus ? 0.8 : 0.5} />{index % 2 === 0 && <SignalPulse start={points[0]} end={points[1]} color={nodes[index].color} phase={index / nodes.length} reducedMotion={reducedMotion} />}</group>;
  })}</group>;
}

function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return <>
    <ambientLight intensity={0.6} />
    <pointLight position={[2, 2, 4]} color="#5ebddd" intensity={9} distance={8} />
    <pointLight position={[-3, -1, 2]} color="#8a69cf" intensity={4} distance={7} />
    <Sparkles count={reducedMotion ? 28 : 90} scale={[9, 6, 5]} size={1.35} speed={reducedMotion ? 0 : 0.13} opacity={0.6} color="#80c9e2" />
    <Float speed={reducedMotion ? 0 : 0.42} floatIntensity={0.1} rotationIntensity={0}>
      <NeuralCore reducedMotion={reducedMotion} />
      {conceptNodes.map((node, index) => <OrbitNode key={node.name} color={node.color} position={node.position} score={68 - index * 4} reducedMotion={reducedMotion} />)}
      <NeuralConnections nodes={conceptNodes.map((node) => ({ position: node.position, color: node.color }))} reducedMotion={reducedMotion} />
    </Float>
  </>;
}

function GalaxyScene({ skills, activeSkill, onSelectSkill, reducedMotion }: { skills: SkillNode[]; activeSkill: string; onSelectSkill?: (name: string) => void; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => skills.map((_, index): [number, number, number] => {
    const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2;
    const ring = index % 2 === 0 ? 1.68 : 2.12;
    return [Math.cos(angle) * ring, Math.sin(angle) * ring * 0.58, index % 3 === 0 ? 0.13 : -0.16];
  }), [skills]);
  const focusIndex = skills.findIndex((skill) => skill.name === activeSkill);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.12, 2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.09, 2, delta);
  });

  return <group ref={group}>
    <ambientLight intensity={0.7} />
    <pointLight position={[0, 0, 2]} intensity={4} color="#64cdeb" distance={7} />
    <Sparkles count={reducedMotion ? 12 : 32} scale={[6.5, 3.5, 2]} size={1.1} speed={reducedMotion ? 0 : 0.1} opacity={0.46} color="#77bdd5" />
    <mesh><sphereGeometry args={[0.48, 28, 28]} /><meshPhysicalMaterial color="#182b3b" emissive="#1e647b" emissiveIntensity={0.45} transparent opacity={0.58} wireframe /></mesh>
    <mesh><icosahedronGeometry args={[0.3, 1]} /><meshStandardMaterial color="#8cd9ed" emissive="#367c99" emissiveIntensity={0.72} wireframe /></mesh>
    <pointLight color="#50c4e6" intensity={1.6} distance={2.8} />
    {positions.map((position, index) => <group key={skills[index].name}>
      <Line points={[[0, 0, 0], position]} color={index === focusIndex ? skills[index].color : "#49687e"} transparent opacity={index === focusIndex ? 0.62 : 0.22} lineWidth={index === focusIndex ? 1.1 : 0.6} />
      {index % 2 === 0 && <SignalPulse start={[0, 0, 0]} end={position} color={skills[index].color} phase={index / Math.max(positions.length, 1)} reducedMotion={reducedMotion} />}
      {index < positions.length - 2 && <Line points={[position, positions[(index + 2) % positions.length]]} color="#4d607d" transparent opacity={0.13} lineWidth={0.45} />}
      <OrbitNode color={skills[index].color} position={position} score={skills[index].score} selected={index === focusIndex} reducedMotion={reducedMotion} onHover={() => onSelectSkill?.(skills[index].name)} onSelect={() => onSelectSkill?.(skills[index].name)} />
    </group>)}
  </group>;
}

export default function CareerScene({ mode, skills = [], activeSkill = "", onSelectSkill, reducedMotion = false }: Props) {
  const nodes = mode === "hero" ? conceptNodes : skills;
  const heightClass = mode === "hero" ? "career-scene scene-hero" : mode === "galaxy" ? "career-scene scene-galaxy" : "career-scene scene-skills";
  return <div className={heightClass} aria-label={mode === "hero" ? "Interactive neural career core" : "Interactive career skill graph"}>
    <Canvas camera={{ position: [0, 0, mode === "hero" ? 7.6 : 6], fov: mode === "hero" ? 40 : 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      {mode === "hero" ? <HeroScene reducedMotion={reducedMotion} /> : <GalaxyScene skills={nodes as SkillNode[]} activeSkill={activeSkill} onSelectSkill={onSelectSkill} reducedMotion={reducedMotion} />}
    </Canvas>
  </div>;
}