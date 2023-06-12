import React from "react";

import trivia from "assets/npcs/trivia.gif";

export const Refunded: React.FC = () => {
  return (
    <div>
      <div className="p-2 flex flex-col items-center">
        <img src={trivia} className="w-24 mb-2" />

        <p className="text-center mb-1">
          Your items have been returned to your inventory
        </p>
        <p className="text-sm">Good luck next time!</p>
      </div>
    </div>
  );
};
