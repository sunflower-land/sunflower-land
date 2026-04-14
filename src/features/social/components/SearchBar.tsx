import React, { useContext } from "react";
import { useEffect, useRef, useState } from "react";
import { MachineState } from "features/game/lib/gameMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Detail } from "../actions/getFollowNetworkDetails";
import { searchPlayerByUsername } from "../actions/searchPlayerByUsername";
import { TextInput } from "components/ui/TextInput";

import loadingIcon from "assets/icons/timer.gif";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _farmId = (state: MachineState) =>
  state.context.visitorId ?? state.context.farmId;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

type Props = {
  context: "following" | "all" | "followers";
  onSearchResults: (results: Detail[]) => void;
};

const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const SearchBar: React.FC<Props> = ({ onSearchResults, context }) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const { t } = useAppTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Detail[]>([]);
  const [loading, setLoading] = useState(false);

  const controllerRef = useRef<AbortController>(undefined);
  const currentRequestRef = useRef<string>("");

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 200);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 2) {
      setLoading(true);

      // Abort previous request if it exists
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      // Create new abort controller for this request
      const controller = new AbortController();
      controllerRef.current = controller;

      // Track this specific request
      const requestId = debouncedSearchTerm;
      currentRequestRef.current = requestId;

      searchPlayerByUsername({
        token,
        farmId,
        searchTerm: debouncedSearchTerm,
        context,
        signal: controller.signal,
      })
        .then(({ data }) => {
          // Only update results if this is still the current request
          if (currentRequestRef.current === requestId) {
            setResults(data);
          }
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            // eslint-disable-next-line no-console
            console.log("Search aborted by the user.");
          } else {
            // eslint-disable-next-line no-console
            console.error("Failed to search players:", error);
          }
        })
        .finally(() => {
          // Only update loading state if this is still the current request
          if (currentRequestRef.current === requestId) {
            setLoading(false);
          }
        });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [debouncedSearchTerm, token, farmId, context]);

  useEffect(() => {
    onSearchResults(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const getIcon = () => {
    if (!searchTerm || searchTerm.length < 3) return SUNNYSIDE.icons.search;
    if (loading) return loadingIcon;

    return SUNNYSIDE.icons.close;
  };

  return (
    <div className="relative mt-1 w-full">
      <div className="flex relative w-full">
        <TextInput
          value={searchTerm}
          onValueChange={(value) => setSearchTerm(value)}
          placeholder={t("playerSearch.placeholderContext", { context })}
          className="w-full"
        />
        <img
          onClick={searchTerm ? () => setSearchTerm("") : undefined}
          src={getIcon()}
          className={classNames("absolute right-3 top-1/2 -translate-y-1/2", {
            "h-4 w-auto": loading,
            "w-4 h-auto cursor-pointer": !loading,
          })}
        />
      </div>
      {debouncedSearchTerm.length > 2 && !loading && results.length === 0 && (
        <Label className="text-xs absolute -top-3 right-0" type="default">
          {t("playerSearch.noResults")}
        </Label>
      )}
    </div>
  );
};
