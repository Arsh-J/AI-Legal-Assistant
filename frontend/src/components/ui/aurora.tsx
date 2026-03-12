/**
 * Aurora — JS + CSS animated background
 * Ported from React Bits (https://www.reactbits.dev/backgrounds/aurora)
 * Adapted for the LexBrain AI dark amber/gold colour scheme.
 */
"use client";
import { useEffect, useRef } from "react";

export interface AuroraProps {
  /** Three hex colour strings for the three aurora blobs */
  colorStops?: [string, string, string];
  /** Motion amplitude multiplier (default 1) */
  amplitude?: number;
  /** Blur radius in px applied to the blob layer (default 130) */
  blend?: number;
  /** Animation speed multiplier (default 0.5) */
  speed?: number;
  /** Overall opacity of the aurora layer (default 0.75) */
  opacity?: number;
}

export function Aurora({
  colorStops = ["#1D4ED8", "#6366F1", "#060D18"],
  amplitude = 1.0,
  blend = 130,
  speed = 0.5,
  opacity = 0.75,
}: AuroraProps) {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    let t = 0;

    // Per-blob: base position (% of container), oscillation amplitude (%), phase offsets
    const configs = [
      { bx: 18, by: 22, ax: 22 * amplitude, ay: 18 * amplitude, px: 0,                py: 0 },
      { bx: 62, by: 52, ax: 28 * amplitude, ay: 22 * amplitude, px: Math.PI * 0.73,   py: Math.PI * 0.55 },
      { bx: 40, by: 78, ax: 20 * amplitude, ay: 16 * amplitude, px: Math.PI * 1.45,   py: Math.PI * 1.1  },
    ];

    const tick = () => {
      for (let i = 0; i < configs.length; i++) {
        const el = blobRefs.current[i];
        if (!el) continue;
        const c = configs[i];
        const x = c.bx + Math.sin(t * speed * 0.45 + c.px) * c.ax;
        const y = c.by + Math.cos(t * speed * 0.38 + c.py) * c.ay;
        el.style.left = `${x}%`;
        el.style.top  = `${y}%`;
      }
      t += 0.016;
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [amplitude, speed]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Extend beyond the viewport so blurred edges never show */}
      <div
        style={{
          position: "absolute",
          inset: "-25%",
          filter: `blur(${blend}px)`,
        }}
      >
        {colorStops.map((color, i) => (
          <div
            key={i}
            ref={el => { blobRefs.current[i] = el; }}
            style={{
              position: "absolute",
              width:  "65vw",
              height: "65vw",
              borderRadius: "50%",
              background: color,
              opacity: 0.55,
              transform: "translate(-50%, -50%)",
              /* initial positions — JS will take over from first frame */
              left: `${18 + i * 24}%`,
              top:  `${22 + i * 26}%`,
              willChange: "left, top",
            }}
          />
        ))}
      </div>
    </div>
  );
}
