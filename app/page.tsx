import GlassHero from "@/components/glass-hero";
import MainframeHero from "@/components/mainframe-hero";

export default function Home() {
  return (
    <div className="relative w-full flex flex-col">
      {/* Hero Section */}
      <GlassHero />

      {/* Section below hero with Mainframe Creative Agency */}
      <section
        id="mainframe"
        className="relative w-full min-h-screen bg-black text-white flex flex-col"
      >
        <MainframeHero embedded={true} />
      </section>
    </div>
  );
}
