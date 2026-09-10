import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Small local material textures and a typographic nameplate; no network assets.
function makeStudioTextures() {
  const weave = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const i = (y * 64 + x) * 4;
    const value = ((x % 4 < 2) !== (y % 4 < 2)) ? 205 : 245;
    weave.set([value, value, value, 255], i);
  }
  const fabric = new THREE.DataTexture(weave, 64, 64);
  fabric.wrapS = fabric.wrapT = THREE.RepeatWrapping;
  fabric.repeat.set(22, 26);
  fabric.needsUpdate = true;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#172936';
  ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = '#a6dce5';
  ctx.font = '500 25px monospace';
  ctx.fillText('AHMED ZAFAR / DIGITAL WORKSPACE', 70, 95);
  ctx.fillStyle = '#f2e6d3';
  ctx.font = 'bold 104px sans-serif';
  ctx.fillText('SleepyAki.', 62, 256);
  ctx.fillStyle = '#cc9d62';
  ctx.fillRect(70, 310, 884, 3);
  ctx.fillStyle = '#bacbd3';
  ctx.font = '30px monospace';
  ctx.fillText('CODE. CREATE. KEEP LEARNING.', 70, 393);
  const sign = new THREE.CanvasTexture(canvas);
  sign.colorSpace = THREE.SRGBColorSpace;
  return { fabric, sign };
}

export default function StudioDetails() {
  const { fabric, sign } = useMemo(() => makeStudioTextures(), []);
  useEffect(() => () => { fabric.dispose(); sign.dispose(); }, [fabric, sign]);
  return <group>
    <group position={[0.88, 0.637, 1.32]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.38, 1.58]} /><meshStandardMaterial color="#35616a" map={fabric} roughness={1} />
      </mesh>
      {[-0.63, 0.63].map(x => <mesh key={x} receiveShadow position={[x, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.035, 1.48]} /><meshStandardMaterial color="#c5ad83" roughness={1} />
      </mesh>)}
      {[-0.73, 0.73].map(z => <mesh key={z} receiveShadow position={[0, 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.26, 0.035]} /><meshStandardMaterial color="#c5ad83" roughness={1} />
      </mesh>)}
    </group>
    {/* The slats and sign stay against the right wall, outside the walk bounds. */}
    {Array.from({ length: 15 }, (_, i) => <mesh key={i} position={[2.36, 2.08, 0.45 + i * 0.105]} receiveShadow>
      <boxGeometry args={[0.055, 1.56, 0.047]} /><meshStandardMaterial color={i % 3 === 0 ? '#a4815b' : '#87694d'} roughness={0.82} />
    </mesh>)}
    <group position={[2.30, 2.18, 1.185]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh><boxGeometry args={[1.18, 0.62, 0.04]} /><meshStandardMaterial color="#c59a61" roughness={0.45} metalness={0.35} /></mesh>
      <mesh position={[0, 0, 0.022]}><planeGeometry args={[1.12, 0.56]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
    </group>
    {/* Brass skirting finishes the two new walls without changing collisions. */}
    <mesh position={[2.39, 0.69, 0.59]}><boxGeometry args={[0.035, 0.12, 3.8]} /><meshStandardMaterial color="#887259" roughness={0.72} /></mesh>
    <mesh position={[0.49, 0.69, 2.485]}><boxGeometry args={[3.8, 0.12, 0.035]} /><meshStandardMaterial color="#887259" roughness={0.72} /></mesh>
  </group>;
}
