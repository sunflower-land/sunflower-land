import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Button } from "components/ui/Button";
import { ContentComponentProps } from "../GameOptions";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import coinsIcon from "assets/icons/coins.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { TextInput } from "components/ui/TextInput";

export const AdminSettings: React.FC<
  ContentComponentProps & { id?: number }
> = ({ id = 0 }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [farmId, setFarmId] = useState(id);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);
  const [message, setMessage] = useState("");

  const send = async () => {
    gameService.send("reward.airdropped", {
      effect: {
        type: "reward.airdropped",
        coins: coins,
        items: gems
          ? {
              Gem: gems,
            }
          : {},
        farmId,
        message,
      },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

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
        <Label
          type="default"
          icon={SUNNYSIDE.icons.expression_chat}
          className="my-1"
        >{`Message`}</Label>
        <TextInput
          placeholder="Type your message..."
          value={message}
          onValueChange={(msg) => setMessage(msg)}
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
