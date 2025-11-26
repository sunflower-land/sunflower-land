import React, { useContext, useMemo, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { ContentComponentProps } from "../GameOptions";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const LOG_GROUP_OPTIONS = [
  { value: "AUTOSAVE", label: "Autosave (AS-XXX)" },
  { value: "SYNC", label: "Sync (SY-XXX)" },
  { value: "SESSION", label: "Session (SE-XXX)" },
  { value: "MINT", label: "Mint (MC-XXX)" },
  { value: "WITHDRAW", label: "Withdraw (WD-XXX)" },
  { value: "BANS", label: "Bans (BA-XXX)" },
  { value: "OAUTH", label: "OAuth (OA-XXX)" },
  { value: "RESET", label: "Refresh (RE-001)" },
  { value: "EFFECT", label: "Effects (EF-XXX)" },
] as const;

type LogGroupKey = (typeof LOG_GROUP_OPTIONS)[number]["value"];

type LookupResponse = unknown;

const formatDateTimeInput = (date: Date) => date.toISOString().slice(0, 16);

const formatResultText = (value: string) =>
  value.replace(/\\n/g, "\n").replace(/\\t/g, "  ").replace(/\t/g, "  ");

const toUtcMs = (value: string) => {
  if (!value) return Number.NaN;
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  const timestamp = Date.parse(`${withSeconds}Z`);
  return Number.isNaN(timestamp) ? Number.NaN : timestamp;
};

export const DEV_ErrorSearch: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const defaultRange = useMemo(() => {
    const alignedEnd = new Date(Math.floor(Date.now() / 60000) * 60000);
    const alignedStart = new Date(alignedEnd.getTime() - FIFTEEN_MINUTES_MS);

    return {
      start: formatDateTimeInput(alignedStart),
      end: formatDateTimeInput(alignedEnd),
    };
  }, []);

  const [startTimeInput, setStartTimeInput] = useState(defaultRange.start);
  const [endTimeInput, setEndTimeInput] = useState(defaultRange.end);
  const [transactionId, setTransactionId] = useState("");
  const [api, setApi] = useState<LogGroupKey>(LOG_GROUP_OPTIONS[0].value);
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const startTimeMs = useMemo(() => toUtcMs(startTimeInput), [startTimeInput]);
  const endTimeMs = useMemo(() => toUtcMs(endTimeInput), [endTimeInput]);

  const transactionIdError = useMemo(() => {
    if (!transactionId) return "Transaction ID is required";
    if (!/^[a-z0-9]+$/i.test(transactionId)) {
      return "Only alphanumeric characters are allowed";
    }
    if (transactionId.length < 4) {
      return "Transaction ID must be at least 4 characters";
    }
    return "";
  }, [transactionId]);

  const timeError = useMemo(() => {
    if (Number.isNaN(startTimeMs) || Number.isNaN(endTimeMs))
      return "Enter a valid UTC time window";
    if (startTimeMs >= endTimeMs) return "End time must be after the start";
    if (endTimeMs - startTimeMs > FIFTEEN_MINUTES_MS)
      return "Select a window of 15 minutes or less";
    return "";
  }, [endTimeMs, startTimeMs]);

  const canSubmit =
    !loading && !transactionIdError && !timeError && !!transactionId && !!api;

  const submitLookup = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await window.fetch(
        `${CONFIG.API_URL}/support/transactionLookup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${authState.context.user.rawToken as string}`,
          },
          body: JSON.stringify({
            startTime: startTimeMs,
            endTime: endTimeMs,
            transactionId,
            api,
          }),
        },
      );

      const raw = await response.text();
      const parsed = (() => {
        try {
          return raw ? JSON.parse(raw) : raw;
        } catch (jsonError) {
          return raw;
        }
      })();

      if (!response.ok) {
        setError(
          typeof parsed === "string"
            ? parsed || t("transaction.somethingWentWrong")
            : t("transaction.somethingWentWrong"),
        );
        return;
      }

      setResult(parsed);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (fetchError: any) {
      setError(fetchError?.message ?? t("transaction.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 text-xs">
      <p className="text-xs leading-snug">{`Times are captured in UTC. Maximum window is 15 minutes.`}</p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label
            type="default"
            className="!text-sm !py-0 !px-2 w-28 text-center whitespace-nowrap"
          >{`Start (UTC)`}</Label>
          <input
            type="datetime-local"
            value={startTimeInput}
            max="9999-12-31T23:59"
            step={60}
            onChange={(event) => {
              setStartTimeInput(event.target.value);
            }}
            className="text-shadow rounded-sm shadow-inner text-black placeholder-black shadow-black bg-brown-200 flex-1 p-1.5 h-10 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label
            type="default"
            className="!text-sm !py-0 !px-2 w-28 text-center whitespace-nowrap"
          >{`End (UTC)`}</Label>
          <input
            type="datetime-local"
            value={endTimeInput}
            max="9999-12-31T23:59"
            step={60}
            onChange={(event) => {
              setEndTimeInput(event.target.value);
            }}
            className="text-shadow rounded-sm shadow-inner text-black placeholder-black shadow-black bg-brown-200 flex-1 p-1.5 h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label
          type="default"
          className="!text-sm !py-0 !px-2 w-28 text-center whitespace-nowrap"
        >{`Txn ID`}</Label>
        <TextInput
          className="flex-1 h-10 text-sm"
          value={transactionId}
          onValueChange={(value) =>
            setTransactionId(value.replace(/[^a-z0-9]/gi, ""))
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <Label
          type="default"
          className="!text-sm !py-0 !px-2 w-28 text-center whitespace-nowrap"
        >{`API`}</Label>
        <select
          value={api}
          onChange={(event) => setApi(event.target.value as LogGroupKey)}
          className="text-shadow rounded-sm shadow-inner text-black placeholder-black shadow-black bg-brown-200 flex-1 p-1.5 h-9 text-xs"
        >
          {LOG_GROUP_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {(transactionIdError || timeError || error) && (
        <div className="text-xs text-red-500 min-h-[1rem]">
          {transactionIdError || timeError || error}
        </div>
      )}

      <Button
        disabled={!canSubmit}
        onClick={submitLookup}
        className="w-full h-9 text-xs"
      >
        {loading ? t("loading") : t("search")}
      </Button>

      {result !== null && (
        <pre className="bg-gray-950 text-green-200 text-[9px] leading-[1.05rem] p-2 rounded-md max-h-64 overflow-auto whitespace-pre-wrap break-all font-mono border border-gray-800 mt-2">
          {formatResultText(
            typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2),
          )}
        </pre>
      )}
    </div>
  );
};
