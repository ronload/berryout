import { Header } from "@/components/header";
import { CountdownDisplay } from "@/components/countdown-display";
import { GridPattern } from "@/components/grid-pattern";
import { cn } from "@/lib/utils";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <GridPattern
        x={500}
        y={400}
        squares={[
          [-11, 9],
          [-9, 8],
          [-8, 10],
          [-10, 4],
          [-7, 11],
          [-6, 9],
          [-4, 12],
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [14, 12],
          [11, 16],
          [16, 8],
        ]}
        className={cn(
          "[mask-image:radial-gradient(250px_circle_at_center,white,transparent)]",
          "sm:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "md:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-40%] h-[200%] skew-y-12",
        )}
      />
      <Header />
      <main className="flex flex-1 justify-center px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] w-full">
        <CountdownDisplay />
      </main>
    </div>
  );
}
