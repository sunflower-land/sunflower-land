import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  icon: string;
  title: string;
  description: string;
  startedAt: number;
}

export const WeatherAffectedModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  icon,
  title,
  description,
  startedAt,
}) => (
  <Modal show={showModal} onHide={() => setShowModal(false)}>
    <CloseButtonPanel onClose={() => setShowModal(false)}>
      <div className="p-2 pt-1">
        <Label icon={icon} type="danger" className="mb-1 -ml-1">
          {title}
        </Label>
        <p className="text-sm mb-3">{description}</p>
        <TimeLabel startedAt={startedAt} />
        <p className="text-xs"></p>
      </div>
    </CloseButtonPanel>
  </Modal>
);

interface TimeLabelProps {
  startedAt: number;
}

export const TimeLabel: React.FC<TimeLabelProps> = ({ startedAt }) => {
  const { t } = useAppTranslation();
  const { totalSeconds: secondsToReady } = useCountdown(
    startedAt + 24 * 60 * 60 * 1000,
  );
  return (
    <Label
      icon={SUNNYSIDE.icons.stopwatch}
      type="transparent"
      className="mt-2 ml-2"
    >
      {`${t("ready.in")}: ${secondsToString(secondsToReady, {
        length: "medium",
      })}`}
    </Label>
  );
};
