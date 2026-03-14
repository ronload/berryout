import type { Metadata } from "next";
import { Header } from "@/components/header";
import { CountdownDisplay } from "@/components/countdown-display";
import { ParticlesBackground } from "@/components/particles-background";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; d?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const e = params.e;
  const d = params.d;

  const ogUrl = new URL(
    "/api/og",
    process.env.NEXT_PUBLIC_BASE_URL || "https://berryout.vercel.app",
  );
  if (e) ogUrl.searchParams.set("e", e);
  if (d) ogUrl.searchParams.set("d", d);

  const ogImageUrl = ogUrl.toString();

  return {
    openGraph: {
      title: "BerryOut - 退伍倒數計時器",
      description: "追蹤你的退伍倒數進度",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "BerryOut 退伍倒數",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "BerryOut - 退伍倒數計時器",
      description: "追蹤你的退伍倒數進度",
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <ParticlesBackground />
      <Header />
      <main className="flex flex-1 justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] w-full">
        <CountdownDisplay />
      </main>
    </div>
  );
}
