import React, { useEffect, useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getStream } from "features/game/components/modal/components/Streams";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ButtonPanel } from "components/ui/Panel";
import promoteIcon from "assets/icons/promote.webp";
import { useNavigate } from "react-router";
const Countdown: React.FC<{
  startAt: number;
  endAt: number;
  onHide: () => void;
}> = ({ startAt, endAt, onHide }) => {
  const start = useCountdown(startAt);
  const end = useCountdown(endAt);
  const { t } = useAppTranslation();

  if (endAt < Date.now()) {
    return null;
  }

  if (Date.now() < startAt && Date.now() > startAt - 1000 * 60 * 10) {
    return (
      <div>
        <div className="h-6 flex justify-center">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="ml-1">
            {t("stream.beginsSoon")}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer ml-2"
            onClick={onHide}
          />
        </div>
        <TimerDisplay time={start} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        <Label type="default" className="ml-1" icon={promoteIcon}>
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
        <img
          src={SUNNYSIDE.icons.close}
          className="h-5 cursor-pointer ml-2"
          onClick={onHide}
        />
      </div>
      <TimerDisplay time={end} />
    </div>
  );
};

export const StreamCountdown: React.FC = () => {
  const [hide, setHide] = useState(false);
  const [stream, setStream] = useState<{
    startAt: number;
    endAt: number;
  } | null>(getStream());

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setStream(getStream());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  if (!stream || hide) return null;

  return (
    <ButtonPanel
      className="flex justify-center"
      id="test-stream"
      disabled={stream.startAt > Date.now()}
      onClick={() => navigate("/world/stream")}
    >
      <Countdown
        startAt={stream.startAt}
        endAt={stream.endAt}
        onHide={() => setHide(true)}
      />
    </ButtonPanel>
  );
};
