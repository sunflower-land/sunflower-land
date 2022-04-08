import React from "react";

import donating from "assets/splash/goblin_donation.gif";

export const CreatingFarm: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-1">
      <p className="mb-1 text-center">
        Sending your donation and creating your farm.
      </p>
      <img src={donating} alt="donation loading" className="w-full" />
      <p className="mb-1 text-center underline">Do not refresh your browser!</p>
    </div>
  );
};
