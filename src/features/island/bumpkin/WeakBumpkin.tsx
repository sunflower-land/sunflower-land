import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import React, { useContext, useState } from "react";
import lock from "assets/skills/lock.png";
import { BUMPKIN_EXPANSIONS_LEVEL } from "features/game/types/expansions";
import { Button } from "components/ui/Button";
import { IslandList } from "features/game/expansion/components/travel/IslandList";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const WeakBumpkin: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showList, setShowList] = useState(false);
  const { t } = useAppTranslation();

  const requiredLevel =
    BUMPKIN_EXPANSIONS_LEVEL[gameState.context.state.island.type][
      gameState.context.state.inventory["Basic Land"]?.toNumber() ?? 3
    ];

  if (showList) {
    return (
      <IslandList
        bumpkin={undefined}
        showVisitList={false}
        gameState={gameState.context.state}
        travelAllowed={true}
        hasBetaAccess={false}
        onClose={() => setShowList(false)}
      />
    );
  }

  return (
    <>
      <div className="p-2">
        <img src={SUNNYSIDE.icons.sad} className="w-16 mx-auto my-2" />
        <p className="text-sm mb-2 text-center">{t("weakBumpkin.notStrong")}</p>
        <Label
          type="danger"
          className="mx-auto my-2"
          icon={lock}
        >{`Level ${requiredLevel} required`}</Label>
      </div>
      <Button onClick={() => setShowList(true)}>{t("travel")}</Button>
    </>
  );
};
