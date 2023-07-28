import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

export const NoFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);

  const explore = () => {
    authService.send("EXPLORE");
  };

  const create = () => {
    authService.send("CHOOSE_CHARITY");
  };

  return (
    <div className="px-4 py-2">
      <Button onClick={create} className="overflow-hidden mb-2">
        Mint farm
      </Button>

      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's land`}
      </Button>
    </div>
  );
};
