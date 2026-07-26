export interface OfferDetails {
  company: string;
  role: string;
  offeredSalary: number;
  location: string;
  experience: number;
}

export interface NegotiationScript {
  scenario: string;
  tone: "aggressive" | "moderate" | "conservative";
  openingLine: string;
  body: string;
  closingLine: string;
  fullScript: string;
  confidenceScore: number;
}

export interface PushbackResponse {
  objection: string;
  response: string;
  followUp: string;
}

export interface MarketComparison {
  percentile: string;
  yourOffer: number;
  marketMedian: number;
  marketTop: number;
  belowMarket: boolean;
}

const MARKET_DATA: Record<string, Record<string, { p25: number; p50: number; p75: number; top: number }>> = {
  "Software Engineer": {
    Bangalore: { p25: 6, p50: 10, p75: 16, top: 25 },
    Mumbai: { p25: 6, p50: 9, p75: 15, top: 22 },
    Delhi: { p25: 5, p50: 9, p75: 14, top: 20 },
    Chennai: { p25: 4, p50: 7, p75: 12, top: 18 },
    Hyderabad: { p25: 5, p50: 8, p75: 13, top: 20 },
    Pune: { p25: 5, p50: 8, p75: 14, top: 20 },
    Remote: { p25: 6, p50: 10, p75: 16, top: 24 },
  },
  "Data Scientist": {
    Bangalore: { p25: 7, p50: 12, p75: 18, top: 28 },
    Mumbai: { p25: 6, p50: 11, p75: 17, top: 25 },
    Delhi: { p25: 6, p50: 10, p75: 16, top: 24 },
    Chennai: { p25: 5, p50: 8, p75: 14, top: 20 },
    Hyderabad: { p25: 5, p50: 9, p75: 15, top: 22 },
    Pune: { p25: 5, p50: 9, p75: 15, top: 22 },
    Remote: { p25: 7, p50: 12, p75: 18, top: 28 },
  },
  "Product Manager": {
    Bangalore: { p25: 8, p50: 14, p75: 22, top: 32 },
    Mumbai: { p25: 8, p50: 13, p75: 20, top: 30 },
    Delhi: { p25: 7, p50: 12, p75: 18, top: 28 },
    Chennai: { p25: 6, p50: 10, p75: 16, top: 24 },
    Hyderabad: { p25: 6, p50: 11, p75: 17, top: 26 },
    Pune: { p25: 6, p50: 11, p75: 17, top: 26 },
    Remote: { p25: 8, p50: 14, p75: 22, top: 32 },
  },
  "UX Designer": {
    Bangalore: { p25: 5, p50: 9, p75: 14, top: 20 },
    Mumbai: { p25: 5, p50: 8, p75: 13, top: 18 },
    Delhi: { p25: 4, p50: 8, p75: 12, top: 17 },
    Chennai: { p25: 3, p50: 6, p75: 10, top: 15 },
    Hyderabad: { p25: 4, p50: 7, p75: 12, top: 16 },
    Pune: { p25: 4, p50: 7, p75: 12, top: 16 },
    Remote: { p25: 5, p50: 9, p75: 15, top: 22 },
  },
  "DevOps Engineer": {
    Bangalore: { p25: 7, p50: 12, p75: 18, top: 26 },
    Mumbai: { p25: 6, p50: 11, p75: 17, top: 24 },
    Delhi: { p25: 6, p50: 10, p75: 16, top: 23 },
    Chennai: { p25: 5, p50: 8, p75: 13, top: 18 },
    Hyderabad: { p25: 5, p50: 9, p75: 15, top: 22 },
    Pune: { p25: 5, p50: 9, p75: 15, top: 22 },
    Remote: { p25: 7, p50: 12, p75: 19, top: 28 },
  },
  "Backend Developer": {
    Bangalore: { p25: 6, p50: 10, p75: 16, top: 24 },
    Mumbai: { p25: 5, p50: 9, p75: 15, top: 22 },
    Delhi: { p25: 5, p50: 9, p75: 14, top: 20 },
    Chennai: { p25: 4, p50: 7, p75: 12, top: 17 },
    Hyderabad: { p25: 5, p50: 8, p75: 14, top: 20 },
    Pune: { p25: 5, p50: 8, p75: 14, top: 20 },
    Remote: { p25: 6, p50: 10, p75: 16, top: 25 },
  },
  "Frontend Developer": {
    Bangalore: { p25: 5, p50: 9, p75: 14, top: 22 },
    Mumbai: { p25: 5, p50: 8, p75: 13, top: 20 },
    Delhi: { p25: 4, p50: 8, p75: 12, top: 18 },
    Chennai: { p25: 3, p50: 6, p75: 10, top: 15 },
    Hyderabad: { p25: 4, p50: 7, p75: 12, top: 18 },
    Pune: { p25: 4, p50: 7, p75: 12, top: 18 },
    Remote: { p25: 5, p50: 9, p75: 15, top: 22 },
  },
  "Machine Learning Engineer": {
    Bangalore: { p25: 8, p50: 14, p75: 22, top: 32 },
    Mumbai: { p25: 7, p50: 13, p75: 20, top: 28 },
    Delhi: { p25: 7, p50: 12, p75: 18, top: 26 },
    Chennai: { p25: 6, p50: 9, p75: 15, top: 22 },
    Hyderabad: { p25: 6, p50: 11, p75: 17, top: 25 },
    Pune: { p25: 6, p50: 11, p75: 17, top: 25 },
    Remote: { p25: 8, p50: 14, p75: 22, top: 32 },
  },
  "Full Stack Developer": {
    Bangalore: { p25: 6, p50: 11, p75: 17, top: 26 },
    Mumbai: { p25: 6, p50: 10, p75: 16, top: 24 },
    Delhi: { p25: 5, p50: 9, p75: 15, top: 22 },
    Chennai: { p25: 4, p50: 7, p75: 12, top: 18 },
    Hyderabad: { p25: 5, p50: 9, p75: 14, top: 22 },
    Pune: { p25: 5, p50: 9, p75: 14, top: 22 },
    Remote: { p25: 6, p50: 11, p75: 18, top: 28 },
  },
  "Cloud Architect": {
    Bangalore: { p25: 10, p50: 16, p75: 24, top: 35 },
    Mumbai: { p25: 9, p50: 15, p75: 22, top: 32 },
    Delhi: { p25: 8, p50: 14, p75: 20, top: 30 },
    Chennai: { p25: 7, p50: 11, p75: 18, top: 25 },
    Hyderabad: { p25: 8, p50: 13, p75: 20, top: 28 },
    Pune: { p25: 8, p50: 13, p75: 20, top: 28 },
    Remote: { p25: 10, p50: 16, p75: 25, top: 36 },
  },
};

