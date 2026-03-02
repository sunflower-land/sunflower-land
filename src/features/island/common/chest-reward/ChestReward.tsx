import { Panel } from "components/ui/Panel";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import { InventoryItemName, Reward } from "features/game/types/game";

import { Context } from "features/game/GameProvider";

import { StopTheGoblins } from "features/island/common/chest-reward/StopTheGoblins";
import { ChestCaptcha } from "features/island/common/chest-reward/ChestCaptcha";
import { Loading } from "features/auth/components";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import Decimal from "decimal.js-light";
import { translate } from "lib/i18n/translate";
import classNames from "classnames";
import { CaptchaInfo } from "./CaptchaInfo";
import { useMathRandom } from "lib/utils/hooks/useMathRandom";

interface Props {
  collectedItem?: InventoryItemName;
  reward?: Reward;
  onCollected: (success: boolean) => void;
  onOpen: () => void;
  inline?: boolean;
}

type Challenge = "goblins" | "chest";

export const ChestReward: React.FC<Props> = ({
  collectedItem,
  reward,
  onCollected,
  onOpen,
  inline = false,
}) => {
  const { gameService } = useContext(Context);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(reward ? true : false);
  const random = useMathRandom();
  const [challenge] = useState<Challenge>(random > 0.3 ? "chest" : "goblins");

  useEffect(() => {
    if (reward) {
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [reward]);

  if (!reward) return null;

  const open = () => {
    setOpened(true);
  };

  const fail = () => {
    close(false);
    gameService.send({ type: "bot.detected" });
    gameService.send({ type: "REFRESH" });
  };

  const close = (success: boolean) => {
    onCollected(success);
    setOpened(false);
  };

  const claimAndClose = () => {
    onOpen();
    close(true);
  };

  const { items, sfl, coins } = reward;

  const content = (
    <Panel>
      {loading && <Loading />}
      {opened ? (
        <ClaimReward
          reward={{
            id: "chest-reward",
            items:
              items?.reduce(
                (acc, { name, amount }) => {
                  return { ...acc, [name]: amount };
                },
                {} as Record<InventoryItemName, number>,
              ) ?? {},
            wearables: {},
            sfl: sfl ? new Decimal(sfl).toNumber() : 0,
            coins: coins ?? 0,
            message: translate("reward.woohoo"),
          }}
          onClose={claimAndClose}
        />
      ) : (
        <>
          <div
            // render and hide captchas so images have time to load
            className={classNames(
              "flex flex-col items-center justify-between",
              { hidden: loading },
            )}
          >
            {challenge === "goblins" && (
              <StopTheGoblins
                onFail={fail}
                onOpen={open}
                collectedItem={collectedItem}
              />
            )}
            {challenge === "chest" && (
              <ChestCaptcha onFail={fail} onOpen={open} />
            )}
          </div>

          <CaptchaInfo collectedItem={collectedItem} />
        </>
      )}
    </Panel>
  );

  if (inline) return content;

  return (
    <Modal show={true} onHide={opened ? () => claimAndClose() : undefined}>
      {content}
    </Modal>
  );
};
