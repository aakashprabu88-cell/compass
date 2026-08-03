"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type TargetAndTransition, type VariantLabels, type Transition } from "framer-motion";

export default function MouseParallax({
  children,
  className,
  intensity = 26,
  rotate = 7,
  style,
  initial,
  animate,
  transition,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  rotate?: number;
  style?: React.CSSProperties;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  transition?: Transition;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.6 });
  const x = useTransform(sx, [-1, 1], [-intensity, intensity]);
  const y = useTransform(sy, [-1, 1], [-intensity, intensity]);
  const rotY = useTransform(sx, [-1, 1], [rotate, -rotate]);
  const rotX = useTransform(sy, [-1, 1], [-rotate * 0.45, rotate * 0.45]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
      style={{ x, y, rotateX: rotX, rotateY: rotY, transformPerspective: 900, ...style }}
    >
      {children}
    </motion.div>
  );
}
