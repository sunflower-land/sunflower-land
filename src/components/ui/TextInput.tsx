import React, { ChangeEvent, useState } from "react";
import classNames from "classnames";

import bg from "assets/ui/input_box_border.png";
import activeBg from "assets/ui/active_input_box_border.png";
import { SquareIcon } from "./SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  value?: string;
  className?: string;
  onValueChange: (value: string) => void;
  onCancel?: () => void;
  icon?: string;
  placeholder?: string;
  maxLength?: number;
};

export const TextInput: React.FC<Props> = ({
  value,
  onValueChange,
  icon,
  className,
  placeholder,
  onCancel,
  maxLength,
}) => {
  const { t } = useAppTranslation();

  const [isFocused, setIsFocused] = useState(false); // State for focus

  let padding = 0;

  if (isFocused) {
    padding += 2;
  }

  if (icon) {
    padding += 32;
  }
  return (
    <div className={classNames("relative w-full")}>
      <input
        style={{
          borderStyle: "solid",
          background: "white",
          padding: `0 ${padding}px`,
          imageRendering: "pixelated",
          borderImageRepeat: "stretch",
          outline: "none",
          borderImage: `url(${isFocused ? activeBg : bg})`,
          borderWidth: `10px 10px 10px 10px`,
          borderImageSlice: isFocused ? "4 fill" : "4 4 4 4 fill",
        }}
        type="text"
        placeholder={placeholder ?? t("searchHere")}
        value={value}
        maxLength={maxLength}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onValueChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(false)} // Set focus state to false
        className={classNames(
          "!bg-transparent cursor-pointer w-full p-2 h-12 font-secondary",
          className,
        )}
      />
      {icon && (
        <div className="absolute flex flex-row items-center mx-2 pointer-events-none h-full top-0 left-0">
          <SquareIcon icon={icon} width={10} />
        </div>
      )}
      {onCancel && value && (
        <div
          onClick={onCancel}
          className="absolute flex flex-row items-center mx-2 cursor-pointer h-full top-0 right-0"
        >
          <SquareIcon icon={SUNNYSIDE.icons.cancel} width={10} />
        </div>
      )}
    </div>
  );
};
