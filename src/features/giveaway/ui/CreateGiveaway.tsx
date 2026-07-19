import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import type Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import type { PrizeTier } from "../lib/types";
import {
  GIVEAWAY_MINIGAMES,
  DEFAULT_MINIGAME,
  minigameName,
  type MinigameType,
} from "../lib/minigames";

const MINUTE = 60 * 1000;

export const CreateGiveaway: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const token = authService.getSnapshot().context.user.rawToken as string;

  const [minigame, setMinigame] = useState<MinigameType>(DEFAULT_MINIGAME);
  const [title, setTitle] = useState("Weekly Stream Race");
  const [lobbyMinutes, setLobbyMinutes] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [first, setFirst] = useState(1000);
  const [second, setSecond] = useState(250);
  const [third, setThird] = useState(100);

  const { isCreating, isSuccess, isFailed, createdId } = useSelector(
    gameService,
    (state) => ({
      isCreating: state.matches("creatingGiveaway"),
      isSuccess: state.matches("creatingGiveawaySuccess"),
      isFailed: state.matches("creatingGiveawayFailed"),
      createdId: state.context.data?.["creatingGiveaway"]?.id as
        | string
        | undefined,
    }),
  );

  const create = () => {
    const startAt = Date.now() + lobbyMinutes * MINUTE;
    const endAt = startAt + durationMinutes * MINUTE;
    const prizes: PrizeTier[] = [
      { from: 1, to: 1, coins: first },
      { from: 2, to: 3, coins: second },
      { from: 4, to: 10, coins: third },
    ];

    gameService.send("giveaway.created", {
      effect: { type: "giveaway.created", title, prizes, startAt, endAt },
      authToken: token,
    });
  };

  if (isCreating) return <Loading text={t("giveaway.creating")} />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-2 p-1">
        <Label type="success">{t("giveaway.created")}</Label>
        <p className="text-xs break-all">{createdId}</p>
        <Button
          onClick={() => {
            gameService.send("CONTINUE");
            if (createdId)
              navigate(`/giveaway/play/${createdId}?type=${minigame}`);
          }}
        >
          {t("giveaway.enter")}
        </Button>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex flex-col gap-2 p-1">
        <Label type="danger">{t("giveaway.createFailed")}</Label>
        <Button onClick={() => gameService.send("CONTINUE")}>
          {t("back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1">
      <Label type="default">{t("giveaway.setup")}</Label>

      <span className="text-xxs">{t("giveaway.minigame")}</span>
      <Dropdown
        options={GIVEAWAY_MINIGAMES.map((m) => m.type)}
        value={minigame}
        getOptionLabel={(v) => minigameName(v as MinigameType)}
        onChange={(v) => setMinigame(v as MinigameType)}
      />

      <TextInput
        value={title}
        onValueChange={setTitle}
        placeholder={t("giveaway.title")}
        maxLength={100}
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <span className="text-xxs">{t("giveaway.lobbyMinutes")}</span>
          <NumberInput
            value={lobbyMinutes}
            maxDecimalPlaces={0}
            onValueChange={(v: Decimal) => setLobbyMinutes(v.toNumber())}
          />
        </div>
        <div className="flex-1">
          <span className="text-xxs">{t("giveaway.durationMinutes")}</span>
          <NumberInput
            value={durationMinutes}
            maxDecimalPlaces={0}
            onValueChange={(v: Decimal) => setDurationMinutes(v.toNumber())}
          />
        </div>
      </div>

      <InnerPanel className="flex flex-col gap-1 p-2">
        <Label type="warning">{t("giveaway.prizeCoins")}</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <span className="text-xxs">{t("giveaway.first")}</span>
            <NumberInput
              value={first}
              maxDecimalPlaces={0}
              onValueChange={(v: Decimal) => setFirst(v.toNumber())}
            />
          </div>
          <div className="flex-1">
            <span className="text-xxs">{t("giveaway.secondThird")}</span>
            <NumberInput
              value={second}
              maxDecimalPlaces={0}
              onValueChange={(v: Decimal) => setSecond(v.toNumber())}
            />
          </div>
          <div className="flex-1">
            <span className="text-xxs">{t("giveaway.fourthTenth")}</span>
            <NumberInput
              value={third}
              maxDecimalPlaces={0}
              onValueChange={(v: Decimal) => setThird(v.toNumber())}
            />
          </div>
        </div>
      </InnerPanel>

      <div className="flex gap-2">
        <Button onClick={onBack}>{t("back")}</Button>
        <Button onClick={create} disabled={!title.trim()}>
          {t("giveaway.create")}
        </Button>
      </div>
    </div>
  );
};
