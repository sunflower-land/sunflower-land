import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Button } from "components/ui/Button";
import { ContentComponentProps } from "../GameOptions";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import coinsIcon from "assets/icons/coins.webp";
import vipIcon from "assets/icons/vip.webp";
import add from "assets/icons/plus.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { TextInput } from "components/ui/TextInput";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { BumpkinItem } from "features/game/types/bumpkin";
import { GameWallet } from "features/wallet/Wallet";
import { useSelector } from "@xstate/react";
import { Dropdown } from "components/ui/Dropdown";
import { InventoryItemName, Wardrobe } from "features/game/types/game";
import { ITEM_TRADE_TYPES } from "features/marketplace/lib/getTradeType";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ADMIN_IDS } from "lib/flags";
import { CONFIG } from "lib/config";
import { getKeys } from "features/game/types/decorations";
import { signTypedData } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { WalletContext } from "features/wallet/WalletProvider";

// Types
interface AirdropItem {
  value: number;
  setValue: (value: number) => void;
  icon: string;
  maxDecimalPlaces: number;
}

interface SelectedItem {
  name: InventoryItemName;
  quantity: number;
}

interface AdvancedItemsProps {
  selectedItems: SelectedItem[];
  setSelectedItems: (items: SelectedItem[]) => void;
  selectedWearables: BumpkinItem[];
  setSelectedWearables: (wearables: BumpkinItem[]) => void;
}

interface AirdropContentProps {
  basicItems: Record<string, AirdropItem>;
  message: string;
  setMessage: (message: string) => void;
  onSend: () => Promise<void>;
  disabled: boolean;
  setShowAdvancedItems: (show: boolean) => void;
  hasDevAccess?: boolean;
  showAdvancedItems?: boolean;
  advancedItemsProps?: AdvancedItemsProps;
}

