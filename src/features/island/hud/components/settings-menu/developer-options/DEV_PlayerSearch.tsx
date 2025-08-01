/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "components/ui/Button";
import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";
import { Loading } from "features/auth/components";
import { NumberInput } from "components/ui/NumberInput";
import {
  loadGameStateForVisit,
  VisitGameState,
} from "features/game/actions/loadGameStateForVisit";
import { useAuth } from "features/auth/lib/Provider";
import { CopyAddress } from "components/ui/CopyAddress";

export const DEV_PlayerSearch: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();
  const [state, setState] = useState<"idle" | "loading" | "loaded">("idle");
  const [farmId, setFarmId] = useState<number>(0);
  const [farm, setFarm] = useState<VisitGameState | null>(null);
  const { authState } = useAuth();

  const search = async () => {
    setState("loading");

    try {
      const { visitedFarmState: farm } = await loadGameStateForVisit(
        farmId,
        authState.context.user.rawToken,
      );
      setFarm(farm);
    } finally {
      setState("loaded");
    }
  };

  if (state === "loading") {
    return <Loading />;
  }

  if (state === "loaded" && !farm) {
    return <p>{`Farm ${farmId} not found`}</p>;
  }

  if (state === "loaded" && farm) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <p>{`Farm ID: ${farmId}`}</p>
        <p>{`Username: ${farm.username}`}</p>
        <div className="flex items-center">
          <p className="mr-2">{`Wallet: `}</p>
          {farm.moderator?.wallet && (
            <CopyAddress address={farm.moderator?.wallet} />
          )}
        </div>
        <p>{`NFT ID: ${farm.moderator?.nftId}`}</p>
        <div className="flex items-center">
          <p className="mr-2">{`Discord ID:`}</p>
          {farm.moderator?.discordId && (
            <CopyAddress address={farm.moderator.discordId} />
          )}
        </div>
        <p>{`Face Recognition: ${farm.moderator?.isFaceRecognised}`}</p>
        <p>{`Login with: ${farm.moderator?.account}`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex mb-2">
        <NumberInput
          value={farmId}
          maxDecimalPlaces={0}
          onValueChange={(decimal) => setFarmId(decimal.toNumber())}
        />
      </div>
      <Button className="w-full" onClick={search}>
        {t("search")}
      </Button>
    </div>
  );
};
