export const aiKpis = {
  callsToday: "18,420",
  avgResponseTime: "640ms",
  flaggedOutputs: "37",
  toolErrorRate: "1.8%",
};

export interface AiToolStat {
  id: string;
  toolName: string;
  callsToday: number;
  errorRate: string;
  avgLatency: string;
  lastFlagged: string;
}

export const aiToolStats: AiToolStat[] = [
  { id: "T1", toolName: "search_properties", callsToday: 6820, errorRate: "0.6%", avgLatency: "310ms", lastFlagged: "Returned 0 results for a valid high-demand locality query" },
  { id: "T2", toolName: "get_fair_price", callsToday: 4210, errorRate: "2.4%", avgLatency: "890ms", lastFlagged: "Estimate 18% below comparable listings in same locality" },
  { id: "T3", toolName: "get_trust_score", callsToday: 3105, errorRate: "1.1%", avgLatency: "540ms", lastFlagged: "Score explanation cited an expired document as valid" },
  { id: "T4", toolName: "get_location_score", callsToday: 2290, errorRate: "0.9%", avgLatency: "410ms", lastFlagged: "Low confidence score for a well-established locality" },
  { id: "T5", toolName: "compare_properties", callsToday: 1180, errorRate: "3.2%", avgLatency: "1120ms", lastFlagged: "Compared two properties with mismatched carpet area units" },
  { id: "T6", toolName: "build_payment_plan", callsToday: 815, errorRate: "2.0%", avgLatency: "760ms", lastFlagged: "Generated a plan exceeding buyer's stated budget by 40%" },
];

export type ReviewStatus = "Pending" | "Approved" | "Rejected";
export type AiOutputType = "Fair Price Estimate" | "Negotiation Suggestion" | "Trust Score Explanation";

export interface AiReviewItem {
  id: string;
  outputType: AiOutputType;
  target: string;
  snippet: string;
  confidence: number;
  status: ReviewStatus;
  flaggedAt: string;
}

export const aiReviewQueue: AiReviewItem[] = [
  { id: "AR-01", outputType: "Fair Price Estimate", target: "3BHK Sea View Apartment", snippet: "Estimated fair price ₹1.48 Cr — 18% below comparable listings.", confidence: 62, status: "Pending", flaggedAt: "2026-09-22" },
  { id: "AR-02", outputType: "Trust Score Explanation", target: "Meera Krishnan (Broker)", snippet: "Cited 'NOC - Verified' but linked document status is Pending.", confidence: 54, status: "Pending", flaggedAt: "2026-09-22" },
  { id: "AR-03", outputType: "Negotiation Suggestion", target: "Deal DL-902", snippet: "Suggested counter-offer 30% below asking — unusually aggressive.", confidence: 58, status: "Pending", flaggedAt: "2026-09-21" },
  { id: "AR-04", outputType: "Fair Price Estimate", target: "Office Space, Cyber City", snippet: "Estimate did not account for recent locality price surge.", confidence: 66, status: "Approved", flaggedAt: "2026-09-20" },
  { id: "AR-05", outputType: "Trust Score Explanation", target: "Skyline Developers", snippet: "Referenced an expired RERA certificate as active.", confidence: 49, status: "Rejected", flaggedAt: "2026-09-19" },
  { id: "AR-06", outputType: "Negotiation Suggestion", target: "Deal DL-908", snippet: "Suggested payment plan exceeds buyer's stated budget by 40%.", confidence: 57, status: "Pending", flaggedAt: "2026-09-18" },
  { id: "AR-07", outputType: "Fair Price Estimate", target: "Independent Villa with Garden", snippet: "Compared against a mismatched property type (apartment).", confidence: 60, status: "Approved", flaggedAt: "2026-09-16" },
];
