export interface SimulationParams {
  currentRole: string;
  currentSalary: number;
  targetRole: string;
  targetCity: string;
  riskTolerance: "conservative" | "moderate" | "aggressive";
  years: number;
  currentSkills: string[];
}

export interface SimulationResult {
  trajectories: number[][];
  percentiles: { p10: number[]; p50: number[]; p90: number[] };
  skillGrowth: {
    year: number;
    skills: number;
    experience: number;
    network: number;
    overall: number;
  }[];
  riskAnalysis: { label: string; score: number; description: string }[];
  summary: {
    medianFinalSalary: number;
    salaryGrowth: number;
    bestCase: number;
    worstCase: number;
    riskLevel: string;
    recommendation: string;
  };
}

export interface Scenario {
  name: string;
  params: SimulationParams;
  result?: SimulationResult;
}

interface RoleData {
  baseSalary: number;
  growthRate: number;
  aiRisk: number;
  switchBonus: number;
  skillDifficulty: number;
  demandLevel: number;
}

interface CityData {
  multiplier: number;
  costOfLiving: number;
  jobMarket: number;
}

const CITY_DATA: Record<string, CityData> = {
  Bangalore: { multiplier: 1.3, costOfLiving: 0.85, jobMarket: 0.95 },
  Mumbai: { multiplier: 1.35, costOfLiving: 1.0, jobMarket: 0.9 },
  Delhi: { multiplier: 1.25, costOfLiving: 0.9, jobMarket: 0.85 },
  Chennai: { multiplier: 1.0, costOfLiving: 0.75, jobMarket: 0.8 },
  Hyderabad: { multiplier: 1.15, costOfLiving: 0.78, jobMarket: 0.88 },
  Pune: { multiplier: 1.2, costOfLiving: 0.8, jobMarket: 0.85 },
  Remote: { multiplier: 1.1, costOfLiving: 0.65, jobMarket: 1.0 },
};

