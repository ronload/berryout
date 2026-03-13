import { Header } from "@/components/header";
import { CountdownDisplay } from "@/components/countdown-display";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-8 w-full">
        <CountdownDisplay />
      </main>
    </div>
  );
}
