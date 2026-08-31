import React, { useEffect } from "react";
import { useGLTF, useEnvironment } from "@react-three/drei";
import * as THREE from "three";

// Node names below were identified by measuring room.glb directly (position
// + material lookup), not guessed. Each fix clones the material for that
// specific node before editing it, so nothing shared with other objects
// (e.g. the lamp's material is also used by a shelf item) gets affected.
const FIXES = {
  bed: "Object_202", // mattress/blanket top - was flat grey
  mirror: "Object_136", // the tall leaning panel - was flat matte white
  pcBody: "Object_4", // PC case main body - near-black, no detail
  pcTrim: "Object_6", // PC case side trim
  lamp: "Object_184", // lamp shade - was pure saturated orange
};

const FLOOR_NODES = ["Object_221", "Object_146"]; // large floor/backdrop planes - force matte

const POSTER_NODES = ["Object_182", "Object_82", "Object_84"]; // the 3 wall posters

function cloneMaterial(mesh) {
  if (!mesh.isMesh) return null;
  const cloned = mesh.material.clone();
  mesh.material = cloned;
  return cloned;
}

const Room = () => {
  const { scene } = useGLTF("/room.glb");
  // Scoped to just the mirror material below - unlike <Environment>, this
  // does NOT set scene.environment, so it won't brighten every other
  // material in the room via image-based lighting.
  const mirrorEnv = useEnvironment({ preset: "sunset", resolution: 64 });

  // Fixed once per loaded scene instance (guarded against StrictMode's
  // double-invoke, since some of these edits aren't idempotent).
  useEffect(() => {
    if (scene.userData.fixesApplied) return;

    /* eslint-disable react-hooks/immutability -- mutating a loaded GLTF
       scene's materials in a one-time effect is the standard R3F pattern
       for customizing an imported model (see drei/R3F docs); there's no
       "immutable" way to recolor a mesh that doesn't involve setting a
       property on it. */
    scene.userData.fixesApplied = true;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeBoundingSphere();
        // Very large flat meshes (the floor) can have a bounding sphere
        // that Three.js mis-culls at grazing viewing angles - keep them
        // always rendered rather than risk the floor vanishing.
        const r = child.geometry.boundingSphere?.radius ?? 0;
        child.frustumCulled = r < 5;
      }
    });

    // --- Bed: give the blanket actual color instead of flat grey ---
    const bed = scene.getObjectByName(FIXES.bed);
    if (bed) {
      const mat = cloneMaterial(bed);
      mat.color.setRGB(0.11, 0.32, 0.29); // deep teal bedspread
      mat.roughness = 0.8;
    }

    // --- Mirror: swap flat white panel for an actual reflective material ---
    const mirror = scene.getObjectByName(FIXES.mirror);
    if (mirror) {
      const mat = cloneMaterial(mirror);
      mat.color.setRGB(0.85, 0.87, 0.9);
      mat.metalness = 0.95;
      mat.roughness = 0.12;
      mat.envMap = mirrorEnv;
      mat.envMapIntensity = 0.9;
    }

    // --- PC case: less flat-black, subtle cool accent ---
    const pcBody = scene.getObjectByName(FIXES.pcBody);
    if (pcBody) {
      const mat = cloneMaterial(pcBody);
      mat.color.setRGB(0.05, 0.06, 0.09);
      mat.metalness = 0.4;
      mat.roughness = 0.35;
      mat.emissive = new THREE.Color(0x38bdf8);
      mat.emissiveIntensity = 0.12;
    }
    const pcTrim = scene.getObjectByName(FIXES.pcTrim);
    if (pcTrim) {
      const mat = cloneMaterial(pcTrim);
      mat.color.setRGB(0.15, 0.17, 0.22);
      mat.metalness = 0.6;
      mat.roughness = 0.25;
    }

    // --- Lamp: soften the saturated orange to a warmer, gentler glow ---
    const lamp = scene.getObjectByName(FIXES.lamp);
    if (lamp) {
      const mat = cloneMaterial(lamp);
      mat.color.setRGB(0.95, 0.72, 0.42);
      mat.emissive = new THREE.Color(0xffb366);
      mat.emissiveIntensity = 0.25;
    }

    // --- Floor: force fully matte regardless of source material -
    //     was catching a hard specular highlight under the sunset light ---
    FLOOR_NODES.forEach((name) => {
      const node = scene.getObjectByName(name);
      if (node && node.isMesh) {
        const mat = cloneMaterial(node);
        mat.roughness = 1;
        mat.metalness = 0;
        mat.envMapIntensity = 0;
      }
    });

    // --- Chair: mute the neon-pink trim baked into its texture ---
    const chair = scene.getObjectByName("Gaming Chair_37");
    if (chair) {
      chair.traverse((child) => {
        if (child.isMesh) {
          const mat = cloneMaterial(child);
          if (mat.color) mat.color.multiplyScalar(0.82).lerp(new THREE.Color(0.55, 0.55, 0.6), 0.25);
        }
      });
    }

    // --- Posters: the source photos are stored upside down - flip them ---
    POSTER_NODES.forEach((name) => {
      const node = scene.getObjectByName(name);
      if (node && node.isMesh && node.material.map) {
        const mat = cloneMaterial(node);
        const tex = mat.map;
        tex.center.set(0.5, 0.5);
        tex.rotation = Math.PI;
        tex.needsUpdate = true;
      }
    });
    /* eslint-enable react-hooks/immutability */
  }, [scene, mirrorEnv]);

  return <primitive object={scene} dispose={null} />;
};

useGLTF.preload("/room.glb");

export default Room;
