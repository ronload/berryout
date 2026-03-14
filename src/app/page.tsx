import { Header } from "@/components/header";
import { CountdownDisplay } from "@/components/countdown-display";
import { Particles } from "@/components/particles";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Particles
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        alphaParticles
        moveParticlesOnHover
        particleHoverFactor={1}
        sizeRandomness={1}
        cameraDistance={20}
        className="fixed inset-0 -z-10 pointer-events-auto"
      />
      <Header />
      <main className="flex flex-1 justify-center px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] w-full">
        <CountdownDisplay />
      </main>
    </div>
  );
}
