"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Tour, { TourStep } from "@/components/Tour";

export default function PageTour({
  id, steps, accent = "indigo", delay = 1000, auto = false, buttonLabel = "User guide", autoAdvanceMs = 9000,
}: {
  id: string;
  steps: TourStep[];
  accent?: string;
  delay?: number;
  auto?: boolean;
  buttonLabel?: string;
  autoAdvanceMs?: number;
}) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    setShown(true);
    if (!auto) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem(`compass_tour_${id}`)) {
        t = setTimeout(() => { setOpen(true); localStorage.setItem(`compass_tour_${id}`, "1"); }, delay);
      }
    } catch {}
    return () => { if (t) clearTimeout(t); };
  }, [id, delay, auto, shown]);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[90] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-purple-400 hover:scale-105 transition-all"
        title="Start the guided user guide"
        aria-label={buttonLabel}
      >
        <Play className="w-4 h-4" />
      </motion.button>
      <Tour accent={accent} open={open} onClose={() => setOpen(false)} steps={steps} autoAdvanceMs={autoAdvanceMs} />
    </>
  );
}
