import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React from "react";
import TelegramLogin from "./TelegramLogin";

export const Telegram: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-1">
        <Label type="default" className="mb-2">
          Telegram
        </Label>

        <p className="text-sm">
          Connect your Telegram account to receive exclusive rewards and
          participate in special events.
        </p>
        <TelegramLogin
          onLogin={() => {
            console.log("LOGGED");
          }}
        />
      </div>
    </CloseButtonPanel>
  );
};
