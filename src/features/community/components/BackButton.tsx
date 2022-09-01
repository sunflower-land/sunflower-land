import React from "react";

import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <OuterPanel className="w-40 fixed top-2 left-2 z-50 shadow-lg">
      <Button
        className="text-white text-sm text-shadow"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </OuterPanel>
  );
};