// Components
const AdvancedItems: React.FC<AdvancedItemsProps> = ({
  selectedItems,
  setSelectedItems,
  selectedWearables,
  setSelectedWearables,
}) => {
  const [currentItem, setCurrentItem] = useState<string>();
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentWearable, setCurrentWearable] = useState<string>();

  const addItem = () => {
    if (!currentItem || currentQuantity <= 0) return;

    setSelectedItems([
      ...selectedItems.filter((item) => item.name !== currentItem),
      { name: currentItem as InventoryItemName, quantity: currentQuantity },
    ]);
    setCurrentItem(undefined);
    setCurrentQuantity(0);
  };

  const removeItem = (itemName: InventoryItemName) => {
    setSelectedItems(selectedItems.filter((item) => item.name !== itemName));
  };

  const addWearable = () => {
    if (!currentWearable) return;

    if (!selectedWearables.includes(currentWearable as BumpkinItem)) {
      setSelectedWearables([
        ...selectedWearables,
        currentWearable as BumpkinItem,
      ]);
    }
    setCurrentWearable(undefined);
  };

  const removeWearable = (wearable: BumpkinItem) => {
    setSelectedWearables(selectedWearables.filter((w) => w !== wearable));
  };

  return (
    <div className="flex flex-col gap-2">
      <Label type="default" icon={ITEM_DETAILS["Sunflower"].image}>
        {"Collectibles and Resources"}
      </Label>

      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Dropdown
              options={getKeys(ITEM_TRADE_TYPES.collectibles)
                .filter(
                  (item) =>
                    ITEM_TRADE_TYPES.collectibles[item] === "instant" &&
                    !["Love Charm", "Gem"].includes(item),
                )
                .sort((a, b) => a.localeCompare(b))}
              value={currentItem}
              onChange={(option) => setCurrentItem(option)}
              maxHeight={2}
              showSearch
            />
          </div>
          <div className="w-24">
            <NumberInput
              value={currentQuantity}
              onValueChange={(decimal) =>
                setCurrentQuantity(decimal.toNumber())
              }
              maxDecimalPlaces={0}
            />
          </div>
          <img
            src={add}
            alt="add"
            className="cursor-pointer h-10 p-2"
            onClick={addItem}
            style={{
              background: "url(/src/assets/ui/brown_panel.png)",
              backgroundSize: `${PIXEL_SCALE * 11}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>

        {selectedItems.map((item) => (
          <div key={item.name} className="flex items-center gap-2 px-2">
            <span className="flex-1">{item.name}</span>
            <span>{`x${item.quantity}`}</span>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer px-2 h-5"
              onClick={() => removeItem(item.name)}
            />
          </div>
        ))}
      </div>

      <Label type="default" icon={getWearableImage("Red Farmer Shirt")}>
        {"Wearables"}
      </Label>

      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Dropdown
              options={Object.keys(ITEM_TRADE_TYPES.wearables)
                .filter(
                  (item) =>
                    ITEM_TRADE_TYPES.wearables[item as BumpkinItem] ===
                    "instant",
                )
                .sort((a, b) => a.localeCompare(b))}
              value={currentWearable}
              onChange={(option) => setCurrentWearable(option)}
              maxHeight={2}
              showSearch
            />
          </div>
          <img
            src={add}
            alt="add"
            className="cursor-pointer h-10 p-2"
            onClick={addWearable}
            style={{
              background: "url(/src/assets/ui/brown_panel.png)",
              backgroundSize: `${PIXEL_SCALE * 11}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>

        {selectedWearables.map((wearable) => (
          <div key={wearable} className="flex items-center gap-2 px-2">
            <span className="flex-1">{wearable}</span>
            <span>{`x1`}</span>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer px-2 h-5"
              onClick={() => removeWearable(wearable as BumpkinItem)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AirdropContent: React.FC<AirdropContentProps> = ({
  basicItems,
  message,
  setMessage,
  onSend,
  disabled,
  setShowAdvancedItems,
  hasDevAccess,
  showAdvancedItems,
  advancedItemsProps,
}) => (
  <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto scrollable">
    <div className="p-1 flex flex-col gap-1">
      <div className="flex flex-col gap-1">
        {getObjectEntries(basicItems).map(
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
        {hasDevAccess && showAdvancedItems && advancedItemsProps && (
          <AdvancedItems {...advancedItemsProps} />
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
        onValueChange={setMessage}
      />
      {!showAdvancedItems && hasDevAccess && (
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
  const { walletService } = useContext(WalletContext);

  const hasDevAccess = useSelector(
    gameService,
    (state) =>
      ADMIN_IDS.includes(state.context.farmId) || CONFIG.NETWORK === "amoy",
  );
  const chainId = useSelector(walletService, (state) => state.context.chainId);

  // Basic state
  const [farmId, setFarmId] = useState(id);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState<number>();
  const [loveCharm, setLoveCharm] = useState<number>();
  const [message, setMessage] = useState("");
  const [showAdvancedItems, setShowAdvancedItems] = useState(false);
  const [vipDays, setVipDays] = useState<number>();

  // Advanced items state
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedWearables, setSelectedWearables] = useState<BumpkinItem[]>([]);
  const canSendAdvancedItems = showAdvancedItems && hasDevAccess;

  const items = {
    ...(gems ? { Gem: gems } : {}),
    ...(loveCharm ? { "Love Charm": loveCharm } : {}),
    ...selectedItems.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: item.quantity,
      }),
      {} as Partial<Record<InventoryItemName, number>>,
    ),
  };

  const wearables = selectedWearables.reduce(
    (acc, wearable) => ({
      ...acc,
      [wearable]: 1,
    }),
    {} as Wardrobe,
  );

  const send = async (signature?: string) => {
    gameService.send("reward.airdropped", {
      effect: {
        type: "reward.airdropped",
        coins,
        items,
        wearables,
        farmId,
        vipDays,
        message,
        // TODO: Add signature
        signature,
      },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

  const signMessage = async () => {
    const signature = await signTypedData(config, {
      domain: {
        name: "Sunflower Land",
        version: "1",
        chainId,
      },
      types: {
        Airdrop: [
          { name: "items", type: "string" },
          { name: "wearables", type: "string" },
          { name: "farmId", type: "uint256" },
          { name: "coins", type: "uint256" },
          { name: "vipDays", type: "uint256" },
          { name: "message", type: "string" },
        ],
      },
      primaryType: "Airdrop",
      message: {
        items: JSON.stringify(items),
        wearables: JSON.stringify(wearables),
        farmId: BigInt(farmId),
        coins: BigInt(coins),
        vipDays: BigInt(vipDays ?? 0),
        message,
      },
    });
    await send(signature);
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

  const disabled =
    !farmId ||
    !message.length ||
    !(
      coins ||
      gems ||
      loveCharm ||
      selectedItems.length ||
      selectedWearables.length ||
      vipDays
    );

  const advancedItemsProps: AdvancedItemsProps = {
    selectedItems,
    setSelectedItems,
    selectedWearables,
    setSelectedWearables,
  };

  if (canSendAdvancedItems) {
    return (
      <GameWallet action="login">
        <AirdropContent
          basicItems={basicItems}
          message={message}
          setMessage={setMessage}
          onSend={signMessage}
          disabled={disabled}
          setShowAdvancedItems={setShowAdvancedItems}
          hasDevAccess={hasDevAccess}
          showAdvancedItems={showAdvancedItems}
          advancedItemsProps={advancedItemsProps}
        />
      </GameWallet>
    );
  }

  return (
    <AirdropContent
      basicItems={basicItems}
      message={message}
      setMessage={setMessage}
      onSend={() => send()}
      disabled={disabled}
      setShowAdvancedItems={setShowAdvancedItems}
      hasDevAccess={hasDevAccess}
      showAdvancedItems={showAdvancedItems}
      advancedItemsProps={advancedItemsProps}
    />
  );
};