export const ROLE_DATA: Record<string, RoleData> = {
  "Software Engineer": {
    baseSalary: 8,
    growthRate: 0.12,
    aiRisk: 0.2,
    switchBonus: 0.2,
    skillDifficulty: 0.6,
    demandLevel: 0.9,
  },
  "Data Scientist": {
    baseSalary: 9,
    growthRate: 0.14,
    aiRisk: 0.35,
    switchBonus: 0.18,
    skillDifficulty: 0.75,
    demandLevel: 0.85,
  },
  "Product Manager": {
    baseSalary: 10,
    growthRate: 0.11,
    aiRisk: 0.15,
    switchBonus: 0.25,
    skillDifficulty: 0.55,
    demandLevel: 0.8,
  },
  "UX Designer": {
    baseSalary: 7,
    growthRate: 0.1,
    aiRisk: 0.15,
    switchBonus: 0.15,
    skillDifficulty: 0.5,
    demandLevel: 0.75,
  },
  "DevOps Engineer": {
    baseSalary: 9,
    growthRate: 0.13,
    aiRisk: 0.1,
    switchBonus: 0.22,
    skillDifficulty: 0.7,
    demandLevel: 0.88,
  },
  "Cybersecurity Analyst": {
    baseSalary: 8,
    growthRate: 0.15,
    aiRisk: 0.05,
    switchBonus: 0.2,
    skillDifficulty: 0.7,
    demandLevel: 0.92,
  },
  "AI/ML Engineer": {
    baseSalary: 12,
    growthRate: 0.18,
    aiRisk: 0.05,
    switchBonus: 0.28,
    skillDifficulty: 0.85,
    demandLevel: 0.95,
  },
  "Business Analyst": {
    baseSalary: 7,
    growthRate: 0.09,
    aiRisk: 0.4,
    switchBonus: 0.15,
    skillDifficulty: 0.45,
    demandLevel: 0.7,
  },
  "Cloud Architect": {
    baseSalary: 11,
    growthRate: 0.14,
    aiRisk: 0.08,
    switchBonus: 0.25,
    skillDifficulty: 0.8,
    demandLevel: 0.9,
  },
  "Mobile Developer": {
    baseSalary: 8,
    growthRate: 0.11,
    aiRisk: 0.18,
    switchBonus: 0.18,
    skillDifficulty: 0.65,
    demandLevel: 0.82,
  },
  "Full Stack Developer": {
    baseSalary: 8,
    growthRate: 0.12,
    aiRisk: 0.18,
    switchBonus: 0.2,
    skillDifficulty: 0.7,
    demandLevel: 0.88,
  },
  "Backend Developer": {
    baseSalary: 8,
    growthRate: 0.11,
    aiRisk: 0.15,
    switchBonus: 0.18,
    skillDifficulty: 0.65,
    demandLevel: 0.85,
  },
  "Frontend Developer": {
    baseSalary: 7,
    growthRate: 0.1,
    aiRisk: 0.22,
    switchBonus: 0.16,
    skillDifficulty: 0.55,
    demandLevel: 0.8,
  },
  "QA Engineer": {
    baseSalary: 6,
    growthRate: 0.09,
    aiRisk: 0.45,
    switchBonus: 0.12,
    skillDifficulty: 0.45,
    demandLevel: 0.65,
  },
  "Technical Writer": {
    baseSalary: 5,
    growthRate: 0.08,
    aiRisk: 0.5,
    switchBonus: 0.1,
    skillDifficulty: 0.35,
    demandLevel: 0.55,
  },
  "System Administrator": {
    baseSalary: 6,
    growthRate: 0.08,
    aiRisk: 0.3,
    switchBonus: 0.12,
    skillDifficulty: 0.5,
    demandLevel: 0.6,
  },
  "Network Engineer": {
    baseSalary: 6,
    growthRate: 0.09,
    aiRisk: 0.2,
    switchBonus: 0.14,
    skillDifficulty: 0.55,
    demandLevel: 0.65,
  },
  "Database Administrator": {
    baseSalary: 7,
    growthRate: 0.08,
    aiRisk: 0.35,
    switchBonus: 0.12,
    skillDifficulty: 0.5,
    demandLevel: 0.6,
  },
  "Project Manager": {
    baseSalary: 8,
    growthRate: 0.09,
    aiRisk: 0.3,
    switchBonus: 0.2,
    skillDifficulty: 0.45,
    demandLevel: 0.75,
  },
  "Marketing Manager": {
    baseSalary: 7,
    growthRate: 0.09,
    aiRisk: 0.35,
    switchBonus: 0.18,
    skillDifficulty: 0.4,
    demandLevel: 0.7,
  },
  "Financial Analyst": {
    baseSalary: 7,
    growthRate: 0.1,
    aiRisk: 0.55,
    switchBonus: 0.15,
    skillDifficulty: 0.5,
    demandLevel: 0.65,
  },
  "HR Manager": {
    baseSalary: 7,
    growthRate: 0.08,
    aiRisk: 0.25,
    switchBonus: 0.18,
    skillDifficulty: 0.35,
    demandLevel: 0.7,
  },
  "Sales Manager": {
    baseSalary: 7,
    growthRate: 0.1,
    aiRisk: 0.2,
    switchBonus: 0.2,
    skillDifficulty: 0.35,
    demandLevel: 0.75,
  },
  "Operations Manager": {
    baseSalary: 7,
    growthRate: 0.08,
    aiRisk: 0.2,
    switchBonus: 0.16,
    skillDifficulty: 0.4,
    demandLevel: 0.7,
  },
  "Content Creator": {
    baseSalary: 4,
    growthRate: 0.12,
    aiRisk: 0.4,
    switchBonus: 0.1,
    skillDifficulty: 0.4,
    demandLevel: 0.6,
  },
  "Graphic Designer": {
    baseSalary: 5,
    growthRate: 0.07,
    aiRisk: 0.65,
    switchBonus: 0.1,
    skillDifficulty: 0.4,
    demandLevel: 0.55,
  },
  "Video Editor": {
    baseSalary: 5,
    growthRate: 0.09,
    aiRisk: 0.35,
    switchBonus: 0.12,
    skillDifficulty: 0.5,
    demandLevel: 0.6,
  },
  "Teacher": {
    baseSalary: 4,
    growthRate: 0.06,
    aiRisk: 0.1,
    switchBonus: 0.08,
    skillDifficulty: 0.3,
    demandLevel: 0.75,
  },
  Nurse: {
    baseSalary: 5,
    growthRate: 0.07,
    aiRisk: 0.02,
    switchBonus: 0.08,
    skillDifficulty: 0.6,
    demandLevel: 0.9,
  },
  Doctor: {
    baseSalary: 10,
    growthRate: 0.08,
    aiRisk: 0.02,
    switchBonus: 0.05,
    skillDifficulty: 0.95,
    demandLevel: 0.95,
  },
  Lawyer: {
    baseSalary: 8,
    growthRate: 0.09,
    aiRisk: 0.35,
    switchBonus: 0.15,
    skillDifficulty: 0.8,
    demandLevel: 0.7,
  },
  "Mechanical Engineer": {
    baseSalary: 7,
    growthRate: 0.08,
    aiRisk: 0.2,
    switchBonus: 0.15,
    skillDifficulty: 0.65,
    demandLevel: 0.7,
  },
  "Civil Engineer": {
    baseSalary: 6,
    growthRate: 0.07,
    aiRisk: 0.15,
    switchBonus: 0.12,
    skillDifficulty: 0.6,
    demandLevel: 0.65,
  },
  "Electrical Engineer": {
    baseSalary: 7,
    growthRate: 0.08,
    aiRisk: 0.15,
    switchBonus: 0.14,
    skillDifficulty: 0.65,
    demandLevel: 0.7,
  },
};

function gaussianRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getRoleData(role: string): RoleData {
  return (
    ROLE_DATA[role] || {
      baseSalary: 7,
      growthRate: 0.1,
      aiRisk: 0.3,
      switchBonus: 0.15,
      skillDifficulty: 0.5,
      demandLevel: 0.7,
    }
  );
}

function getCityData(city: string): CityData {
  return (
    CITY_DATA[city] || {
      multiplier: 1.0,
      costOfLiving: 0.8,
      jobMarket: 0.8,
    }
  );
}

function getRiskParams(
  riskTolerance: SimulationParams["riskTolerance"]
): { baseGrowth: number; variance: number; volatility: number } {
  switch (riskTolerance) {
    case "conservative":
      return { baseGrowth: 0.09, variance: 0.015, volatility: 0.03 };
    case "moderate":
      return { baseGrowth: 0.12, variance: 0.03, volatility: 0.05 };
    case "aggressive":
      return { baseGrowth: 0.15, variance: 0.06, volatility: 0.08 };
  }
}

function simulateSingleTrajectory(params: SimulationParams): number[] {
  const years = clamp(params.years, 1, 10);
  const roleData = getRoleData(params.targetRole);
  const cityData = getCityData(params.targetCity);
  const riskParams = getRiskParams(params.riskTolerance);
  const currentRoleData = getRoleData(params.currentRole);

  const isRoleSwitch = params.currentRole !== params.targetRole;

  const trajectory: number[] = [params.currentSalary];
  let salary = params.currentSalary;

  for (let year = 1; year <= years; year++) {
    let growthRate =
      riskParams.baseGrowth * roleData.growthRate * 10 + roleData.growthRate * 0.5;
    growthRate = clamp(growthRate, 0.05, 0.25);

    growthRate += gaussianRandom() * riskParams.variance;

    if (isRoleSwitch && year === 1) {
      const switchBump =
        currentRoleData.switchBonus +
        (roleData.switchBonus - currentRoleData.switchBonus) * Math.random();
      growthRate += switchBump;
    }

    if (year > 3) {
      const decay = (year - 3) * 0.01;
      growthRate = Math.max(growthRate - decay, 0.04);
    }

    const demandBonus = (roleData.demandLevel - 0.5) * 0.04;
    growthRate += demandBonus;

    const cityBonus = (cityData.multiplier - 1.0) * 0.03;
    growthRate += cityBonus;

    salary *= 1 + growthRate;
    salary += gaussianRandom() * riskParams.volatility * salary;

    salary = Math.max(salary, params.currentSalary * 0.8);
    trajectory.push(Math.round(salary * 100) / 100);
  }

  return trajectory;
}

