import React, { useContext, useMemo, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import type { ContentComponentProps } from "../types";
import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";

/**
 * Moderator "Error Search": paste the transaction ID from a player's error
 * message and the API returns what the request logged. The API works out
 * when the transaction happened from the error it recorded, so the time is
 * only needed when that fails (POST /support/transactionLookup).
 */

type LookupResponse = unknown;

const formatResultText = (value: string) =>
  value.replace(/\\n/g, "\n").replace(/\\t/g, "  ").replace(/\t/g, "  ");

/** `datetime-local` value (no zone) read as UTC → ms epoch; NaN if invalid. */
const toUtcMs = (value: string) => {
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return Date.parse(`${withSeconds}Z`);
};

export const DEV_ErrorSearch: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [transactionId, setTransactionId] = useState("");
  const [approxTimeInput, setApproxTimeInput] = useState("");
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const approxTimeMs = useMemo(
    () => (approxTimeInput ? toUtcMs(approxTimeInput) : undefined),
    [approxTimeInput],
  );

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

  const timeError =
    approxTimeMs !== undefined && Number.isNaN(approxTimeMs)
      ? "Enter a valid UTC time, or leave it blank"
      : "";

  const canSubmit = !loading && !transactionIdError && !timeError;

  const submitLookup = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetchWithRetry(
        `${CONFIG.API_URL}/support/transactionLookup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${authState.context.user.rawToken as string}`,
          },
          body: JSON.stringify({
            transactionId,
            ...(approxTimeMs !== undefined ? { at: approxTimeMs } : {}),
          }),
        },
        { idempotent: true },
      );

      const raw = await response.text();
      const parsed = (() => {
        try {
          return raw ? JSON.parse(raw) : raw;
        } catch {
          return raw;
        }
      })();

      if (!response.ok) {
        const message =
          typeof parsed === "string"
            ? parsed
            : typeof parsed?.error === "string"
              ? parsed.error
              : "";
        setError(message || t("transaction.somethingWentWrong"));
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
      <p className="text-xs leading-snug">
        {`Paste the Transaction ID from the player's error message. The time is found automatically from the recorded error — only add an approximate time (UTC) if the search comes back empty.`}
      </p>

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
        >{`Approx (UTC)`}</Label>
        <input
          type="datetime-local"
          value={approxTimeInput}
          max="9999-12-31T23:59"
          step={60}
          onChange={(event) => {
            setApproxTimeInput(event.target.value);
          }}
          className="text-shadow rounded-sm shadow-inner text-black placeholder-black shadow-black bg-brown-200 flex-1 p-1.5 h-10 text-sm"
        />
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
