import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import React from "react";

export const InjectedProviderButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <Button className="mb-1 py-2 text-sm relative" onClick={onClick}>
      <div className="px-8">
        <img
          src={SUNNYSIDE.icons.worldIcon}
          className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
        />
        {"Web3 Wallet"}
      </div>
    </Button>
  );
};
