import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import type Decimal from "decimal.js-light";
import { Label, type LabelType } from "./Label";
import { setPrecision, shortenCount } from "lib/utils/formatNumber";

/** The nearest ancestor that clips its overflow, e.g. a scrollable grid. */
const getClippingAncestor = (element: HTMLElement): HTMLElement | null => {
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (getComputedStyle(parent).overflowX !== "visible") return parent;
    parent = parent.parentElement;
  }
  return null;
};

interface CountLabelProps {
  isHover: boolean;
  count: Decimal;
  labelType?: LabelType;
  rightShiftPx: number;
  topShiftPx: number;
  parentDivRef?: React.RefObject<HTMLElement | null>;
}

export const CountLabel: React.FC<CountLabelProps> = ({
  isHover,
  count,
  labelType = "default",
  rightShiftPx,
  topShiftPx,
  parentDivRef,
}) => {
  const [showHiddenCountLabel, setShowHiddenCountLabel] = useState(false);
  const [shortCount, setShortCount] = useState("");

  const labelRef = useRef<HTMLDivElement>(null);

  const precisionCount = setPrecision(count, 4);

  useEffect(() => {
    setShortCount(shortenCount(precisionCount));
  }, [precisionCount]);

  useEffect(() => {
    setShowHiddenCountLabel(false);
  }, [isHover]);

  // The hovered label shows the full count, which can be much wider than the
  // short one. It grows leftwards from the box, so in a box near the left edge
  // it would spill out of its panel or be cut off by a scrolling grid. Measure
  // it once rendered and shift it right until it fits.
  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    label.style.right = `${rightShiftPx}px`;
    if (!isHover) return;

    const container = parentDivRef?.current ?? getClippingAncestor(label);
    const minLeft = Math.max(container?.getBoundingClientRect().left ?? 0, 0);
    const overflow = minLeft - label.getBoundingClientRect().left;

    if (overflow > 0) {
      label.style.right = `${rightShiftPx - overflow}px`;
    }
  }, [isHover, rightShiftPx, parentDivRef, showHiddenCountLabel, shortCount]);

  return (
    <div
      onMouseEnter={() => {
        setShowHiddenCountLabel(true);
      }}
      onMouseLeave={() => setShowHiddenCountLabel(false)}
    >
      {/* Visible Label */}
      <div
        ref={labelRef}
        className={classNames("absolute", {
          "z-10": !isHover,
          "z-20": isHover,
        })}
        style={{
          right: `${rightShiftPx}px`,
          top: `${topShiftPx}px`,
          pointerEvents: "none",
        }}
      >
        <Label
          type={labelType}
          style={{
            padding: "0 2.5",
            height: "24px",
          }}
        >
          {isHover && !showHiddenCountLabel
            ? precisionCount.toString()
            : shortCount}
        </Label>
      </div>
    </div>
  );
};
