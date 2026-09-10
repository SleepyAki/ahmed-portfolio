// Each hotspot is a clickable marker placed in 3D space inside the room.
// `position` is [x, y, z] in the same coordinate system as room.glb.
//
// HOW TO TUNE POSITIONS:
// Run the app locally (npm run dev), walk close to the spot you want a
// hotspot to sit, and press "P". The current camera position is logged
// to the browser console as a ready-to-paste [x, y, z] array. Swap it in
// below.
//
// `panel` must match a key in src/panels.js (the content shown on click).
// `variant: "poster"` renders a rectangular frame sized/oriented for the
// three wall posters in the model instead of a floating orb — use it only
// for hotspots mounted on that wall (x ~ -1.31).

export const HOTSPOTS = [
  {
    id: "about",
    label: "About Me",
    icon: "🧑‍💻",
    position: [1.85, 1.55, 0.0], // on the mirror - it "shows" you
    variant: "orb",
    panel: "about",
  },
  {
    id: "experience",
    label: "Journey",
    icon: "🎓",
    position: [-1.31, 2.21, 1.73], // poster 1 (measured: Object_176/182)
    variant: "poster",
    panel: "experience",
  },
  {
    id: "skills",
    label: "Skills",
    icon: "🛠️",
    position: [-1.31, 2.21, 0.96], // poster 2 (measured: Object_178)
    variant: "poster",
    panel: "skills",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "🚀",
    position: [-1.31, 2.21, 0.16], // poster 3 (measured: Object_84/180) - previously unused
    variant: "poster",
    panel: "projects",
  },
  {
    id: "game",
    label: "Play a Game",
    icon: "🎮",
    position: [1.58, 1.55, -0.75], // on the PC tower
    variant: "orb",
    panel: "game",
  },
  {
    id: "contact",
    label: "Contact",
    icon: "📬",
    position: [0.77, 1.65, -1.0], // on the monitor screen
    variant: "orb",
    panel: "contact",
  },
];

// Where the player starts and which way they're facing (radians, around Y).
export const SPAWN = {
  position: [1.15, 1.6, 1.8],
  yaw: 0.3,
};

// Soft walk boundary, inset slightly from the model's actual walls
// (measured: x -1.43..2.41, z -1.33..2.51) so the camera doesn't clip
// through them. Tune after walking around with "P".
export const ROOM_BOUNDS = {
  minX: -1.05,
  maxX: 1.55,
  minZ: -0.95,
  maxZ: 2.2,
  eyeHeight: 1.6,
};
