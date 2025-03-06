import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Dropdown } from "components/ui/Dropdown";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { TextInput } from "components/ui/TextInput";
import React, { useContext, useState } from "react";
import { CONFIG } from "lib/config";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { useGame } from "features/game/GameProvider";

interface Props {
  id: number;
}
const REASONS = ["Botting", "Multiaccounting", "Bug Abuse", "Other"];

export const ReportPlayer: React.FC<Props> = ({ id }) => {
  const [reportedFarmId, setReportedFarmId] = useState(id);
  const [reason, setReason] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logMessage, setLogMessage] = useState<string>("");

  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(
    authService,
    (state) => state.context.user.rawToken as string,
  );
  const { gameService } = useGame();
  const state = useSelector(gameService, (state) => state.context.state);
  const farmId = useSelector(gameService, (state) => state.context.farmId);

  const handleSubmit = async () => {
    if (!reportedFarmId || !reason || !message) {
      setLogMessage("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${CONFIG.API_URL}/report/player`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rawToken}`,
        },
        body: JSON.stringify({
          reportedFarmId,
          reason,
          message,
          reporterFarmId: farmId,
          reporterUsername: state.username,
          reporterGameState: state,
        }),
      });

      if (!response.ok) {
        setLogMessage("Failed to send report");
      }

      // Clear form after successful submission
      setReason(undefined);
      setMessage("");
    } catch (error) {
      setLogMessage("Failed to submit report. Please try again later.");
    } finally {
      setLogMessage("Report submitted successfully!");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-1 flex flex-col overflow-y-auto scrollable">
        <div className="flex flex-col">
          <Label type="default" icon={SUNNYSIDE.icons.search} className="my-1">
            {`Farm ID`}
          </Label>
          <NumberInput
            value={reportedFarmId}
            onValueChange={(decimal) => setReportedFarmId(decimal.toNumber())}
            maxDecimalPlaces={0}
          />
        </div>
        <div className="flex flex-col">
          <Label type="default" icon={SUNNYSIDE.icons.search} className="my-1">
            {`Reason`}
          </Label>
          <Dropdown
            options={REASONS}
            value={reason}
            onChange={(value) => setReason(value)}
          />
        </div>
        <div className="flex flex-col">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.expression_chat}
            className="my-1"
          >
            {`Message`}
          </Label>
          <TextInput
            value={message}
            onValueChange={setMessage}
            placeholder="Describe the issue..."
          />
        </div>
      </div>
      {logMessage && (
        <Label type="default" className="my-1">
          {logMessage}
        </Label>
      )}
      <Button
        className="my-1"
        disabled={!reportedFarmId || !reason || !message || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? "Sending..." : "Send"}
      </Button>
    </>
  );
};
