export interface AptitudeTopic {
  id: string;
  title: string;
  theory: string;
  formulas: { name: string; formula: string }[];
  shortcuts: string[];
  commonMistakes: { mistake: string; correction: string }[];
  practiceProblems: { difficulty: "easy" | "medium" | "hard"; question: string; answer: string; explanation: string }[];
  companyQuestions: { company: string; question: string; answer: string; explanation?: string }[];
  tips: string[];
  videoUrls: string[];
}

export const APTITUDE_TOPICS: Record<string, AptitudeTopic> = {
  percentage: {
    id: "percentage",
    title: "Percentage",
    theory: `Percentage is a way of expressing a number as a fraction of 100. It is denoted using the percent sign "%". Percentages are used extensively in competitive exams for profit-loss, data interpretation, and comparison problems.

Key Concepts:
• A percentage is a ratio whose second term is 100.
• x% means x per hundred or x/100.
• To convert a fraction to a percentage, multiply by 100.
• To convert a percentage to a fraction, divide by 100.

Applications of Percentage:
• Profit & Loss calculations
• Discount calculations
• Interest rates
• Population growth/decline
• Data Interpretation
• Successive percentage changes`,
    formulas: [
      { name: "Percentage Formula", formula: "Percentage = (Value / Total Value) × 100" },
      { name: "Value from Percentage", formula: "Value = (Percentage × Total Value) / 100" },
      { name: "Percentage Change", formula: "Percentage Change = ((New Value - Old Value) / Old Value) × 100" },
      { name: "Successive Increase", formula: "If a value increases by x% then by y%, net change = (x + y + xy/100)%" },
      { name: "Successive Decrease", formula: "If a value decreases by x% then by y%, net change = (-x - y + xy/100)%" },
      { name: "Population Formula", formula: "Population after n years = P(1 + r/100)^n" },
    ],
    shortcuts: [
      "To find x% of y, calculate y% of x (commutative property)",
      "For successive percentage changes, use the formula a + b + ab/100",
      "10% = 1/10, 12.5% = 1/8, 20% = 1/5, 25% = 1/4, 33.33% = 1/3, 50% = 1/2 — memorize these fraction equivalents",
      "For calculating discounts, use: Discount = MP × (Discount%/100)",
    ],
    commonMistakes: [
      { mistake: "Adding percentages directly without considering base change", correction: "When successive percentage changes occur, use the net change formula, not simple addition" },
      { mistake: "Confusing percentage increase with percentage point increase", correction: "A change from 10% to 15% is a 5 percentage point increase but a 50% increase" },
      { mistake: "Applying discount on marked price instead of selling price", correction: "Discount is always calculated on the Marked Price (MP), not the Selling Price (SP)" },
    ],
    practiceProblems: [
      { difficulty: "easy", question: "What is 20% of 450?", answer: "90", explanation: "20% of 450 = (20/100) × 450 = 0.2 × 450 = 90" },
      { difficulty: "easy", question: "Convert 3/5 to percentage.", answer: "60%", explanation: "(3/5) × 100 = 300/5 = 60%" },
      { difficulty: "medium", question: "If A's salary is 20% less than B's, then B's salary is what percent more than A's?", answer: "25%", explanation: "Let B = 100, A = 80. B is more by 20. (20/80) × 100 = 25%" },
      { difficulty: "medium", question: "The population of a town increases by 10% annually. If the current population is 50,000, what will it be after 2 years?", answer: "60,500", explanation: "P = 50000(1 + 10/100)² = 50000 × 1.1 × 1.1 = 50000 × 1.21 = 60500" },
      { difficulty: "hard", question: "A number is first increased by 10% and then decreased by 10%. Find the net percentage change.", answer: "1% decrease", explanation: "Net change = 10 + (-10) + (10 × -10)/100 = 0 - 1 = -1%. So 1% decrease." },
      { difficulty: "hard", question: "In an examination, 80% of students passed in English, 85% passed in Mathematics, and 75% passed in both. What percentage failed in both subjects?", answer: "10%", explanation: "Passed in at least one = 80 + 85 - 75 = 90%. Failed in both = 100 - 90 = 10%" },
    ],
    companyQuestions: [
      { company: "TCS", question: "If the price of an item is increased by 25%, by what percent must the consumption be reduced so that expenditure remains the same?", answer: "20%", explanation: "Let original price = 100, new price = 125. For same expenditure, consumption = 100/125 = 0.8 = 80%. Reduction = 20%" },
      { company: "Infosys", question: "A student scored 80 marks out of 200 in a test. What percentage did he score?", answer: "40%", explanation: "(80/200) × 100 = 40%" },
      { company: "Amazon", question: "If A is 40% of B and B is 30% of C, what percent of C is A?", answer: "12%", explanation: "A = 0.4B, B = 0.3C. So A = 0.4 × 0.3C = 0.12C = 12% of C" },
    ],
    tips: [
      "Start with fraction-to-percentage conversions — they save time",
      "Practice successive change problems — they appear frequently",
      "Use the 'assume 100' technique for easier calculations",
      "Master percentage-to-fraction equivalents for quick mental math",
    ],
    videoUrls: [
      "https://www.youtube.com/results?search_query=percentage+aptitude+tricks",
      "https://www.youtube.com/results?search_query=percentage+problems+for+competitive+exams",
    ],
  },
};