function computePercentiles(
  trajectories: number[][],
  years: number
): { p10: number[]; p50: number[]; p90: number[] } {
  const p10: number[] = [];
  const p50: number[] = [];
  const p90: number[] = [];

  for (let y = 0; y <= years; y++) {
    const values = trajectories
      .map((t) => t[y])
      .sort((a, b) => a - b);
    const len = values.length;

    p10.push(values[Math.floor(len * 0.1)]);
    p50.push(values[Math.floor(len * 0.5)]);
    p90.push(values[Math.floor(len * 0.9)]);
  }

  return { p10, p50, p90 };
}

function computeSkillGrowth(
  params: SimulationParams,
  years: number
): SimulationResult["skillGrowth"] {
  const roleData = getRoleData(params.targetRole);
  const skillGrowth: SimulationResult["skillGrowth"] = [];

  let skillLevel = 30;
  let experienceLevel = 10;
  let networkLevel = 15;

  const isAggressive = params.riskTolerance === "aggressive";

  for (let year = 1; year <= years; year++) {
    let skillGrowthRate = 10 + roleData.skillDifficulty * 10;
    skillGrowthRate += isAggressive ? 5 : 0;

    if (skillLevel > 70) {
      skillGrowthRate *= 0.5;
    }

    skillLevel = clamp(skillLevel + skillGrowthRate, 0, 100);

    const expGrowth = 8 + Math.random() * 6;
    experienceLevel = clamp(experienceLevel + expGrowth, 0, 100);

    const netGrowth = 5 + Math.random() * 8 + (isAggressive ? 3 : 0);
    networkLevel = clamp(networkLevel + netGrowth, 0, 100);

    const overall =
      skillLevel * 0.4 + experienceLevel * 0.35 + networkLevel * 0.25;

    skillGrowth.push({
      year,
      skills: Math.round(skillLevel * 10) / 10,
      experience: Math.round(experienceLevel * 10) / 10,
      network: Math.round(networkLevel * 10) / 10,
      overall: Math.round(overall * 10) / 10,
    });
  }

  return skillGrowth;
}

function computeRiskAnalysis(params: SimulationParams): SimulationResult["riskAnalysis"] {
  const roleData = getRoleData(params.targetRole);
  const cityData = getCityData(params.targetCity);
  const risks: SimulationResult["riskAnalysis"] = [];

  const marketRisk = Math.round((1 - roleData.demandLevel) * 100);
  risks.push({
    label: "Market Risk",
    score: marketRisk,
    description:
      marketRisk < 30
        ? "Very low market risk — strong demand for this role"
        : marketRisk < 60
          ? "Moderate market risk — demand fluctuates with economic cycles"
          : "Higher market risk — fewer openings, more competition",
  });

  const aiRisk = Math.round(roleData.aiRisk * 100);
  risks.push({
    label: "Skill Obsolescence",
    score: aiRisk,
    description:
      aiRisk < 20
        ? "Low AI risk — this role requires human judgment that AI cannot replicate"
        : aiRisk < 50
          ? "Moderate AI risk — some tasks may be automated, upskilling recommended"
          : "High AI risk — significant portions of this role may be automated soon",
  });

  const geoRisk = Math.round((1 - cityData.jobMarket) * 100);
  risks.push({
    label: "Geographic Risk",
    score: geoRisk,
    description:
      geoRisk < 25
        ? "Strong local job market — many employers and opportunities"
        : geoRisk < 50
          ? "Moderate geographic concentration — consider remote options as backup"
          : "Limited local opportunities — relocation or remote work may be necessary",
  });

  const volatility =
    params.riskTolerance === "aggressive"
      ? 65
      : params.riskTolerance === "moderate"
        ? 40
        : 20;
  const aiScore = roleData.aiRisk;
  const demandScore = 1 - roleData.demandLevel;
  const financialRisk = Math.round(
    volatility * 0.4 + aiScore * 100 * 0.3 + demandScore * 100 * 0.3
  );
  risks.push({
    label: "Financial Risk",
    score: clamp(financialRisk, 5, 95),
    description:
      financialRisk < 30
        ? "Stable earning potential — consistent salary growth expected"
        : financialRisk < 60
          ? "Moderate financial volatility — income may vary year to year"
          : "Higher financial uncertainty — negotiate strong base salary and benefits",
  });

  return risks;
}

