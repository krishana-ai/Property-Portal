import { Categories } from "@/components/site/home/categories";
import { Faq } from "@/components/site/home/faq";
import { FeaturedListings } from "@/components/site/home/featured-listings";
import { Hero } from "@/components/site/home/hero";
import { Journey } from "@/components/site/home/journey";
import { Localities } from "@/components/site/home/localities";
import { ProjectsShowcase } from "@/components/site/home/projects-showcase";
import { SellerCta } from "@/components/site/home/seller-cta";
import { StatsBand } from "@/components/site/home/stats-band";
import { Testimonials } from "@/components/site/home/testimonials";
import { ToolsSection } from "@/components/site/home/tools-section";
import { TrustSection } from "@/components/site/home/trust-section";

/** Search first, discovery second (spec §6) — the hero is fully usable without scrolling. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedListings />
      <StatsBand />
      <Localities />
      <Journey />
      <ProjectsShowcase />
      <TrustSection />
      <ToolsSection />
      <Testimonials />
      <Faq />
      <SellerCta />
    </>
  );
}
