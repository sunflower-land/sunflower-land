import "./Account.css";

import React from "react";
import { OverlayTrigger } from "react-bootstrap";

import { CollapsiblePanel } from "./CollapsiblePanel";
import { Message } from "./Message";
import { PlayerAvatar } from "./PlayerAvatar";

export const shortAddress = (address: string): string => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

interface Props {
  address: string;
}

export const Account: React.FC<Props> = ({ address }) => {
  const [tooltipMessage, setTooltipMessage] =
    React.useState("Click to copy");

  const playerAvatar = <PlayerAvatar address={address} />;

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(address);
    setTooltipMessage("Copied!");
  };

  return (
    <CollapsiblePanel closedContent={playerAvatar}>
      {playerAvatar}
      <OverlayTrigger
        overlay={(props) => (
          <div {...props}>
            <Message>{tooltipMessage}</Message>
          </div>
        )}
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        onToggle={(nextShow) =>
          nextShow && setTooltipMessage("Click to copy")
        }
      >
        <span onClick={copyToClipboard} className="account-address">
          {shortAddress(address)}
        </span>
      </OverlayTrigger>
    </CollapsiblePanel>
  );
};
