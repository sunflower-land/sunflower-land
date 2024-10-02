import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Button } from "components/ui/Button";
import { ContentComponentProps } from "../GameOptions";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import coinsIcon from "assets/icons/coins.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { postEffect } from "features/game/actions/effect";
import { Context } from "features/game/GameProvider";
import { Loading } from "features/auth/components";

export const AdminSettings: React.FC<ContentComponentProps> = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [farmId, setFarmId] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);

  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  const send = async () => {
    setState("sending");

    try {
      await postEffect({
        farmId: Number(gameService.state.context.farmId),
        effect: {
          type: "reward.airdropped",
          coins: coins,
          items: gems
            ? {
                Gem: gems,
              }
            : {},
          farmId,
        },
        token: authService.state.context.user.rawToken as string,
        transactionId: "0x123",
      });

      setState("success");
    } catch (e) {
      alert(e);
      setState("error");
    }
  };

  if (state === "error") {
    return <span>{`Something went wrong`}</span>;
  }

  if (state === "sending") {
    return <Loading />;
  }

  if (state === "success") {
    return <span>{`Success!`}</span>;
  }

  return (
    <>
      <div className="p-1">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.search}
          className="my-1"
        >{`Farm ID`}</Label>
        <NumberInput
          value={farmId}
          onValueChange={(decimal) => setFarmId(decimal.toNumber())}
          maxDecimalPlaces={0}
        />
        <Label
          type="default"
          icon={coinsIcon}
          className="my-1"
        >{`Coins`}</Label>
        <NumberInput
          value={coins}
          onValueChange={(decimal) => setCoins(decimal.toNumber())}
          maxDecimalPlaces={0}
        />

        <Label
          type="default"
          icon={ITEM_DETAILS.Gem.image}
          className="my-1"
        >{`Gems`}</Label>
        <NumberInput
          value={gems}
          onValueChange={(decimal) => setGems(decimal.toNumber())}
          maxDecimalPlaces={0}
        />
      </div>
      <Button
        className="mb-1"
        disabled={!farmId || (!coins && !gems)}
        onClick={send}
      >
        {`Send`}
      </Button>
    </>
  );
};
