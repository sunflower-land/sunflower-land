import { Label } from "components/ui/Label";
import React from "react";

type Props = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (filter: string) => void;
};

export const FeedFilters: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-2 min-h-7 m-1">
      {options.map((option) => {
        return (
          <div className="cursor-pointer" key={option.value}>
            <Label
              type={value === option.value ? "chill" : "transparent"}
              key={option.value}
              onClick={() =>
                onChange(value === option.value ? "" : option.value)
              }
            >
              <span className="mx-0.5">{option.label}</span>
            </Label>
          </div>
        );
      })}
    </div>
  );
};
