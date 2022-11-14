import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Button } from "components/ui/Button";
import { Context } from "../GameProvider";
import boat from "assets/decorations/isles_boat.png";
import pumpkinSoup from "assets/sfts/pumpkin_soup.png";
import sauerkraut from "src/assets/sfts/saurrerkrat.png";
import roastedCauliflower from "assets/sfts/roasted_cauliflower.png";
import radishPie from "assets/sfts/radish_pie.png";
import skull from "src/assets/decorations/war_skulls.png";

export const Migrate: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [_, send] = useActor(gameService);
  const [page, setPage] = useState<"intro" | "confirm">("intro");

  const handleClick = () => {
    if (page === "intro") {
      return setPage("confirm");
    }

    send("game.migrated");
    authService.send("MIGRATE");
  };

  const handleSkip = () => {
    send("SKIP_MIGRATION");
  };

  return (
    <>
      {page === "intro" && (
        <div className="p-2 mb-2">
          <div className="flex flex-col items-center mb-3">
            <h1 className="text-lg mb-2 text-center">Sunflower Isles</h1>
            <img src={boat} alt="Boat" className="w-32" />
          </div>

          <p className="mb-3 text-sm block">
            The blight of war has ravaged the land and it is not safe here
            anymore.
          </p>
          <p className="mb-3 text-sm block">
            There is a ONE WAY ticket available on the next boat to Sunflower
            Isles.
          </p>
          <p className="mb-2 text-sm">
            Would you like to board the ship with all your belongings?
          </p>
        </div>
      )}

      {page === "confirm" && (
        <div className="p-2 mb-2">
          <div className="flex flex-col items-center mb-3">
            <h1 className="text-lg mb-2 text-center">Warning!</h1>
            <img src={skull} alt="Warning" className="w-12" />
          </div>

          <p className="mb-3 text-sm block">This is a one time trip!</p>
          <p className="mb-3 text-sm block">
            If you leave, you will end your adventure on Sunflower Land and your
            contribution to the war will end.
          </p>
          <p className="mb-3 text-sm block">
            If you have crops planted or chickens laying eggs you will not be
            able to harvest those items.
          </p>
          <p className="mb-2 text-sm">
            The following cooked items are not welcome in Sunflower Isles:
          </p>
          <div className="mb-3 flex justify-center items-end space-x-1">
            <img src={pumpkinSoup} alt="Pumpkin Soup" style={{ width: 30 }} />
            <img src={sauerkraut} alt="Sauerkraut" style={{ height: 20 }} />
            <img
              src={roastedCauliflower}
              alt="Roasted Cauliflower"
              style={{ height: 20 }}
            />
            <img src={radishPie} alt="Radish Pie" style={{ width: 30 }} />
          </div>
          <p className="mb-3 text-sm">
            We will pay you a generous amount of SFL to take them off your
            hands.
          </p>
          <p className="mb-2 text-sm">
            Are you sure you have everything you need?
          </p>
        </div>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={handleSkip}>
          Not yet
        </Button>
        <Button className="ml-1" onClick={handleClick}>
          {page === "intro" ? `Let's go` : `I'm ready`}
        </Button>
      </div>
    </>
  );
};
