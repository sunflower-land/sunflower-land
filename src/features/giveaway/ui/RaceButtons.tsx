import React, { useEffect, useRef } from "react";
import { RACE_COLORS } from "../lib/raceControls";

type Feedback = { color: number; correct: boolean; nonce: number };

/**
 * The four race buttons (red/green/yellow/blue). A DOM overlay rather than
 * in-scene objects, so touch targets are big and reliable and the key hints
 * stay crisp regardless of the camera zoom. Taps are reported up to the scene
 * via `onPress`; desktop keys (A/S/D/F) are handled inside the scene.
 *
 * `target` is the colour the scene wants pressed next — that button is lit up,
 * the rest dimmed. `feedback` is the scene's verdict on the last press (from a
 * key OR a tap): the button pops on a hit and shakes with a ✗ on a miss. Both
 * are animated imperatively (Web Animations API) so they re-fire cleanly on
 * every press and self-clear without any extra state.
 */
export const RaceButtons: React.FC<{
  target: number | null;
  feedback?: Feedback;
  onPress: (color: number) => void;
}> = ({ target, feedback, onPress }) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const crossRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!feedback) return;

    // Pop on a hit, shake on a miss.
    buttonRefs.current[feedback.color]?.animate(
      feedback.correct
        ? [
            { transform: "scale(1)" },
            { transform: "scale(1.3)" },
            { transform: "scale(1)" },
          ]
        : [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" },
          ],
      { duration: feedback.correct ? 200 : 260, easing: "ease-out" },
    );

    // On a miss, flash the ✗ above the button (fades itself back to hidden).
    if (!feedback.correct) {
      crossRefs.current[feedback.color]?.animate(
        [
          { opacity: 0, transform: "translateY(4px)" },
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-4px)" },
        ],
        { duration: 650, easing: "ease-out" },
      );
    }
  }, [feedback?.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 sm:gap-4 pointer-events-auto">
      {RACE_COLORS.map((color, index) => {
        const isTarget = index === target;
        return (
          <button
            key={color.name}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            // pointerdown fires immediately on touch (no 300ms click delay).
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(index);
            }}
            className="relative rounded-lg flex items-center justify-center transition-transform"
            style={{
              width: "64px",
              height: "64px",
              background: color.css,
              border: "3px solid rgba(0,0,0,0.6)",
              touchAction: "manipulation",
              opacity: target === null || isTarget ? 1 : 0.4,
              transform: isTarget ? "scale(1.12)" : "scale(1)",
              boxShadow: isTarget
                ? "0 0 0 3px #ffffff, 0 3px 6px rgba(0,0,0,0.4)"
                : "0 3px 6px rgba(0,0,0,0.3)",
            }}
          >
            <span
              className="font-secondary select-none"
              style={{
                fontSize: "28px",
                lineHeight: 1,
                color: "#ffffff",
                textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
              }}
            >
              {color.key}
            </span>

            {/* Wrong-press ✗ hovering above the button (hidden until animated). */}
            <span
              ref={(el) => {
                crossRefs.current[index] = el;
              }}
              className="absolute select-none pointer-events-none"
              style={{
                top: "-28px",
                opacity: 0,
                fontSize: "28px",
                lineHeight: 1,
                color: "#e43b44",
                textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
              }}
            >
              {"✗"}
            </span>
          </button>
        );
      })}
    </div>
  );
};
