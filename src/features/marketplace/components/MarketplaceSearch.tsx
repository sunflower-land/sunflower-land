import React from "react";
import { TextInput } from "components/ui/TextInput";
import { SUNNYSIDE } from "assets/sunnyside";

export const MarketplaceSearch: React.FC<{
  search: string;
  setSearch: (search: string) => void;
}> = ({ search, setSearch }) => {
  return (
    <div className="flex relative flex-col sm:flex-row lg:flex-col z-10 w-full">
      {/* Search input section */}
      <div className="w-full">
        <TextInput
          icon={SUNNYSIDE.icons.search}
          value={search}
          onValueChange={setSearch}
        />
      </div>
    </div>
  );
};
