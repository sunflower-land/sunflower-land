import React from "react";
import { TextInput } from "components/ui/TextInput";
import { SUNNYSIDE } from "assets/sunnyside";

/** Enter in the search box jumps to the first result card. */
const focusFirstResult = () =>
  document.querySelector<HTMLElement>("[data-marketplace-card]")?.focus();

export const MarketplaceSearch: React.FC<{
  search: string;
  setSearch: (search: string) => void;
  autoFocus?: boolean;
}> = ({ search, setSearch, autoFocus }) => {
  return (
    <div className="flex relative flex-col sm:flex-row lg:flex-col z-10 w-full">
      {/* Search input section */}
      <div className="w-full">
        <TextInput
          icon={SUNNYSIDE.icons.search}
          value={search}
          onValueChange={setSearch}
          onCancel={() => setSearch("")}
          autoFocus={autoFocus}
          onEnter={focusFirstResult}
        />
      </div>
    </div>
  );
};
