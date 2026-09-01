import type { Metadata } from "next";
import MainframeHero from "@/components/mainframe-hero";

export const metadata: Metadata = {
  title: "Vidhara",
  description: "Create. Connect. Grow.",
};

export default function MainframePage() {
  return <MainframeHero />;
}
