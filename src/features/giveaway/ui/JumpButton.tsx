import React, { useEffect, useRef } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { JumpControls } from "../lib/jumpControls";
import {
  RING_TOP,
  PERFECT_ARC,
  GOOD_ARC,
  type JumpQuality,
} from "../lib/jumpScoring";

const SIZE = 150;
const CENTER = SIZE / 2;
const RADIUS = 62;

const QUALITY_COLOR: Record<JumpQuality, string> = {
  perfect: "#b65cbf",
  good: "#ffd12b",
  miss: "#e43b44",
};

/** SVG arc path from angle a0 to a1 (radians) on the ring. */
const arcPath = (a0: number, a1: number) => {
  const x0 = CENTER + RADIUS * Math.cos(a0);
  const y0 = CENTER + RADIUS * Math.sin(a0);
  const x1 = CENTER + RADIUS * Math.cos(a1);
  const y1 = CENTER + RADIUS * Math.sin(a1);
  return `M ${x0} ${y0} A ${RADIUS} ${RADIUS} 0 0 1 ${x1} ${y1}`;
};

const onRing = (r: number, a: number) => ({
  x: CENTER + r * Math.cos(a),
  y: CENTER + r * Math.sin(a),
});

/**
 * The Jumper tap button, wrapped by the spinning timing ring. The marker angle
 * comes from the scene via `controls.theta` (spun with rAF, no React re-render).
 * Each graded tap (`controls.lastTap`) leaves a short coloured tick where the
 * marker was, pops the button, and sends a coloured ripple out of the ring — so
 * you can read your timing at a glance. Desktop players can hit SPACE instead.
 */
export const JumpButton: React.FC<{ controls: JumpControls }> = ({
  controls,
}) => {
  const { t } = useAppTranslation();
  const markerRef = useRef<SVGCircleElement>(null);
  const tickRef = useRef<SVGLineElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    let seenNonce = 0;

    const spin = () => {
      // Spin the marker.
      const m = onRing(RADIUS, controls.theta);
      markerRef.current?.setAttribute("cx", `${m.x}`);
      markerRef.current?.setAttribute("cy", `${m.y}`);

      // React to a new graded tap: drop a tick + flash feedback.
      const tap = controls.lastTap;
      if (tap && tap.nonce !== seenNonce) {
        seenNonce = tap.nonce;
        const color = QUALITY_COLOR[tap.quality];

        // Persistent tick where the marker was.
        const inner = onRing(RADIUS - 7, tap.angle);
        const outer = onRing(RADIUS + 7, tap.angle);
        const tick = tickRef.current;
        if (tick) {
          tick.setAttribute("x1", `${inner.x}`);
          tick.setAttribute("y1", `${inner.y}`);
          tick.setAttribute("x2", `${outer.x}`);
          tick.setAttribute("y2", `${outer.y}`);
          tick.setAttribute("stroke", color);
          tick.style.opacity = "1";
          tick.animate([{ opacity: 0.2 }, { opacity: 1 }], {
            duration: 150,
            easing: "ease-out",
          });
        }

        // A coloured ripple bursting out of the ring.
        const ripple = rippleRef.current;
        if (ripple) {
          ripple.setAttribute("stroke", color);
          ripple.animate(
            [
              { transform: "scale(1)", opacity: 0.85, strokeWidth: 6 },
              { transform: "scale(1.35)", opacity: 0, strokeWidth: 1 },
            ],
            { duration: 420, easing: "ease-out" },
          );
        }

        // Pop the button.
        buttonRef.current?.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.14)" },
            { transform: "scale(1)" },
          ],
          { duration: 200, easing: "ease-out" },
        );
      }

      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, [controls]);

  const top = onRing(RADIUS, RING_TOP);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* The spinning timing ring, wrapped around the button. */}
        <svg width={SIZE} height={SIZE} className="absolute inset-0">
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={6}
          />
          {/* Good zone, then the perfect sliver on top, both at the top. */}
          <path
            d={arcPath(RING_TOP - GOOD_ARC, RING_TOP + GOOD_ARC)}
            fill="none"
            stroke="#ffd12b"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={arcPath(RING_TOP - PERFECT_ARC, RING_TOP + PERFECT_ARC)}
            fill="none"
            stroke="#b65cbf"
            strokeWidth={6}
            strokeLinecap="round"
          />
          {/* Ripple burst on tap (scaled from the ring centre). */}
          <circle
            ref={rippleRef}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#ffffff"
            strokeWidth={6}
            style={{
              opacity: 0,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
          {/* The short tick left by your last tap. */}
          <line
            ref={tickRef}
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER}
            stroke="#ffffff"
            strokeWidth={4}
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
          {/* The spinning marker. */}
          <circle
            ref={markerRef}
            cx={top.x}
            cy={top.y}
            r={6}
            fill="#ffffff"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={1.5}
          />
        </svg>

        {/* The tap button, centred inside the ring. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            ref={buttonRef}
            onPointerDown={(e) => {
              e.preventDefault();
              controls.tap();
            }}
            className="rounded-full flex items-center justify-center pointer-events-auto"
            style={{
              width: "88px",
              height: "88px",
              background: "#b65cbf",
              border: "4px solid rgba(0,0,0,0.6)",
              touchAction: "manipulation",
              boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
            }}
          >
            <span
              className="font-secondary select-none text-white"
              style={{
                fontSize: "20px",
                lineHeight: 1,
                textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
              }}
            >
              {t("giveaway.jump")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
