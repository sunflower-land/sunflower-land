import { Button } from "components/ui/Button";
import React, { useState } from "react";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";

import deliveries from "assets/tutorials/plaza_screenshot1.png";
import crafting from "assets/tutorials/craft_rare.png";
import auctions from "assets/tutorials/auctions.png";
import trading from "assets/tutorials/trading.png";
import { translate } from "lib/i18n/translate";

interface Props {
  onClose: () => void;
}

const ProgressDots: React.FC<{ progress: number; total: number }> = ({
  progress,
  total,
}) => (
  <div className="flex">
    {new Array(progress).fill(null).map((_, index) => (
      <img key={index} src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
    ))}
    {new Array(total - progress).fill(null).map((_, index) => (
      <img key={index} src={SUNNYSIDE.ui.dot} className="h-4 mr-1" />
    ))}
  </div>
);
export const WorldIntroduction: React.FC<Props> = ({ onClose }) => {
  const [page, setPage] = useState(0);

  const Content = () => {
    if (page === 0) {
      return (
        <SpeakingText
          message={[
            {
              text: translate("world.intro.one"),
            },
            {
              text: translate("world.intro.two"),
            },
            {
              text: translate("world.intro.three"),
            },
          ]}
          onClose={() => setPage((p) => p + 1)}
        />
      );
    }

    // Complete a delivery
    if (page === 1) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={1} total={5} />
            <p className="text-sm my-2">
              {translate("world.intro.visit")}
            </p>
            <img src={deliveries} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>{translate("next")}</Button>
        </>
      );
    }

    // Craft Magical Items
    if (page === 2) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={2} total={5} />
            <p className="text-sm my-2">
              {translate("world.intro.craft")}
            </p>
            <p className="text-sm mb-2">
              {translate("world.intro.carf.limited")}
            </p>
            <img src={crafting} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>{translate("next")}</Button>
        </>
      );
    }

    // Trade With Players
    if (page === 3) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={3} total={5} />
            <p className="text-sm my-2">
              {translate("world.intro.trade")}
            </p>
            <img src={trading} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>{translate("next")}</Button>
        </>
      );
    }

    // Auction House
    if (page === 4) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={3} total={5} />
            <p className="text-sm my-2">
              {translate("world.intro.auction")}
            </p>
            <img src={auctions} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>{translate("next")}</Button>
        </>
      );
    }

    return (
      <>
        <ProgressDots progress={5} total={5} />
        <div className="p-2">
          <div className="flex mb-2">
            <div className="w-8">
              <img src={SUNNYSIDE.icons.player} className="h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                {translate("world.intro.four")}
              </p>
              <p className="text-xs italic">
                {translate("world.intro.five")}
              </p>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-8">
              <img src={SUNNYSIDE.ui.cursor} className="h-6" />
            </div>
            <p className="text-sm flex-1">
              {translate("world.intro.six")}
            </p>
          </div>
          <div className="flex mb-1">
            <div className="w-8">
              <img src={SUNNYSIDE.icons.heart} className="h-6" />
            </div>
            <p className="text-sm flex-1">
              {translate("world.intro.seven")}
            </p>
          </div>
        </div>
        <Button onClick={onClose}>{translate("lets.go")}</Button>
      </>
    );
  };
  return (
    <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
      <Content key={page} />
    </Panel>
  );
};
