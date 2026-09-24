import { IMG } from "./images";

export const BRAND = {
  name: "Anavrin",
  full: "Anavrin Property",
  tagline: "Find the home that fits your life.",
  phone: "+91 141 400 2026",
  email: "hello@anavrinproperty.com",
  address: "4th Floor, Ashok Marg, C-Scheme, Jaipur 302001",
} as const;

/** Primary nav — kept short on purpose (spec §4: no 15–20 item headers). */
export const NAV_LINKS = [
  { label: "Buy", href: "/search?intent=buy" },
  { label: "Rent", href: "/search?intent=rent" },
  { label: "PG / Co-living", href: "/search?intent=pg" },
  { label: "New Projects", href: "/projects" },
  { label: "Commercial", href: "/search?intent=commercial" },
  { label: "Plots", href: "/search?intent=plots" },
] as const;

export const STATS = [
  { value: 2400, suffix: "+", label: "Verified listings", note: "Checked by our Jaipur team" },
  { value: 38, suffix: "", label: "Localities covered", note: "Across Jaipur" },
  { value: 94, suffix: "%", label: "Listings updated", note: "In the last 30 days" },
  { value: 18, suffix: " min", label: "Median owner reply", note: "Tracked on every enquiry" },
];

export const CATEGORIES = [
  { title: "Apartments", count: "1,240 homes", href: "/search?intent=buy", image: IMG.apartmentTower },
  { title: "Villas & houses", count: "380 homes", href: "/search?intent=buy", image: IMG.heroVilla },
  { title: "Rentals", count: "860 homes", href: "/search?intent=rent", image: IMG.livingWarm },
  { title: "PG & co-living", count: "210 stays", href: "/search?intent=pg", image: IMG.bedroom },
  { title: "Offices & shops", count: "145 spaces", href: "/search?intent=commercial", image: IMG.office },
  { title: "Plots & land", count: "290 plots", href: "/search?intent=plots", image: IMG.land },
];

export const JOURNEY = [
  { step: "01", title: "Search the way you think", body: "Type a locality, project or landmark. Filters speak Buy, Rent and PG — not one generic form." },
  { step: "02", title: "Understand before you call", body: "Real photos, floor plans, ₹/sq.ft, locality prices with dates, and trust signals that each mean one thing." },
  { step: "03", title: "Shortlist and compare", body: "Save instantly, compare up to four side-by-side. Differences are highlighted — we never pick a winner for you." },
  { step: "04", title: "Contact and visit", body: "One tap to call, WhatsApp or book a visit. Your message is prefilled — no retyping what we already know." },
];

/** Trust taxonomy (spec §13) — every badge has exactly one meaning. */
export const TRUST_BADGES = [
  { key: "verified", title: "Verified", body: "Our team confirmed the address, photos and seller identity on site." },
  { key: "rera", title: "RERA", body: "Project carries a Rajasthan RERA registration number you can look up." },
  { key: "owner", title: "Owner", body: "Posted directly by the property owner — no broker in between." },
  { key: "certified", title: "Certified agent", body: "Agent has completed KYC and our listing-quality programme." },
  { key: "featured", title: "Featured", body: "Paid visibility. Always labelled — it never implies verification." },
];

export const TESTIMONIALS = [
  { quote: "We shortlisted six flats in Malviya Nagar in one evening. The price-per-sq.ft on every card made it obvious which ones were overpriced.", name: "Ritika Agarwal", role: "Bought a 3 BHK, Malviya Nagar", image: IMG.personRitika },
  { quote: "Posting took eight minutes. I had four genuine enquiries the same week and the dashboard showed exactly who had visited.", name: "Mahesh Gupta", role: "Owner, Vaishali Nagar", image: IMG.personMahesh },
  { quote: "The PG filters actually understand what matters — food, sharing, women-only. Found a place near campus in two days.", name: "Sneha Kulkarni", role: "Student, MNIT", image: IMG.personSneha },
  { quote: "Leads arrive with the property and the buyer's message attached. My follow-ups finally live in one place.", name: "Imran Qureshi", role: "Certified agent, C-Scheme", image: IMG.personImran },
];

export const DEVELOPERS = [
  "Aravali Group", "Orchid Developers", "Meadows Infra", "Crest Group", "Pink City Builders",
  "Heritage Realty", "Mahima Homes", "Sunrise Estates", "Unique Builders", "Manglam Group",
];

export const FAQS = [
  { q: "What does the “Verified” badge actually mean?", a: "A member of our Jaipur team has confirmed the property address, matched the photos to the property and verified the seller’s identity. It is different from RERA registration and is never given because a listing is paid or featured." },
  { q: "Is browsing free? Do I need to log in?", a: "Browsing, searching and comparing are completely free and need no login. We only ask for your mobile number when you save, contact a seller or book a visit — and we complete that original action right after the OTP." },
  { q: "How do you keep listings fresh?", a: "Sellers are asked to confirm availability regularly. Listings that are not confirmed are paused automatically, and every card shows when it was last updated." },
  { q: "How are plot areas in gaj, bigha or acres converted?", a: "We always show the seller’s original unit first, with an approximate sq.ft conversion. Bigha differs between states, so we use the Rajasthan conversion and label it." },
  { q: "Is it free to post my property?", a: "Yes. Owners can post for free. Optional paid boosts increase visibility and are always shown to buyers as “Featured”." },
];

export const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Flats for sale in Jaipur", href: "/search?intent=buy" },
      { label: "Flats for rent in Jaipur", href: "/search?intent=rent" },
      { label: "PG in Jaipur", href: "/search?intent=pg" },
      { label: "Plots in Jaipur", href: "/search?intent=plots" },
      { label: "New projects", href: "/projects" },
    ],
  },
  {
    title: "Popular localities",
    links: [
      { label: "Malviya Nagar", href: "/search?intent=buy&loc=Malviya%20Nagar" },
      { label: "Vaishali Nagar", href: "/search?intent=buy&loc=Vaishali%20Nagar" },
      { label: "C-Scheme", href: "/search?intent=buy&loc=C-Scheme" },
      { label: "Jagatpura", href: "/search?intent=buy&loc=Jagatpura" },
      { label: "Mansarovar", href: "/search?intent=buy&loc=Mansarovar" },
    ],
  },
  {
    title: "For sellers",
    links: [
      { label: "Post property free", href: "/post-property" },
      { label: "My account", href: "/account" },
      { label: "Agent programme", href: "/post-property" },
      { label: "Builder solutions", href: "/projects" },
    ],
  },
];
