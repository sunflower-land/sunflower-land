import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import React, { useContext } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";

interface Props {
  onClose: () => void;
}

const _springBlossom = (week: number) => (state: MachineState) =>
  state.context.state.springBlossom[week];

export const PageFound: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const seasonWeek = getSeasonWeek();

  const springBlossom = useSelector(gameService, _springBlossom(seasonWeek));
  const { t } = useAppTranslation();

  // This shouldn't happen
  if (!springBlossom) {
    return (
      <CloseButtonPanel onClose={onClose} title={t("pageFounds.title")}>
        <div className="flex flex-col p-2 items-center w-full">
          <span>{t("pageFounds.gardeningBookPage")}</span>
          <img
            className="my-4"
            src="world/page.png"
            style={{ width: PIXEL_SCALE * 16 }}
          />
        </div>
      </CloseButtonPanel>
    );
  }

  if (springBlossom.collectedFlowerPages.length >= 3) {
    return (
      <CloseButtonPanel onClose={onClose} title={t("pageFounds.title")}>
        <div className="flex flex-col w-full p-2 items-center justify-center gap-3">
          <span className="text-sm w-full">
            {t("pageFounds.lastPageFound")}
          </span>

          <div className="flex w-full">
            <div
              className="flex items-center"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            >
              <SquareIcon
                icon={ITEM_DETAILS[springBlossom.weeklyFlower].image}
                className="mr-2"
                width={9}
              />
            </div>
            <span className="text-sm">
              {t("pageFounds.knowHowToGrow")} {springBlossom.weeklyFlower}
              {"!"}
            </span>
          </div>

          <div className="flex w-full">
            <div
              className="flex justify-center"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            >
              <SquareIcon
                icon={SUNNYSIDE.icons.search}
                width={9}
                className="mr-2"
              />
            </div>
            <span className="text-sm">{t("pageFounds.checkCodex")}</span>
          </div>

          <img
            className="my-4"
            src="world/page.png"
            style={{ width: PIXEL_SCALE * 16 }}
          />

          <Label type="success">{t("pageFounds.all")}</Label>
        </div>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} title={t("pageFounds.title")}>
      <div className="flex flex-col w-full p-2 items-center">
        <span className="text-sm">
          {t("pageFounds.pageContainsInfo")} {springBlossom.weeklyFlower}
          {"!"}
        </span>

        <img
          className="my-4"
          src="world/page.png"
          style={{ width: PIXEL_SCALE * 16 }}
        />

        <Label type="info">
          {t("pageFounds")} {2}
          {" / 3"}
        </Label>
      </div>
    </CloseButtonPanel>
  );
};
