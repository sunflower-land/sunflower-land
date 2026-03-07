/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "components/ui/Button";
import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";
import { Loading } from "features/auth/components";
import { NumberInput } from "components/ui/NumberInput";
import { VisitGameState } from "features/game/actions/loadGameStateForVisit";
import { useAuth } from "features/auth/lib/Provider";
import { CopyAddress } from "components/ui/CopyAddress";
import { loadGameStateForAdmin } from "features/game/actions/adminSearch";
import { useGame } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { MANAGER_IDS } from "lib/access";

export const DEV_PlayerSearch: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();
  const [state, setState] = useState<"idle" | "loading" | "loaded">("idle");
  const [farmId, setFarmId] = useState<number>(0);
  const [nftId, setNftId] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [discordId, setDiscordId] = useState<string>("");
  const [wallet, setWallet] = useState<string>("");
  const [farm, setFarm] = useState<(VisitGameState & { id: number }) | null>(
    null,
  );
  const { authState } = useAuth();
  const { gameState, gameService } = useGame();

  const search = async () => {
    setState("loading");

    try {
      const { visitedFarmState: farm, id } = await loadGameStateForAdmin({
        adminId: gameState.context.farmId,
        farmId,
        token: authState.context.user.rawToken as string,
        username,
        discordId,
        nftId,
        wallet,
      });
      setFarm({
        ...farm,
        id,
      });
    } finally {
      setState("loaded");
    }
  };

  if (state === "loading") {
    return <Loading />;
  }

  if (state === "loaded" && !farm?.id) {
    return <p>{`Farm not found`}</p>;
  }

  if (state === "loaded" && farm) {
    const isManager = MANAGER_IDS.includes(gameState.context.farmId);
    return (
      <div className="flex flex-col p-1">
        <div className="flex items-center">
          <p className="mr-2">{`Farm ID:`}</p>
          <CopyAddress address={farm.id.toString()} />
        </div>

        <p>{`Farm ID: ${farm.id}`}</p>
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

        {isManager && !farm.moderator?.nftId && (
          <Button
            onClick={() => {
              gameService.send("admin.NFTAssigned", {
                effect: { type: "admin.NFTAssigned", farmId: farm.id },
                authToken: authState.context.user.rawToken as string,
              });
            }}
          >
            {`Assign NFT`}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col  p-3">
      <Label type="default" className="m-1">
        {`Farm ID`}
      </Label>
      <div className="flex mb-2">
        <NumberInput
          value={farmId}
          maxDecimalPlaces={0}
          onValueChange={(decimal) => setFarmId(decimal.toNumber())}
        />
      </div>
      <Label type="default" className="m-1">
        {`Username`}
      </Label>
      <div className="flex mb-2">
        <TextInput value={username} onValueChange={(e) => setUsername(e)} />
      </div>
      <Label type="default" className="m-1">
        {`Discord ID`}
      </Label>
      <div className="flex mb-2">
        <TextInput value={discordId} onValueChange={(e) => setDiscordId(e)} />
      </div>
      <Label type="default" className="m-1">
        {" "}
        {`NFT ID`}
      </Label>
      <div className="flex mb-2">
        <NumberInput
          value={nftId}
          maxDecimalPlaces={0}
          onValueChange={(decimal) => setNftId(decimal.toNumber())}
        />
      </div>
      <Label type="default" className="m-1">
        {`Wallet`}
      </Label>
      <div className="flex mb-2">
        <TextInput value={wallet} onValueChange={(e) => setWallet(e)} />
      </div>

      <Button
        className="w-full"
        onClick={search}
        disabled={!farmId && !username && !discordId && !nftId && !wallet}
      >
        {t("search")}
      </Button>
    </div>
  );
};
