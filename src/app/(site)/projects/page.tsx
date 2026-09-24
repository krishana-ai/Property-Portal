import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectsBrowser } from "@/components/site/projects/projects-browser";

export const metadata: Metadata = {
  title: "New projects in Jaipur",
  description: "RERA-registered new launches, under-construction and ready-to-move projects in Jaipur with prices, possession dates and configurations.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="New projects · Jaipur"
        title="Launches and landmarks, with the RERA number up front."
        description="Compare possession dates, configurations and price bands before you book a site visit."
      />
      <ProjectsBrowser />
    </>
  );
}
