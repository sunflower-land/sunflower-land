import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const Cooldown: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">Welcome!</span>
      <img src={suspiciousGoblin} className="w-1/3 mt-2" />
      <span className="text-sm mt-2 mb-2">
        {`It looks like you are new to Sunflower Land and have claimed ownership
        of another player's account.`}
      </span>

      <span className="text-sm">
        To protect the community, we require a 2 week waiting period before this
        farm can be accessed.
      </span>
    </div>
  );
};
