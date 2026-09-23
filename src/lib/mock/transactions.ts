export const DEAL_STAGES = [
  "Enquiry",
  "Visit",
  "Offer",
  "Negotiate",
  "Legal",
  "Book",
  "Pay",
  "Possess",
] as const;

export type DealStage = (typeof DEAL_STAGES)[number];

export interface DealTimelineEntry {
  stage: DealStage;
  date: string;
}

export interface Deal {
  id: string;
  buyer: string;
  property: string;
  currentStage: DealStage;
  timeline: DealTimelineEntry[];
}

function timelineUpTo(stage: DealStage, startDate: string): DealTimelineEntry[] {
  const idx = DEAL_STAGES.indexOf(stage);
  const start = new Date(startDate);
  return DEAL_STAGES.slice(0, idx + 1).map((s, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 4);
    return { stage: s, date: d.toISOString().slice(0, 10) };
  });
}

export const mockDeals: Deal[] = [
  { id: "DL-901", buyer: "Ananya Iyer", property: "Sunrise Towers, Bandra West", currentStage: "Book", timeline: timelineUpTo("Book", "2026-08-10") },
  { id: "DL-902", buyer: "Karan Kapoor", property: "Kothrud Garden View", currentStage: "Negotiate", timeline: timelineUpTo("Negotiate", "2026-08-25") },
  { id: "DL-903", buyer: "Vikram Singh", property: "MG Road Commercial Complex", currentStage: "Visit", timeline: timelineUpTo("Visit", "2026-09-05") },
  { id: "DL-904", buyer: "Rahul Verma", property: "Township Greens, Building 7", currentStage: "Possess", timeline: timelineUpTo("Possess", "2026-06-01") },
  { id: "DL-905", buyer: "Priya Nair", property: "Hinjewadi Phase 2, Block C-12", currentStage: "Enquiry", timeline: timelineUpTo("Enquiry", "2026-09-19") },
  { id: "DL-906", buyer: "Meera Krishnan", property: "Whitefield Tech Residency", currentStage: "Legal", timeline: timelineUpTo("Legal", "2026-08-15") },
  { id: "DL-907", buyer: "Aditya Rao", property: "DLF Cyber City, Tower 6", currentStage: "Pay", timeline: timelineUpTo("Pay", "2026-07-20") },
  { id: "DL-908", buyer: "Sneha Joshi", property: "Kothrud Garden View", currentStage: "Offer", timeline: timelineUpTo("Offer", "2026-09-01") },
  { id: "DL-909", buyer: "Arjun Malhotra", property: "Commercial Street Retail Row", currentStage: "Negotiate", timeline: timelineUpTo("Negotiate", "2026-08-28") },
  { id: "DL-910", buyer: "Divya Menon", property: "ECR Farmhouse Estate", currentStage: "Visit", timeline: timelineUpTo("Visit", "2026-09-10") },
  { id: "DL-911", buyer: "Ishaan Bhatt", property: "Vasant Kunj Sky Residences", currentStage: "Book", timeline: timelineUpTo("Book", "2026-08-05") },
  { id: "DL-912", buyer: "Rohan Mehta", property: "3BHK Sea View Apartment", currentStage: "Enquiry", timeline: timelineUpTo("Enquiry", "2026-09-21") },
];
