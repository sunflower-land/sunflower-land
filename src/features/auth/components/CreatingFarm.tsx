import React from "react";

import donating from "assets/splash/goblin_donation.gif";

export const CreatingFarm: React.FC = () => {
  return (
    <div className="flex flex-col text-center items-center p-2">
      <p className="loading">Creating your account</p>
      <img src={donating} alt="donation loading" className="w-full m-2" />
    </div>
  );
};
