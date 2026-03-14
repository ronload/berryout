"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Particles } from "@/components/particles";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ParticlesBackground() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!mounted) return null;

  const colors =
    resolvedTheme === "dark"
      ? ["#ffffff", "#ffffff", "#ffffff"]
      : ["#000000", "#000000", "#333333"];

  return (
    <Particles
      key={resolvedTheme}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleColors={colors}
      alphaParticles
      moveParticlesOnHover
      particleHoverFactor={1}
      sizeRandomness={1}
      cameraDistance={20}
      className="fixed inset-0 -z-10 pointer-events-auto"
    />
  );
}
