import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import tornadoIcon from "assets/icons/tornado.webp";
import tsunamiIcon from "assets/icons/tsunami.webp";
import greatFreezeIcon from "assets/icons/great-freeze.webp";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { WeatherAffectedModal } from "features/island/plots/components/AffectedModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/** [TornadoPlot.tsx / TsunamiPlot.tsx / GreatFreezePlot.tsx] */
export const WeatherPlotModal: React.FC<{
  event: "tornado" | "tsunami" | "greatFreeze";
  onClose: () => void;
}> = ({ event, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const calendar = useSelector(
    gameService,
    (state: MachineState) => state.context.state.calendar,
  );

  const config = {
    tornado: {
      icon: tornadoIcon,
      title: t("tornado"),
      description: t("tornado.crops.destroyed.description"),
    },
    tsunami: {
      icon: tsunamiIcon,
      title: t("tsunami"),
      description: t("tsunami.crops.destroyed.description"),
    },
    greatFreeze: {
      icon: greatFreezeIcon,
      title: t("calendar.events.greatFreeze.title"),
      description: t("calendar.events.greatFreeze.description"),
    },
  }[event];

  return (
    <WeatherAffectedModal
      showModal
      setShowModal={(show) => !show && onClose()}
      icon={config.icon}
      title={config.title}
      description={config.description}
      startedAt={calendar[event]?.startedAt ?? 0}
    />
  );
};
