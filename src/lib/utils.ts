import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRiskColor(risk: string) {
  switch (risk) {
    case "none": return "text-emerald-400";
    case "low": return "text-green-400";
    case "medium": return "text-yellow-400";
    case "high": return "text-orange-400";
    case "critical": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function getRiskBg(risk: string) {
  switch (risk) {
    case "none": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export function getGrowthColor(growth: string) {
  switch (growth) {
    case "booming": return "text-emerald-400";
    case "growing": return "text-green-400";
    case "stable": return "text-blue-400";
    case "declining": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function getGrowthBg(growth: string) {
  switch (growth) {
    case "booming": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "growing": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "stable": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "declining": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}
