import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Button } from "components/ui/Button";
import { ContentComponentProps } from "../GameOptions";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import coinsIcon from "assets/icons/coins.webp";
import vipIcon from "assets/icons/vip.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { TextInput } from "components/ui/TextInput";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { Wallet } from "features/wallet/Wallet";

interface AirdropItem {
  value: number;
  setValue: (value: number) => void;
  icon: string;
  maxDecimalPlaces: number;
}

interface ItemInputsProps {
  items: Record<string, AirdropItem>;
}

const ItemInputs: React.FC<ItemInputsProps> = ({ items }) => {
  return (
    <>
      {getObjectEntries(items).map(
        ([key, { icon, value, setValue, maxDecimalPlaces }]) => (
          <div key={key}>
            <Label type="default" icon={icon} className="m-1">
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
    </>
  );
};

interface AirdropContentProps {
  basicItems: Record<string, AirdropItem>;
  advancedItems: Record<string, AirdropItem>;
  showAdvancedItems: boolean;
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  disabled: boolean;
  setShowAdvancedItems?: (show: boolean) => void;
}

const AirdropContent: React.FC<AirdropContentProps> = ({
  basicItems,
  advancedItems,
  showAdvancedItems,
  message,
  setMessage,
  onSend,
  disabled,
  setShowAdvancedItems,
}) => (
  <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto scrollable">
    <div className="p-1">
      <div className="flex flex-col gap-1">
        <ItemInputs items={basicItems} />
        {showAdvancedItems && <ItemInputs items={advancedItems} />}
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
        onValueChange={setMessage}
      />
      {setShowAdvancedItems && (
        <div className="flex flex-row items-center m-1">
          <p
            className="text-xs cursor-pointer underline py-1"
            onClick={() => setShowAdvancedItems(true)}
          >
            {`Show Advanced Items`}
          </p>
        </div>
      )}
    </div>
    <Button className="mb-1" disabled={disabled} onClick={onSend}>
      {`Send`}
    </Button>
  </div>
);

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
  const [betaPassCount, setBetaPassCount] = useState(0);
  const [haloCount, setHaloCount] = useState(0);
  const [showAdvancedItems, setShowAdvancedItems] = useState(false);
  const [vipDays, setVipDays] = useState<number>();

  const send = async () => {
    gameService.send("reward.airdropped", {
      effect: {
        type: "reward.airdropped",
        coins,
        items: {
          ...(gems ? { Gem: gems } : {}),
          ...(loveCharm ? { "Love Charm": loveCharm } : {}),
          ...(betaPassCount ? { "Beta Pass": betaPassCount } : {}),
        },
        wearables: {
          ...(haloCount ? { Halo: haloCount } : {}),
        },
        farmId,
        vipDays,
        message,
      },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

  const basicItems: Record<string, AirdropItem> = {
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
    VIP: {
      value: vipDays ?? 0,
      setValue: setVipDays,
      maxDecimalPlaces: 0,
      icon: vipIcon,
    },
  };

  const advancedItems: Record<string, AirdropItem> = {
    "Beta Pass": {
      value: betaPassCount,
      setValue: setBetaPassCount,
      maxDecimalPlaces: 0,
      icon: ITEM_DETAILS["Beta Pass"].image,
    },
    Halo: {
      value: haloCount,
      setValue: setHaloCount,
      maxDecimalPlaces: 0,
      icon: new URL(
        `/src/assets/wearables/${ITEM_IDS["Halo"]}.webp`,
        import.meta.url,
      ).href,
    },
  };
  const disabled =
    !farmId || (!coins && !gems && !loveCharm && !betaPassCount && !haloCount);

  if (showAdvancedItems) {
    return (
      <Wallet action="login">
        <AirdropContent
          basicItems={basicItems}
          advancedItems={advancedItems}
          showAdvancedItems={showAdvancedItems}
          message={message}
          setMessage={setMessage}
          onSend={send}
          disabled={disabled}
        />
      </Wallet>
    );
  }

  return (
    <AirdropContent
      basicItems={basicItems}
      advancedItems={advancedItems}
      showAdvancedItems={showAdvancedItems}
      message={message}
      setMessage={setMessage}
      onSend={send}
      disabled={disabled}
      setShowAdvancedItems={setShowAdvancedItems}
    />
  );
};
