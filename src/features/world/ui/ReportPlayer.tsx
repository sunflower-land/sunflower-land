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

interface Props {
  id: number;
}
const REASONS = ["Botting", "Multiaccounting", "Bug Abuse", "Other"];

interface PlayerReportBody {
  reportedFarmId: number;
  reason: string;
  message?: string;
}

export const ReportPlayer: React.FC<Props> = ({ id }) => {
  const [reportedFarmId, setReportedFarmId] = useState(id);
  const [reason, setReason] = useState<string>();
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logMessage, setLogMessage] = useState<string>("");

  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(
    authService,
    (state) => state.context.user.rawToken as string,
  );

  const handleSubmit = async () => {
    if (!reportedFarmId || !reason || (reason === "Other" && !message)) {
      setLogMessage("Please fill in all fields");
      return;
    }

    const body: PlayerReportBody = {
      reportedFarmId,
      reason,
      message,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${CONFIG.API_URL}/report/player`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rawToken}`,
        },
        body: JSON.stringify(body),
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
    <div className="flex flex-col gap-2 overflow-y-auto scrollable">
      <div className="flex flex-col">
        <Label type="default" icon={SUNNYSIDE.icons.search} className="mx-2">
          {`Farm ID`}
        </Label>
        <NumberInput
          value={reportedFarmId}
          onValueChange={(decimal) => setReportedFarmId(decimal.toNumber())}
          maxDecimalPlaces={0}
          readOnly
        />
      </div>
      <div className="flex flex-col">
        <Label type="default" icon={SUNNYSIDE.icons.search} className="mx-2">
          {`Reason`}
        </Label>
        <Dropdown
          options={REASONS}
          value={reason}
          onChange={(value) => setReason(value)}
          maxHeight={16}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between mb-1">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.expression_chat}
            className="mx-2"
          >
            {`Message`}
          </Label>
          {message.length > 450 && (
            <Label
              type={message.length >= 500 ? "danger" : "warning"}
              className="mx-2"
            >
              {`${500 - message.length} characters remaining`}
            </Label>
          )}
        </div>
        <TextInput
          value={message}
          onValueChange={(value) => {
            setMessage(value);
          }}
          placeholder="Describe the issue..."
          maxLength={500}
        />
      </div>
      <div className="flex flex-col">
        {logMessage && <Label type="default">{logMessage}</Label>}
        <Button
          className="mt-1"
          disabled={
            !reportedFarmId ||
            !reason ||
            (reason === "Other" && !message) ||
            message.length > 500 ||
            isSubmitting
          }
          onClick={handleSubmit}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};