const DEFAULT_MARKET: Record<string, { p25: number; p50: number; p75: number; top: number }> = {
  Bangalore: { p25: 5, p50: 9, p75: 14, top: 20 },
  Mumbai: { p25: 5, p50: 8, p75: 13, top: 18 },
  Delhi: { p25: 4, p50: 8, p75: 12, top: 17 },
  Chennai: { p25: 3, p50: 6, p75: 10, top: 15 },
  Hyderabad: { p25: 4, p50: 7, p75: 12, top: 16 },
  Pune: { p25: 4, p50: 7, p75: 12, top: 16 },
  Remote: { p25: 5, p50: 9, p75: 15, top: 22 },
};

function getMarketRate(role: string, location: string) {
  const normalizedRole = Object.keys(MARKET_DATA).find(
    r => r.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(r.toLowerCase())
  );
  const roleData = normalizedRole ? MARKET_DATA[normalizedRole] : null;
  const locData = roleData?.[location] || DEFAULT_MARKET[location] || DEFAULT_MARKET.Bangalore;

  const expMultiplier = Math.min(1 + (role === "Senior" ? 0.4 : role === "Lead" ? 0.6 : 0), 2);
  return {
    p25: Math.round(locData.p25 * expMultiplier * 10) / 10,
    p50: Math.round(locData.p50 * expMultiplier * 10) / 10,
    p75: Math.round(locData.p75 * expMultiplier * 10) / 10,
    top: Math.round(locData.top * expMultiplier * 10) / 10,
  };
}

export function calculateMarketComparison(offer: OfferDetails): MarketComparison {
  const market = getMarketRate(offer.role, offer.location);
  const salary = offer.offeredSalary;

  let percentile: string;
  if (salary < market.p25) percentile = "Below 25th";
  else if (salary < market.p50) percentile = "25th–50th";
  else if (salary < market.p75) percentile = "50th–75th";
  else percentile = "Above 75th";

  return {
    percentile,
    yourOffer: salary,
    marketMedian: market.p50,
    marketTop: market.top,
    belowMarket: salary < market.p50,
  };
}

