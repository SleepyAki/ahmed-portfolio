import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const POSTERS = ['Object_182', 'Object_82', 'Object_84'];
const PANELS = ['Object_192', 'Object_194', 'Object_196', 'Object_198', 'Object_200'];
const PANEL_COLORS = ['#ffb96f', '#ffd5a1', '#9bafff', '#78d6ed', '#60c9e6'];

// Clone only materials and edited textures; the cached model geometry is shared.
// Returning to the room therefore never accumulates changes on the source GLTF.
function prepareRoom(source) {
  const room = source.clone(true);
  const materials = [];
  const textures = [];
  room.traverse(child => {
    if (!child.isMesh) return;
    child.material = child.material.clone();
    materials.push(child.material);
    child.castShadow = !['Object_204', 'Object_206', 'Object_208', 'Object_146', 'Object_221'].includes(child.name);
    child.receiveShadow = true;
    child.frustumCulled = !['Object_204', 'Object_146', 'Object_221'].includes(child.name);
    child.material.envMapIntensity = 0.35;
  });
  const finish = (names, color, roughness = 0.7, metalness = 0) => {
    names.forEach(name => {
      const material = room.getObjectByName(name)?.material;
      if (!material) return;
      material.color.set(color);
      material.roughness = roughness;
      material.metalness = metalness;
    });
  };
  finish(['Object_206', 'Object_208'], '#344555', 0.96);
  finish(['Object_202'], '#397e83', 0.96);
  finish(['Object_172', 'Object_174'], '#e3d9c5', 0.95);
  finish(['Object_160', 'Object_170'], '#614835', 0.85);
  finish(['Object_140', 'Object_142', 'Object_144'], '#ad8054', 0.7);
  finish(['Object_152', 'Object_154', 'Object_156', 'Object_265'], '#293a46', 0.45, 0.35);
  finish(['Object_237'], '#70533f', 0.85);
  finish(['Object_239', 'Object_241', 'Object_243'], '#967251', 0.78);
  finish(['Object_176', 'Object_178', 'Object_180'], '#be9b66', 0.4, 0.35);
  finish(['Object_204'], '#c2a984', 0.82);
  finish(['Object_146', 'Object_221'], '#222a34', 1);
  finish(['Object_4'], '#283748', 0.38, 0.45);
  finish(['Object_6', 'Object_150'], '#52728a', 0.3, 0.55);
  finish(['Object_136'], '#d0dbe5', 0.12, 0.94);
  const mirror = room.getObjectByName('Object_136')?.material;
  if (mirror) mirror.envMapIntensity = 1.4;
  finish(['Object_184', 'Object_253', 'Object_255', 'Object_257'], '#ddad6c', 0.62);
  const glow = (name, color, intensity) => {
    const material = room.getObjectByName(name)?.material;
    if (!material) return;
    material.emissive.set(color);
    material.emissiveIntensity = intensity;
  };
  glow('Object_184', '#ffb366', 0.12);
  glow('Object_190', '#ffd7a0', 2.6);
  glow('Object_4', '#50bfe0', 0.08);
  glow('Object_6', '#5ce1f0', 0.3);
  glow('Object_20', '#72b8e8', 0.5);
  glow('Object_219', '#63bed5', 0.5);
  const screen = room.getObjectByName('Object_158')?.material;
  if (screen) {
    screen.emissive.set('#d9eaff');
    screen.emissiveMap = screen.map;
    screen.emissiveIntensity = 0.65;
    screen.roughness = 0.4;
  }
  PANELS.forEach((name, i) => {
    finish([name], PANEL_COLORS[i], 0.45);
    glow(name, PANEL_COLORS[i], 1.15);
  });
  POSTERS.forEach(name => {
    const material = room.getObjectByName(name)?.material;
    if (!material?.map) return;
    material.map = material.map.clone();
    textures.push(material.map);
    material.map.center.set(0.5, 0.5);
    material.map.rotation = Math.PI;
    material.map.needsUpdate = true;
    material.emissiveMap = material.map;
    material.emissive.set('#fff1db');
    material.emissiveIntensity = 0.18;
    material.roughness = 0.85;
  });
  return { room, materials, textures };
}

export default function Room({ reducedMotion = false }) {
  const { scene } = useGLTF('/room.glb');
  const prepared = useMemo(() => prepareRoom(scene), [scene]);
  const panels = useMemo(() => PANELS.map(name => prepared.room.getObjectByName(name)?.material).filter(Boolean), [prepared]);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (reducedMotion) return;
    elapsed.current += Math.min(delta, 0.1);
    panels.forEach((material, i) => {
      material.emissiveIntensity = 1.15 + Math.sin(elapsed.current * 0.55 + i * 0.7) * 0.12;
    });
  });
  useEffect(() => () => {
    prepared.materials.forEach(material => material.dispose());
    prepared.textures.forEach(texture => texture.dispose());
  }, [prepared]);
  return <primitive object={prepared.room} dispose={null} />;
}
