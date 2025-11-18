import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import classNames from "classnames";
import { Checkbox } from "components/ui/Checkbox";

export interface FilterOptionProps {
  icon?: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  options?: FilterOptionProps[];
  hasOptions?: boolean;
  level?: number;
  onToggle?: (checked: boolean) => void;
  checked?: boolean;
}

export const FilterOption: React.FC<FilterOptionProps> = ({
  icon,
  label,
  onClick,
  options,
  isActive,
  onToggle,
  checked = false,
  level = 0,
}) => {
  const isCheckbox = !!onToggle;
  const showChevron = !isCheckbox;

  const handleClick = () => {
    if (isCheckbox) {
      onToggle(!checked);
    } else {
      onClick?.();
    }
  };

  const levelIndentValue = !!icon || level === 1 ? 20 : 15;

  return (
    <div className="mb-1">
      <div
        className={classNames(
          "flex justify-between items-center cursor-pointer mb-1 ",
          { "bg-brown-100 px-2 py-0.5 -mx-2": isActive },
        )}
        onClick={isCheckbox || onClick ? handleClick : undefined}
      >
        <div
          className="flex items-center"
          style={{
            marginLeft: level > 0 ? `${level * levelIndentValue}px` : undefined,
          }}
        >
          {icon && <SquareIcon icon={icon} width={10} />}
          <span
            className={`${level > 0 ? "text-xs truncate py-1" : "text-sm"} ml-2`}
          >
            {label}
          </span>
        </div>
        {isCheckbox ? (
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ marginRight: level > 0 ? `${level * 20}px` : undefined }}
          >
            <Checkbox
              checked={checked}
              onChange={(value) => onToggle?.(value)}
            />
          </div>
        ) : showChevron ? (
          <img
            src={
              options?.length
                ? SUNNYSIDE.icons.chevron_down
                : SUNNYSIDE.icons.chevron_right
            }
            className={`${options?.length ? "w-6" : "w-[18px]"}`}
            style={{ marginRight: level > 0 ? `${level * 20}px` : undefined }}
          />
        ) : null}
      </div>

      {options?.map((option) => (
        <FilterOption key={option.label} {...option} level={level + 1} />
      ))}
    </div>
  );
};
