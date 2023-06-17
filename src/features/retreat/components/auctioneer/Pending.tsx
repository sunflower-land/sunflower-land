import React from "react";

import trivia from "assets/npcs/trivia.gif";

export const Pending: React.FC = () => {
  return (
    <div className="p-2 flex flex-col items-center">
      <img src={trivia} className="w-24 mb-2" />
      <p>The results are being calculated.</p>
      <p className="text-sm">Come back later.</p>
    </div>
  );
};
