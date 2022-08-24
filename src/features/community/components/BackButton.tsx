import React from "react";

import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

interface Props {
  farmId: number;
}

export const BackButton: React.FC<Props> = ({ farmId }) => {
  const goBackToFarm = () => {
    console.log(farmId);
    window.location.href = `${window.location.pathname}#/farm/${farmId}`;
  };

  return (
    <OuterPanel className="w-40 fixed top-2 left-2 z-50 shadow-lg">
      <Button className="text-white text-sm text-shadow" onClick={goBackToFarm}>
        Back
      </Button>
    </OuterPanel>
  );
};