export function generateCounterOffers(offer: OfferDetails): NegotiationScript[] {
  const market = getMarketRate(offer.role, offer.location);
  const salary = offer.offeredSalary;
  const isBelowMarket = salary < market.p50;
  const gapFromMedian = Math.round((market.p50 - salary) * 10) / 10;

  const scripts: NegotiationScript[] = [
    {
      scenario: `Negotiating with ${offer.company} for the ${offer.role} role`,
      tone: "aggressive",
      openingLine: `Thank you for extending the offer for the ${offer.role} position at ${offer.company}. I've had time to thoroughly evaluate this, and I want to be direct about where I see the compensation standing.`,
      body: `Based on my extensive research across the Indian tech market, the median salary for a ${offer.role} in ${offer.location} with ${offer.experience} years of experience is ${market.p50} LPA, and top-tier companies are offering between ${market.p75}–${market.top} LPA. I also have competing offers on the table that reflect this range. Given my ${offer.experience} years of hands-on experience and the specialized skills I bring, I believe a compensation of ${Math.round(salary * 1.22 * 10) / 10} LPA would accurately reflect the value I'll deliver to the team.`,
      closingLine: `I'm genuinely excited about the opportunity at ${offer.company}, but I need to ensure the compensation reflects my market value. I'm confident we can find a number that works for both sides — shall we say ${Math.round(salary * 1.22 * 10) / 10} LPA?`,
      fullScript: "",
      confidenceScore: isBelowMarket ? 85 : 60,
    },
    {
      scenario: `Negotiating with ${offer.company} for the ${offer.role} role`,
      tone: "moderate",
      openingLine: `I truly appreciate the offer for the ${offer.role} role at ${offer.company}. I'm very interested in joining the team, and I'd love to discuss the compensation package to make sure it's a strong fit.`,
      body: `Based on my research into current market rates, a ${offer.role} in ${offer.location} with ${offer.experience} years of experience typically commands ${market.p50}–${market.p75} LPA. I understand that compensation is determined by many factors, and I respect the process. With my background and what I'll bring to the table, I'd like to propose ${Math.round(salary * 1.12 * 10) / 10} LPA as a starting point for discussion. I'm open to exploring other components like a signing bonus or an early performance review if the base salary has limitations.`,
      closingLine: `I'm looking forward to a long and productive relationship with ${offer.company}. I believe ${Math.round(salary * 1.12 * 10) / 10} LPA is a fair number that reflects both my market value and my enthusiasm for this role. What do you think?`,
      fullScript: "",
      confidenceScore: isBelowMarket ? 78 : 55,
    },
    {
      scenario: `Negotiating with ${offer.company} for the ${offer.role} role`,
      tone: "conservative",
      openingLine: `Thank you so much for this offer — I'm genuinely excited about the opportunity to contribute to ${offer.company} as a ${offer.role}. I wanted to have a brief conversation about the compensation.`,
      body: `I've done some research on the current market for ${offer.role} roles in ${offer.location}, and I see that the typical range for someone with ${offer.experience} years of experience is ${market.p50}–${market.p75} LPA. I completely understand there are many factors at play. With my experience and the enthusiasm I have for this role, would it be possible to consider a package closer to ${Math.round(salary * 1.07 * 10) / 10} LPA? I'm also very open to discussing other benefits that might help bridge the gap.`,
      closingLine: `I want to emphasize how excited I am about this opportunity. I believe a small adjustment to ${Math.round(salary * 1.07 * 10) / 10} LPA would make this a perfect fit. I'm looking forward to hearing your thoughts.`,
      fullScript: "",
      confidenceScore: isBelowMarket ? 72 : 45,
    },
  ];

  scripts.forEach(s => {
    s.fullScript = `${s.openingLine}\n\n${s.body}\n\n${s.closingLine}`;
  });

  return scripts;
}

