import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import classNames from "classnames";

export interface FilterOptionProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  options?: FilterOptionProps[];
  level?: number;
}

export const FilterOption: React.FC<FilterOptionProps> = ({
  icon,
  label,
  onClick,
  options,
  isActive,
  level = 0,
}) => {
  return (
    <div className="mb-1">
      <div
        className={classNames(
          "flex justify-between items-center cursor-pointer mb-1 ",
          { "bg-brown-100 px-2 -mx-2": isActive },
        )}
        onClick={onClick}
      >
        <div
          className="flex items-center"
          style={{ marginLeft: level > 0 ? `${level * 15}px` : undefined }}
        >
          <SquareIcon icon={icon} width={10} />
          <span
            className={`${level > 0 ? "text-xs truncate max-w-[160px] sm:max-w-[90px]" : "text-sm"} ml-2`}
          >
            {label}
          </span>
        </div>
        <img
          src={
            options
              ? SUNNYSIDE.icons.chevron_down
              : SUNNYSIDE.icons.chevron_right
          }
          className={`${options ? "w-6" : "w-[18px]"}`}
          style={{ marginRight: level > 0 ? `${level * 20}px` : undefined }}
        />
      </div>

      {options?.map((option) => (
        <FilterOption key={option.label} {...option} level={level + 1} />
      ))}
    </div>
  );
};
