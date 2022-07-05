import React from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

export const TraderModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Panel>
      <div className="p-2">
        <div className="flex justify-between mb-4">
          <p className="text-xs">Free Trades: {0}</p>
          <p className="text-xs">Remaining Trades: {0}</p>
        </div>

        <div className="border border-dashed mb-4">Test</div>
        <Button className="mr-1" onClick={onClose}>
          Close
        </Button>
      </div>
    </Panel>
  );
};
