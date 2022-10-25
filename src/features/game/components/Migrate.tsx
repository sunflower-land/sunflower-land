import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import React, { useContext } from "react";
import { Context } from "../GameProvider";
import boat from "assets/decorations/isles_boat.png";

export const Migrate: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  const handleMigration = () => {
    send("game.migrated");
  };

  const skipMigration = () => {
    send("SKIP_MIGRATION");
  };

  return (
    <>
      <div className="p-2 mb-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-2 text-center">Sunflower Isles</h1>
          <img src={boat} alt="Boat" className="w-32" />
        </div>

        <p className="mb-4 text-sm block">
          The blight of war has ravaged the land and it is not safe here
          anymore.
        </p>
        <p className="mb-4 text-sm block">
          There is a one way ticket available for the next boat to Sunflower
          Isles.
        </p>
        <p className="mb-2 text-sm">
          Would you like to board the ship with all your belongings?
        </p>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={skipMigration}>
          Not yet
        </Button>
        <Button className="ml-1" onClick={handleMigration}>
          {`Let's go`}
        </Button>
      </div>
    </>
  );
};

// It's not safe here right now.
// There is a one way ticket available for the next boat headed to Sunflower Isles.
// Would you like to board the ship with all your belongings now or do you need more time?
