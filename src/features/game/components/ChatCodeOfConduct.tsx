import React from "react";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onAcknowledge: () => void;
}
export const CodeOfConduct: React.FC<Props> = ({ onAcknowledge }) => {
  return (
    <div className=" p-2">
      <p className="text-lg text-center">Code of Conduct</p>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={SUNNYSIDE.icons.heart} className="h-8" />
        </div>
        <div className="flex-1">
          <p>No harrassment, swearing or bullying.</p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={SUNNYSIDE.icons.expression_chat} className="h-8" />
        </div>
        <div className="flex-1">
          <p>No selling or shilling of projects.</p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={SUNNYSIDE.icons.expression_alerted} className="h-8" />
        </div>
        <div className="flex-1">
          <p>No abuse of features.</p>
        </div>
      </div>
      <Button onClick={onAcknowledge} className="mt-4">
        Continue
      </Button>
      <p className="text-xs underline mt-2 text-center">
        <a
          href="https://docs.sunflower-land.com/support/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center"
        >
          Terms of Service
        </a>
      </p>
    </div>
  );
};
