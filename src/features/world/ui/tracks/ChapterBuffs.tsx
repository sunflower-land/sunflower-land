import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";
import {
  CHAPTER_BUFF_COST,
  ChapterBuffCurrency,
} from "features/game/events/landExpansion/buyChapterBuff";
import { getKeys } from "features/game/types/decorations";
import React, { useState } from "react";
import surgeIcon from "assets/icons/surge.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getChapterArtefact,
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { Button } from "components/ui/Button";
import { useGame } from "features/game/GameProvider";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";

export const ChapterBuffs: React.FC = () => {
  const now = useNow();
  const currencies = getKeys(CHAPTER_BUFF_COST);
  const chapter = getCurrentChapter(now);
  const { gameState } = useGame();

  const game = gameState.context.state;
  const buffs = game.megastore?.buffs?.[chapter];
  const count = buffs?.count ?? 0;

  const [selected, setSelected] = useState<ChapterBuffCurrency | null>(null);
  return (
    <>
      <InnerPanel className="my-1 p-1">
        <Label type="vibrant" className="mb-2">
          Surges
        </Label>

        <div className="flex flex-wrap gap-2 px-2 mb-2">
          {currencies.map((currency) => {
            let image = flowerIcon;

            if (currency === "artefact") {
              image = ITEM_DETAILS[getChapterArtefact(now)].image;
            }

            if (currency === "ticket") {
              image = ITEM_DETAILS[getChapterTicket(now)].image;
            }

            return (
              <div key={currency} className="flex flex-col space-y-1">
                <div
                  className="bg-brown-600 cursor-pointer relative"
                  style={{
                    ...pixelDarkBorderStyle,
                  }}
                  onClick={() => {
                    setSelected(currency);
                  }}
                >
                  <div className="flex justify-center items-center w-full h-full z-20">
                    <SquareIcon icon={surgeIcon} width={20} />

                    <img
                      src={SUNNYSIDE.icons.confirm}
                      className="absolute -right-2 -top-3"
                      style={{
                        width: `${PIXEL_SCALE * 9}px`,
                      }}
                      alt="crop"
                    />

                    {/* Price */}
                    <div className="absolute px-4 bottom-3 -left-4 object-contain">
                      <Label
                        icon={image}
                        type="warning"
                        className={"text-xxs absolute center text-center p-1 "}
                        style={{
                          width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                          height: "24px",
                        }}
                      >
                        {CHAPTER_BUFF_COST[currency]}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <Box image={surgeIcon} count={new Decimal(count)} />
          <Button
            disabled={count <= 0}
            className="w-auto h-10"
            onClick={() => setSelected(null)}
          >
            Activate
          </Button>
        </div>
      </InnerPanel>

      <ModalOverlay show={!!selected} onBackdropClick={() => setSelected(null)}>
        <Panel>Are you sure?</Panel>
      </ModalOverlay>
    </>
  );
};
