import React from "react";

import nft from "assets/bumpkins/example.png";
export const BumpkinBuilder: React.FC = () => {
  return (
    <div>
      <img src={nft} className="h-48 bg-white bg-opacity-30 rounded-md p-2" />
    </div>
  );
};
