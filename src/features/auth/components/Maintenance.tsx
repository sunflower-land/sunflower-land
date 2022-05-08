import React from "react";

import hammering from "assets/npcs/goblin_hammering.gif";

export const Maintenance: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center mb-3">Maintenance</p>

      <img src={hammering} alt="Maintenance" className="w-2/3" />

      <p className="text-center mb-4 text-sm">
        {`New things are coming! Thanks for your patience, the game will be live again shortly.`}
      </p>
    </div>
  );
};