export function generatePushbackResponses(offer: OfferDetails): PushbackResponse[] {
  const market = getMarketRate(offer.role, offer.location);

  return [
    {
      objection: `"This is our final offer."`,
      response: `I understand and respect that. While the base salary may be firm, I'd like to explore if there are other levers we can pull — such as a signing bonus, an early performance review at 6 months, or additional equity/RSUs. My goal is to find a package that works within your structure while recognizing the market rate.`,
      followUp: `Could you clarify if there's flexibility on any non-salary components like a joining bonus, relocation support, or an accelerated review cycle?`,
    },
    {
      objection: `"We can't match that number."`,
      response: `I completely understand budgets have constraints. If ${Math.round(offer.offeredSalary * 1.15 * 10) / 10} LPA isn't feasible, could we look at alternatives like a one-time signing bonus of 1–2 LPA, or a commitment to a performance review with salary revision after 6 months? That way, the total first-year compensation becomes more competitive.`,
      followUp: `Would you be open to a written commitment for a 6-month salary review based on defined performance milestones?`,
    },
    {
      objection: `"You're asking too much."`,
      response: `I appreciate the candid feedback. I want to assure you that my ask is grounded in market data. For a ${offer.role} in ${offer.location}, the median is ${market.p50} LPA and top offers go up to ${market.top} LPA. I'm not asking for the top of the range — I'm requesting something in the ${market.p50}–${market.p75} range that reflects my ${offer.experience} years of experience and the specific value I'll bring.`,
      followUp: `I'm happy to share the market research I've compiled. Would that be helpful for your internal discussions?`,
    },
    {
      objection: `"We need you to start ASAP."`,
      response: `I'm glad the team is eager to have me on board, and I share that enthusiasm. Starting quickly is important to me too. That said, I want to make sure we're aligned on the full package so I can hit the ground running with complete peace of mind. Could we use this momentum to finalize an offer that's mutually beneficial?`,
      followUp: `If we can agree on the revised terms today, I'm prepared to commit to a start date within ${offer.experience < 3 ? "2 weeks" : "3 weeks"}. Would that work?`,
    },
    {
      objection: `"Other candidates are cheaper."`,
      response: `I understand you're evaluating multiple candidates, and I respect that process. What I bring to the table is ${offer.experience} years of specialized experience that directly maps to your requirements. The cost of a wrong hire — onboarding, ramp-up, potential turnover — far exceeds the gap between my ask and a less experienced candidate. I'm confident I'll deliver ROI from day one.`,
      followUp: `Would it help if I outlined my specific contributions and how they directly address the challenges this role is meant to solve?`,
    },
    {
      objection: `"The budget is fixed for this role."`,
      response: `I completely understand if the base salary band is non-negotiable. Let's think creatively — are there other components within your compensation framework we can optimize? For example, a performance bonus, annual stock refresh, education budget, conference attendance, flexible work arrangements, or extra PTO? The total package matters more to me than any single line item.`,
      followUp: `Could you walk me through the full benefits package? There may be components I'm not aware of that could bridge the gap.`,
    },
  ];
}

export function generateNegotiationTips(offer: OfferDetails): string[] {
  const tips: string[] = [];
  const market = getMarketRate(offer.role, offer.location);

  if (offer.offeredSalary < market.p50) {
    tips.push(`Your offer of ${offer.offeredSalary} LPA is below the market median of ${market.p50} LPA for ${offer.role} in ${offer.location}. You have strong grounds to negotiate upward.`);
  }

  if (offer.experience >= 5) {
    tips.push(`With ${offer.experience} years of experience, you're in a senior bracket. Emphasize your leadership, mentorship abilities, and the cost savings of hiring someone who needs zero ramp-up time.`);
  } else if (offer.experience <= 2) {
    tips.push(`As a relatively early-career professional with ${offer.experience} years, focus your negotiation on growth potential, learning opportunities, and structured review timelines rather than aggressive salary demands.`);
  }

  if (offer.location === "Bangalore" || offer.location === "Mumbai") {
    tips.push(`The cost of living in ${offer.location} is among the highest in India. Use this as a data point to justify your ask — mention housing costs, commute expenses, and general cost-of-living adjustments.`);
  }

  if (offer.offeredSalary >= market.p75) {
    tips.push(`Your offer is already in the top quartile (${offer.offeredSalary} LPA vs ${market.p75} LPA for 75th percentile). Consider negotiating for non-monetary perks like remote work flexibility, learning budgets, or accelerated promotions instead.`);
  }

  tips.push(`Always express genuine enthusiasm before negotiating. Start with gratitude for the offer, then pivot to your value proposition. Never make ultimatums unless you have a genuine alternative.`);
  tips.push(`Get the final offer in writing before accepting. Verbal promises about future reviews or bonuses should be documented in the offer letter or a separate email.`);
  tips.push(`Practice your negotiation pitch out loud at least twice before the actual conversation. Confidence in delivery is just as important as the content of your ask.`);

  return tips.slice(0, 6);
}
