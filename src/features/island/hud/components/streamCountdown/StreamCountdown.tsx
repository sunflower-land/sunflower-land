import React, { useEffect, useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getStream,
  StreamNotification,
} from "features/game/components/modal/components/Streams";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ButtonPanel } from "components/ui/Panel";
import promoteIcon from "assets/icons/promote.webp";
import { useNavigate } from "react-router";
import {
  acknowledgeStreamCountdown,
  getStreamCountdownLastRead,
} from "./acknowledgeStreamCountdown";
import { useNow } from "lib/utils/hooks/useNow";

const Countdown: React.FC<{
  startAt: number;
  endAt: number;
  notifyAt: number;
  onClick: () => void;
  onHide: () => void;
}> = ({ startAt, endAt, notifyAt, onClick, onHide }) => {
  const start = useCountdown(startAt);
  const end = useCountdown(endAt);
  const { t } = useAppTranslation();
  const now = useNow({ live: true });

  if (now < startAt && now > notifyAt) {
    return (
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="h-6 flex justify-center">
            <Label
              type="info"
              icon={SUNNYSIDE.icons.stopwatch}
              className="ml-1"
            >
              {t("stream.beginsSoon")}
            </Label>
          </div>
          <TimerDisplay time={start} />
        </div>
        <img
          src={SUNNYSIDE.icons.close}
          className="h-5 cursor-pointer ml-2"
          onClick={onHide}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <div className="flex flex-col" onClick={onClick}>
        <Label type="success" className="ml-1" icon={promoteIcon}>
          <div
            className="sm:max-w-[350px] max-w-[150px]"
            style={{
              // maxWidth: "155px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t("stream.isLive")}
          </div>
        </Label>
        <TimerDisplay time={end} />
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="h-5 cursor-pointer ml-2"
        onClick={onHide}
      />
    </div>
  );
};

const ONE_MINUTE = 1000 * 60;

export const StreamCountdown: React.FC = () => {
  const [hide, setHide] = useState(false);
  const [stream, setStream] = useState<StreamNotification | null>(getStream());

  const navigate = useNavigate();
  const now = useNow({ live: true, intervalMs: ONE_MINUTE });

  useEffect(() => {
    const interval = setInterval(() => {
      setStream(getStream());
    }, ONE_MINUTE);

    return () => clearInterval(interval);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const hasAcknowledged = getStreamCountdownLastRead() === today;

  if (
    !stream ||
    hide ||
    now < stream.notifyAt ||
    now > stream.endAt ||
    hasAcknowledged
  ) {
    return null;
  }

  const handleHide = () => {
    acknowledgeStreamCountdown(new Date().toISOString().split("T")[0]);
    setHide(true);
  };

  return (
    <ButtonPanel
      className="flex justify-center"
      id="test-stream"
      disabled={stream.startAt > now}
    >
      <Countdown
        startAt={stream.startAt}
        endAt={stream.endAt}
        notifyAt={stream.notifyAt}
        onClick={() => navigate("/world/stream")}
        onHide={handleHide}
      />
    </ButtonPanel>
  );
};
