import React from "react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";

type Props = {
  onConfirm: () => void;
  onDecline: () => void;
};
export const ResourceBUttons: React.FC<Props> = ({ onConfirm, onDecline }) => {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
      <OuterPanel>
        <div className="flex items-stretch space-x-2 h-9 sm:h-12 w-80 sm:w-[400px]">
          <Button onClick={onDecline}>
            <img src={SUNNYSIDE.icons.cancel} alt="cancel" className="h-full" />
          </Button>
          <Button onClick={onConfirm}>
            <img
              src={SUNNYSIDE.icons.confirm}
              alt="confirm"
              className="h-full"
            />
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
