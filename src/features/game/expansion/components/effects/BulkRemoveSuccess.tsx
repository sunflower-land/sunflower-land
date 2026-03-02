import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { MachineState } from "features/game/lib/gameMachine";
import { StateMachineStateName } from "features/game/actions/effect";
import { useSelector } from "@xstate/react";

const _cancellingData =
  (effect: StateMachineStateName) => (state: MachineState) =>
    state.context.data[effect] ?? { attempted: [], failed: [] };

export const BulkRemoveSuccess: React.FC<{
  type: "listings" | "offers";
  effect: StateMachineStateName;
}> = ({ type, effect }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const { attempted, failed } = useSelector(
    gameService,
    _cancellingData(effect),
  );

  const getContent = () => {
    if (failed.length === 0) {
      return (
        <>
          <Label type="success" className="mb-2">
            {t("success")}
          </Label>
          <p className="text-sm mb-2">
            {t("marketplace.bulkCancel.success", { type })}
          </p>
        </>
      );
    }

    if (attempted.length === failed.length) {
      return (
        <>
          <Label type="warning" className="mb-2">
            {t("there.was.a.problem")}
          </Label>
          <p className="text-sm mb-2">
            {t("marketplace.bulkCancel.allFailed", { type })}
          </p>
        </>
      );
    }

    return (
      <>
        <Label type="warning" className="mb-2">
          {t("partial.success")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.bulkCancel.someSuccess", { type })}
        </p>
      </>
    );
  };

  return (
    <>
      <div className="p-1.5">{getContent()}</div>
      <Button
        onClick={() => {
          gameService.send({ type: "CONTINUE" });
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
