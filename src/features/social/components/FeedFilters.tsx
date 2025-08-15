import { Label } from "components/ui/Label";
import React from "react";
import { FeedFilter, FeedFilterOption } from "../Feed";

type Props = {
  options: FeedFilterOption[];
  value: FeedFilter;
  onChange: (filter: FeedFilter) => void;
};

export const FeedFilters: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {options.map((option) => {
        return (
          <div className="cursor-pointer" key={option.value}>
            <Label
              type={value === option.value ? "chill" : "transparent"}
              key={option.value}
              onClick={() =>
                onChange(value === option.value ? "all" : option.value)
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
