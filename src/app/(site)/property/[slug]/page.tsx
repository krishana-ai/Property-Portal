import { BadgeCheck, Building2, Calendar, Car, Check, ChevronRight, Compass, Layers, MapPin, Maximize2, Sofa, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion/reveal";
import { ContactPanel } from "@/components/site/property/contact-panel";
import { EmiCalculator } from "@/components/site/property/emi-calculator";
import { PropertyCard } from "@/components/site/property/property-card";
import { PropertyGallery } from "@/components/site/property/property-gallery";
import { ReportListing } from "@/components/site/property/report-listing";
import { SaveButton } from "@/components/site/property/save-button";
import { StickyContextBar } from "@/components/site/property/sticky-context-bar";
import { FeaturedTag, TrustBadges } from "@/components/site/property/trust-badges";
import { getProperty, LOCALITIES, PRICE_DATA_PERIOD, PROPERTIES, similarProperties } from "@/lib/site/catalog";
import { formatArea, formatPrice, formatPropertyPrice, postedLabel, pricePerSqft, propertyHeadline } from "@/lib/site/format";
import { getIntent } from "@/lib/site/search";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getProperty(params.slug);
  if (!p) return { title: "Property not found" };
  const title = `${propertyHeadline(p)} ${p.priceIsMonthly ? "for rent" : "for sale"} in ${p.locality}, ${p.city} — ${formatPropertyPrice(p)}`;
  return {
    title,
    description: `${p.title}. ${formatArea(p)}, ${p.availability}. ${p.description.slice(0, 120)}`,
    alternates: { canonical: `/property/${p.slug}` },
    openGraph: { title, images: [{ url: p.images[0] }] },
  };
}

