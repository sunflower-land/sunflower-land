import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { Label, LabelType } from "./Label";
import { setPrecision, shortenCount } from "lib/utils/formatNumber";

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
  const labelCheckerRef = useRef<HTMLDivElement>(null);

  const precisionCount = setPrecision(count, 4);

  useEffect(() => {
    setShortCount(shortenCount(precisionCount));
  }, [precisionCount]);

  // Handle label positioning
  useEffect(() => {
    setShowHiddenCountLabel(false);

    if (!isHover && labelRef.current) {
      labelRef.current.style.right = `${rightShiftPx}px`;
      return;
    }

    if (!labelRef.current || !labelCheckerRef.current) {
      return;
    }

    const hiddenCountLabelBounding =
      labelCheckerRef.current.getBoundingClientRect();
    const parentDivBounding = parentDivRef?.current?.getBoundingClientRect();

    if (
      parentDivBounding &&
      hiddenCountLabelBounding.left < parentDivBounding.left
    ) {
      labelRef.current.style.right = `${
        rightShiftPx + hiddenCountLabelBounding.left - parentDivBounding.left
      }px`;
      return;
    }

    if (hiddenCountLabelBounding?.left < 0) {
      labelRef.current.style.right = `${
        rightShiftPx + hiddenCountLabelBounding.left
      }px`;
    }
  }, [isHover, rightShiftPx]);

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

      {/* Hidden Label for Position Calculation */}
      {showHiddenCountLabel && (
        <div
          ref={labelCheckerRef}
          className="absolute opacity-0"
          style={{
            right: `${rightShiftPx}px`,
            top: `${topShiftPx}px`,
            pointerEvents: "none",
          }}
        >
          <Label
            type="default"
            style={{
              padding: "0 2.5",
              height: "24px",
            }}
          >
            {precisionCount.toString()}
          </Label>
        </div>
      )}
    </div>
  );
};
