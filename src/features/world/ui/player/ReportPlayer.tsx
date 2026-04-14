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
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const { t } = useAppTranslation();
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
      setLogMessage(t("report.fillInAllFields"));
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
        setLogMessage(t("report.error"));
      }

      // Clear form after successful submission
      setReason(undefined);
      setMessage("");
    } catch (error) {
      setLogMessage(t("report.error"));
    } finally {
      setLogMessage(t("report.success"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto scrollable">
      <div className="flex flex-col gap-2 pt-1">
        <Label type="default" icon={SUNNYSIDE.icons.search} className="mx-2">
          {`${t("farm")} ID`}
        </Label>
        <NumberInput
          value={reportedFarmId}
          onValueChange={(decimal) => setReportedFarmId(decimal.toNumber())}
          maxDecimalPlaces={0}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label type="default" icon={SUNNYSIDE.icons.search} className="mx-2">
          {t("reason")}
        </Label>
        <Dropdown
          options={REASONS}
          value={reason}
          onChange={(value) => setReason(value)}
          maxHeight={16}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between mb-1">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.expression_chat}
            className="mx-2"
          >
            {t("message")}
          </Label>
          {message.length > 450 && (
            <Label
              type={message.length >= 500 ? "danger" : "warning"}
              className="mx-2"
            >
              {t("social.characters.remaining", {
                count: 500 - message.length,
              })}
            </Label>
          )}
        </div>
        <TextInput
          value={message}
          onValueChange={(value) => {
            setMessage(value);
          }}
          placeholder={t("social.report.description")}
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
          {isSubmitting ? t("sending") : t("send")}
        </Button>
      </div>
    </div>
  );
};
