import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";
import { useFeed } from "../FeedContext";

type Props = {
  showFeed: boolean;
  setShowFeed: (showFeed: boolean) => void;
};

export const WorldFeedButton: React.FC<Props> = ({ showFeed, setShowFeed }) => {
  const { unreadCount } = useFeed();

  return (
    <RoundButton
      onClick={(e) => {
        e.stopPropagation();
        setShowFeed(!showFeed);
      }}
    >
      <img
        src={SUNNYSIDE.icons.expression_chat}
        style={{ width: `${PIXEL_SCALE * 9}px` }}
        className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2"
      />
      {unreadCount > 0 && (
        <div className="absolute -top-[3px] -right-[3px]">
          <Label type="info" className="px-0.5 text-xxs">
            {unreadCount}
          </Label>
        </div>
      )}
    </RoundButton>
  );
};
