import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
// I added 'useAnimations' to this list for you:
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
  useProgress,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
// A simple loader that shows percentage (meets "Fast" requirement perception)
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span style={{ color: "white" }}>{progress.toFixed(0)}% loaded</span>
    </Html>
  );
}

// The Room Component
// Alternative: Make the room giant to match the giant avatar
function Room() {
  const { scene } = useGLTF("/room.glb");
  return <primitive object={scene} scale={1} position={[0, -1.05, 0]} />;
}

function Avatar() {
  // Update the filename to your NEW file
  const { scene, animations } = useGLTF("/avatar2.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // 1. Log to prove it works this time
    console.log("New animations found:", animations);

    // 2. Play the first animation found, whatever it is named
    if (actions) {
      const actionNames = Object.keys(actions);
      if (actionNames.length > 0) {
        const firstAction = actions[actionNames[0]];
        firstAction.reset().fadeIn(0.5).play();
      }
    }
  }, [actions]);

  // FIX: Reset position/scale for the new model
  // Start with scale={1}. If he's giant/tiny, adjust from there.
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />;
}

export default function App() {
  const isMobile = window.innerWidth < 768;
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <Canvas
        shadows
        camera={{ position: isMobile ? [5, 4, 8] : [3, 2, 5], fov: 50 }}
      >
        {/* Lighting: This creates that "Neon/Magical" vibe */}
        <ambientLight intensity={0.7} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Environment preset="city" />

        {/* The 3D World */}
        <Suspense fallback={<Loader />}>
          <group>
            <Room />
            <Avatar />
          </group>
          {/* Floor Shadow to ground the models */}
          <ContactShadows
            position={[0, -0.99, 0]}
            opacity={0.6}
            scale={10}
            blur={2.5}
            far={1}
          />
        </Suspense>

        {/* Controls: Limits rotation so they can't look under the floor */}
        <OrbitControls
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

      {/* Overlay UI */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          fontFamily: "sans-serif",
          pointerEvents: "none",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Interactive Room</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}