export default function PropertyPage({ params }: Props) {
  const p = getProperty(params.slug);
  if (!p) notFound();

  const intent = getIntent(p.intent);
  const locality = LOCALITIES.find((l) => l.name === p.locality);
  const similar = similarProperties(p);
  const psf = pricePerSqft(p);

  const facts = [
    { icon: Maximize2, label: p.originalArea ? "Plot area" : "Built-up area", value: formatArea(p) },
    p.bhk && { icon: Layers, label: "Configuration", value: `${p.bhk} BHK · ${p.baths} Bath` },
    { icon: Calendar, label: "Availability", value: p.availability },
    p.furnishing && { icon: Sofa, label: "Furnishing", value: p.furnishing },
    p.floor && { icon: Building2, label: "Floor", value: p.floor },
    p.facing && { icon: Compass, label: "Facing", value: p.facing },
    p.parking !== undefined && { icon: Car, label: "Parking", value: p.parking ? `${p.parking} covered` : "None" },
    p.deposit && { icon: BadgeCheck, label: "Security deposit", value: formatPrice(p.deposit) },
  ].filter(Boolean) as { icon: typeof Maximize2; label: string; value: string }[];

  // Structured data for search engines (spec §65).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    image: p.images,
    offers: { "@type": "Offer", price: p.price, priceCurrency: "INR" },
    address: { "@type": "PostalAddress", addressLocality: p.locality, addressRegion: "Rajasthan", addressCountry: "IN" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StickyContextBar property={p} />

      <div className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 lg:px-8 lg:pb-24">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-xs text-ink-600">
          <Link href="/" className="hover:text-ink-900">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/search?intent=${p.intent}`} className="hover:text-ink-900">{intent.label}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/search?intent=${p.intent}&loc=${encodeURIComponent(p.locality)}`} className="hover:text-ink-900">{p.locality}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-900">{propertyHeadline(p)}</span>
        </nav>

        <PropertyGallery images={p.images} title={p.title} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="min-w-0">
            {/* Summary — above the fold */}
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                {p.featured && <FeaturedTag />}
                <TrustBadges property={p} size="md" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-700">{propertyHeadline(p)}</p>
              <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink-900">{p.title}</h1>
              <p className="mt-3 flex items-center gap-1.5 text-ink-600"><MapPin className="h-4 w-4" /> {p.project ? `${p.project}, ` : ""}{p.locality}, {p.city}</p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-ink-900/10 py-6">
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-ink-900">{formatPropertyPrice(p)}</p>
                  <p className="mt-1 text-sm text-ink-600">{psf ?? (p.deposit ? `Deposit ${formatPrice(p.deposit)}` : "")} · {postedLabel(p.postedDaysAgo)}</p>
                </div>
                <SaveButton slug={p.slug} withLabel className="border border-ink-900/15 bg-white text-ink-900 hover:bg-sand-100" />
              </div>
            </Reveal>

            {/* Key facts */}
            <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((f) => (
                <StaggerItem key={f.label} className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/[0.06]">
                  <f.icon className="h-5 w-5 text-brass-600" />
                  <p className="mt-3 text-[11px] uppercase tracking-wider text-ink-600">{f.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink-900">{f.value}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <Section title="About this property">
              <p className="leading-relaxed text-ink-700">{p.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-ink-800">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brass-100 text-brass-700"><Check className="h-3 w-3" /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Amenities">
              <Stagger className="flex flex-wrap gap-2" stagger={0.04}>
                {p.amenities.map((a) => (
                  <StaggerItem key={a} className="rounded-full bg-white px-4 py-2 text-sm text-ink-800 ring-1 ring-ink-900/[0.08]">{a}</StaggerItem>
                ))}
              </Stagger>
            </Section>

            {p.pg && (
              <Section title="Stay details">
                <dl className="grid gap-4 sm:grid-cols-3">
                  <Spec term="For" value={p.pg.forGender === "Any" ? "Anyone" : p.pg.forGender} />
                  <Spec term="Sharing" value={p.pg.sharing.join(", ")} />
                  <Spec term="Food" value={p.pg.foodIncluded ? "Included" : "Not included"} />
                </dl>
              </Section>
            )}

            {p.originalArea && (
              <Section title="Land measurement">
                <p className="text-sm leading-relaxed text-ink-700">
                  Listed as <strong>{p.originalArea.value} {p.originalArea.unit}</strong>
                  {p.originalArea.region ? ` (${p.originalArea.region} convention)` : ""}. That is approximately <strong>{p.areaSqft.toLocaleString("en-IN")} sq.ft</strong>. Always confirm the measurement against the registered documents.
                </p>
              </Section>
            )}

            {locality && (
              <Section title={`Living in ${locality.name}`}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-ink-900 p-5 text-white">
                    <p className="text-[11px] uppercase tracking-wider text-white/50">Avg. sale price</p>
                    <p className="mt-1 font-display text-3xl">₹{locality.avgPriceSqft.toLocaleString("en-IN")}<span className="text-base text-white/60">/sq.ft</span></p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-900/[0.06]">
                    <p className="text-[11px] uppercase tracking-wider text-ink-600">Rent from</p>
                    <p className="mt-1 font-display text-3xl text-ink-900">{formatPrice(locality.rentFrom)}<span className="text-base text-ink-600">/mo</span></p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-600/15">
                    <p className="text-[11px] uppercase tracking-wider text-emerald-800/70">Price trend</p>
                    <p className="mt-1 flex items-center gap-2 font-display text-3xl text-emerald-800"><TrendingUp className="h-6 w-6" /> +{locality.yoy}%</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ink-600">Data period: {PRICE_DATA_PERIOD}. Based on listed asking prices.</p>
              </Section>
            )}

            {!p.priceIsMonthly && (
              <Section title="Estimate your EMI">
                <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06] sm:p-8">
                  <EmiCalculator defaultPrice={p.price} />
                </div>
              </Section>
            )}

            <div className="mt-12">
              <ReportListing />
            </div>
          </div>

          <aside id="contact" className="scroll-mt-24">
            <div className="lg:sticky lg:top-24">
              <ContactPanel property={p} />
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <p className="eyebrow text-brass-700">You may also like</p>
              <h2 className="mt-3 font-display text-4xl text-ink-900">Similar properties {locality ? `near ${locality.name}` : ""}</h2>
            </Reveal>
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <StaggerItem key={s.slug}><PropertyCard property={s} /></StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-14">
      <h2 className="mb-5 font-display text-2xl text-ink-900 sm:text-3xl">{title}</h2>
      {children}
    </Reveal>
  );
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/[0.06]">
      <dt className="text-[11px] uppercase tracking-wider text-ink-600">{term}</dt>
      <dd className="mt-1 font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
