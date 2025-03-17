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
import { getObjectEntries } from "features/game/expansion/lib/utils";

export const AirdropPlayer: React.FC<
  ContentComponentProps & { id?: number }
> = ({ id = 0 }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [farmId, setFarmId] = useState(id);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState<number>();
  const [loveCharm, setLoveCharm] = useState<number>();
  const [message, setMessage] = useState("");

  const send = async () => {
    gameService.send("reward.airdropped", {
      effect: {
        type: "reward.airdropped",
        coins: coins,
        items: {
          ...(gems ? { Gem: gems } : {}),
          ...(loveCharm ? { "Love Charm": loveCharm } : {}),
        },
        farmId,
        message,
        wearables: {},
      },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

  const NUMBER_INPUT_ITEMS = {
    "Farm ID": {
      value: farmId,
      setValue: setFarmId,
      maxDecimalPlaces: 0,
      icon: SUNNYSIDE.icons.search,
    },
    Coins: {
      value: coins,
      setValue: setCoins,
      maxDecimalPlaces: 0,
      icon: coinsIcon,
    },
    Gems: {
      value: gems ?? 0,
      setValue: setGems,
      maxDecimalPlaces: 0,
      icon: ITEM_DETAILS.Gem.image,
    },
    "Love Charm": {
      value: loveCharm ?? 0,
      setValue: setLoveCharm,
      maxDecimalPlaces: 0,
      icon: ITEM_DETAILS["Love Charm"].image,
    },
  };

  return (
    <>
      <div className="p-1">
        <div className="flex flex-col gap-1">
          {getObjectEntries(NUMBER_INPUT_ITEMS).map(
            ([key, { icon, value, setValue, maxDecimalPlaces }]) => (
              <div key={key}>
                <Label type="default" icon={icon} className="my-1">
                  {key}
                </Label>
                <NumberInput
                  value={value}
                  onValueChange={(decimal) => setValue(decimal.toNumber())}
                  maxDecimalPlaces={maxDecimalPlaces}
                />
              </div>
            ),
          )}
        </div>
        <Label
          type="default"
          icon={SUNNYSIDE.icons.expression_chat}
          className="my-1"
        >
          {`Message`}
        </Label>
        <TextInput
          placeholder="Type your message..."
          value={message}
          onValueChange={(msg) => setMessage(msg)}
        />
      </div>
      <Button
        className="mb-1"
        disabled={!farmId || (!coins && !gems && !loveCharm)}
        onClick={send}
      >
        {`Send`}
      </Button>
    </>
  );
};
