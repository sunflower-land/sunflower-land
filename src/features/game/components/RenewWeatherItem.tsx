import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Context } from "../GameProvider";
import type { MachineState } from "../lib/gameMachine";
import type { PlaceableLocation } from "../types/collectibles";
import { ITEM_DETAILS, getTranslatedItemName } from "../types/images";
import {
  WEATHER_ITEM_RECIPES,
  type WeatherItemName,
} from "../types/weatherItems";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  useWeatherItemPick,
  WeatherItemChoice,
  WeatherItemRequirements,
} from "../expansion/components/temperateSeason/WeatherItemRecipe";
import { CloseButtonPanel } from "./CloseablePanel";

type Props = {
  show: boolean;
  onHide: () => void;
  name: WeatherItemName;
  id: string;
  location: PlaceableLocation;
};

const _game = (state: MachineState) => state.context.state;

/** Pay a used weather item's recipe again so it works on its next event. */
export const RenewWeatherItem: React.FC<Props> = ({
  show,
  onHide,
  ...item
}) => (
  <Modal show={show} onHide={onHide}>
    <CloseButtonPanel onClose={onHide} container={OuterPanel}>
      {show && <RenewWeatherItemContent {...item} onRenewed={onHide} />}
    </CloseButtonPanel>
  </Modal>
);

const RenewWeatherItemContent: React.FC<
  Omit<Props, "show" | "onHide"> & { onRenewed: () => void }
> = ({ name, id, location, onRenewed }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _game);
  const pick = useWeatherItemPick(game, name);
  const itemName = getTranslatedItemName(name);

  const renew = () => {
    gameService.send("weatherCollectible.renewed", {
      name,
      location,
      id,
      ingredient: pick.ingredient,
    });
    onRenewed();
  };

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex flex-col gap-1 p-1">
          <Label
            type="danger"
            className="text-xs"
            icon={ITEM_DETAILS[name].image}
          >
            {t("weatherCollectible.used", { name: itemName })}
          </Label>
          <p className="text-xs">
            {t("weatherItem.renew.message", { name: itemName })}
          </p>
        </div>
      </InnerPanel>
      {!!WEATHER_ITEM_RECIPES[name].choice && (
        <InnerPanel className="mb-1">
          <WeatherItemChoice game={game} item={name} pick={pick} />
        </InnerPanel>
      )}
      <InnerPanel className="mb-1">
        <Label type="default" className="text-xs mb-2 ml-1">
          {t("requirements")}
        </Label>
        <WeatherItemRequirements game={game} ingredients={pick.ingredients} />
      </InnerPanel>
      <Button disabled={!pick.canPay} onClick={renew}>
        {t("renew")}
      </Button>
    </>
  );
};
