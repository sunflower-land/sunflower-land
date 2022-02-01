import React from "react";
import { Panel } from "components/ui/Panel";

import donating from "assets/splash/donation_small.gif";

export const SettingUpFarm: React.FC = () => {
  return (
    <Panel>
      <div className="flex flex-col items-center p-1">
        <p className="mb-1 text-center">
          Sending your donation and creating your farm.
        </p>
        <img src={donating} alt="donation loading" className="w-full" />
      </div>
    </Panel>
  );
};
