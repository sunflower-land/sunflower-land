import React from "react";

import { Button } from "components/ui/Button";
import fslIcon from "assets/icons/fsl_black.svg";

export const FSLButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button className="mb-1 py-2 text-sm relative" onClick={onClick}>
      <img src={fslIcon} className="w-10 h-10 left-[2px] mr-6 absolute top-0" />
      {"FSL ID"}
    </Button>
  );
};
