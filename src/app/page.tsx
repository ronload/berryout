import { Header } from "@/components/header";
import { CountdownDisplay } from "@/components/countdown-display";
import { ParticlesBackground } from "@/components/particles-background";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <ParticlesBackground />
      <Header />
      <main className="flex flex-1 justify-center px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] w-full">
        <CountdownDisplay />
      </main>
    </div>
  );
}