function computeSummary(
  percentiles: SimulationResult["percentiles"],
  params: SimulationParams,
  riskAnalysis: SimulationResult["riskAnalysis"]
): SimulationResult["summary"] {
  const finalYear = percentiles.p50.length - 1;
  const medianFinalSalary = percentiles.p50[finalYear];
  const salaryGrowth =
    ((medianFinalSalary - params.currentSalary) / params.currentSalary) * 100;
  const bestCase = percentiles.p90[finalYear];
  const worstCase = percentiles.p10[finalYear];

  const avgRiskScore =
    riskAnalysis.reduce((sum, r) => sum + r.score, 0) / riskAnalysis.length;
  const riskLevel =
    avgRiskScore < 25
      ? "Low"
      : avgRiskScore < 50
        ? "Moderate"
        : avgRiskScore < 75
          ? "High"
          : "Very High";

  return {
    medianFinalSalary: Math.round(medianFinalSalary * 100) / 100,
    salaryGrowth: Math.round(salaryGrowth * 10) / 10,
    bestCase: Math.round(bestCase * 100) / 100,
    worstCase: Math.round(worstCase * 100) / 100,
    riskLevel,
    recommendation: generateRecommendation(
      { trajectories: [], percentiles, skillGrowth: [], riskAnalysis, summary: {} as SimulationResult["summary"] },
      params
    ),
  };
}

export function runSimulation(params: SimulationParams): SimulationResult {
  const years = clamp(params.years, 1, 10);
  const NUM_SIMULATIONS = 500;

  const trajectories: number[][] = [];
  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    trajectories.push(simulateSingleTrajectory(params));
  }

  const percentiles = computePercentiles(trajectories, years);
  const skillGrowth = computeSkillGrowth(params, years);
  const riskAnalysis = computeRiskAnalysis(params);

  const summary = computeSummary(percentiles, params, riskAnalysis);
  summary.recommendation = generateRecommendation(
    { trajectories, percentiles, skillGrowth, riskAnalysis, summary },
    params
  );

  return { trajectories, percentiles, skillGrowth, riskAnalysis, summary };
}

export function generateRecommendation(
  result: SimulationResult,
  params: SimulationParams
): string {
  const summary = result.summary;
  const riskAnalysis = result.riskAnalysis;

  const isRoleSwitch = params.currentRole !== params.targetRole;
  const targetRole = getRoleData(params.targetRole);
  const sourceRole = getRoleData(params.currentRole);

  const avgRisk =
    riskAnalysis.reduce((sum, r) => sum + r.score, 0) / riskAnalysis.length;

  const parts: string[] = [];

  if (isRoleSwitch) {
    if (summary.salaryGrowth > 30) {
      parts.push(
        `Switching from ${params.currentRole} to ${params.targetRole} looks financially promising — the simulation shows a median salary growth of ${summary.salaryGrowth}% over ${params.years} years.`
      );
    } else if (summary.salaryGrowth > 10) {
      parts.push(
        `Moving to ${params.targetRole} offers modest salary improvement (${summary.salaryGrowth}% median growth over ${params.years} years), so factor in non-monetary benefits like interest alignment and work-life balance.`
      );
    } else {
      parts.push(
        `The simulation suggests ${params.targetRole} may not significantly outpace your current ${params.currentRole} trajectory in raw salary — consider whether the switch aligns with deeper career goals.`
      );
    }
  } else {
    parts.push(
      `Staying in ${params.currentRole}, the simulation projects a median final salary of ₹${summary.medianFinalSalary.toFixed(1)}LPA (${summary.salaryGrowth}% growth over ${params.years} years).`
    );
  }

  const aiRiskItem = riskAnalysis.find((r) => r.label === "Skill Obsolescence");
  if (aiRiskItem && aiRiskItem.score > 50) {
    parts.push(
      `⚠️ AI exposure is notable for this role (score ${aiRiskItem.score}/100). Prioritize building skills in areas AI struggles — strategic thinking, stakeholder management, and creative problem-solving.`
    );
  } else if (aiRiskItem && aiRiskItem.score < 20) {
    parts.push(
      `This role has strong AI resilience (score ${aiRiskItem.score}/100), meaning your skills will remain in demand as AI reshapes the industry.`
    );
  }

  const marketRisk = riskAnalysis.find((r) => r.label === "Market Risk");
  if (marketRisk && marketRisk.score > 50) {
    parts.push(
      `Market conditions for this role carry some uncertainty (score ${marketRisk.score}/100). Build a strong network and maintain transferable skills as a safety net.`
    );
  }

  if (params.riskTolerance === "aggressive") {
    parts.push(
      `Your aggressive risk profile widens the outcomes — best case is ₹${summary.bestCase.toFixed(1)}LPA but worst case dips to ₹${summary.worstCase.toFixed(1)}LPA. Ensure you have a financial runway of 6+ months.`
    );
  } else if (params.riskTolerance === "conservative") {
    parts.push(
      `Your conservative approach keeps outcomes tight and predictable (₹${summary.worstCase.toFixed(1)}LPA to ₹${summary.bestCase.toFixed(1)}LPA), sacrificing some upside for stability.`
    );
  }

  const yearsNeeded = summary.salaryGrowth < 20 ? params.years + 2 : params.years;
  if (summary.salaryGrowth < 15) {
    parts.push(
      `Consider a ${yearsNeeded}-year timeline with strategic job changes every 2-3 years, which historically accelerates salary growth beyond 15% CAGR.`
    );
  }

  return parts.join(" ");
}

export function compareScenarios(scenarios: Scenario[]): {
  scenarios: { name: string; params: SimulationParams; result: SimulationResult }[];
  comparison: {
    metric: string;
    values: { name: string; value: string }[];
    winner: string;
  }[];
} {
  const results = scenarios.map((s) => ({
    name: s.name,
    params: s.params,
    result: s.result || runSimulation(s.params),
  }));

  const metrics = [
    {
      label: "Median Final Salary",
      extract: (r: SimulationResult) => r.summary.medianFinalSalary,
      format: (v: number) => `₹${v.toFixed(1)}LPA`,
    },
    {
      label: "Salary Growth %",
      extract: (r: SimulationResult) => r.summary.salaryGrowth,
      format: (v: number) => `${v}%`,
    },
    {
      label: "Best Case",
      extract: (r: SimulationResult) => r.summary.bestCase,
      format: (v: number) => `₹${v.toFixed(1)}LPA`,
    },
    {
      label: "Worst Case",
      extract: (r: SimulationResult) => r.summary.worstCase,
      format: (v: number) => `₹${v.toFixed(1)}LPA`,
    },
    {
      label: "Overall Risk",
      extract: (r: SimulationResult) =>
        r.riskAnalysis.reduce((sum, x) => sum + x.score, 0) /
        r.riskAnalysis.length,
      format: (v: number) => `${v.toFixed(0)}/100`,
    },
  ];

  const comparison = metrics.map((metric) => {
    const values = results.map((r) => ({
      name: r.name,
      value: metric.extract(r.result),
    }));

    let winner = values[0].name;
    let bestVal = values[0].value;

    if (metric.label === "Overall Risk") {
      winner = values.reduce((w, v) =>
        v.value < bestVal ? ((bestVal = v.value), v) : w
      ).name;
    } else {
      winner = values.reduce((w, v) =>
        v.value > bestVal ? ((bestVal = v.value), v) : w
      ).name;
    }

    return {
      metric: metric.label,
      values: values.map((v) => ({ name: v.name, value: metric.format(v.value) })),
      winner,
    };
  });

  return { scenarios: results, comparison };
}
