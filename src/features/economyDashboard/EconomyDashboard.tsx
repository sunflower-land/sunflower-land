import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useLocation, useNavigate } from "react-router";

import { Panel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components/Loading";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getEconomyData,
  EconomyDataResponse,
  EconomyDataRequest,
} from "./actions/getEconomyData";
import { useAuth } from "features/auth/lib/Provider";
import { ResourceSection } from "./components/ResourceSection";
import { AnalyticsSection } from "./components/AnalyticsSection";

const formatDateInput = (date: Date) =>
  date.toISOString().split("T")[0] as string;

const getPreviousDate = (value: string) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return formatDateInput(parsed);
};

const initialEndDate = formatDateInput(new Date());
const initialStartDate = formatDateInput(
  new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
);

export const EconomyDashboard: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isInternalRoute = pathname.includes("/game");
  const { authState } = useAuth();

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [requestParams, setRequestParams] = useState<EconomyDataRequest | null>(
    null,
  );
  const [loadedRange, setLoadedRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const maxSelectableDate = formatDateInput(new Date());

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<EconomyDataResponse>(
      requestParams
        ? ["economy-dashboard", requestParams.startDate, requestParams.endDate]
        : null,
      ([, start, end]: [string, string, string]) =>
        getEconomyData({
          startDate: start,
          endDate: end,
          token: authState.context.user.rawToken as string,
        }),
      {
        revalidateOnFocus: false,
      },
    );

  const reportEntries = data?.reports ?? [];
  const isFetching = Boolean(requestParams) && (isLoading || isValidating);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (value > endDate) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (value: string) => {
    if (value < startDate) {
      setStartDate(value);
    }
    setEndDate(value);
  };

  const rangeLabel = loadedRange
    ? loadedRange.startDate === loadedRange.endDate
      ? loadedRange.startDate
      : `${loadedRange.startDate} - ${loadedRange.endDate}`
    : t("economyDashboard.notLoaded");

  const canLoad = Boolean(startDate && endDate);

  const handleLoad = () => {
    if (!canLoad) return;
    const fetchStartDate = getPreviousDate(startDate);
    setLoadedRange({
      startDate,
      endDate,
    });
    setRequestParams({
      startDate: fetchStartDate,
      endDate,
    });
  };

  const handleRetry = () => {
    if (requestParams) {
      mutate();
    } else {
      handleLoad();
    }
  };

  if (error) {
    return (
      <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
        <Panel className="inset-0 fixed pointer-events-auto">
          <div className="relative flex w-full justify-between pr-10 items-center  mr-auto h-[70px] mb-2">
            <div
              className="absolute inset-0 w-full h-full -z-0 rounded-sm"
              style={{
                backgroundImage: `url(${SUNNYSIDE.announcement.marketplace})`,
                imageRendering: "pixelated",
                backgroundSize: "320px",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 w-full h-full bg-black opacity-50 -z-0 rounded-sm" />
            <div className="z-10 pl-4">
              <p className="text-lg text-white z-10 text-shadow">
                {t("economyDashboard.title")}
              </p>
            </div>

            {isInternalRoute && (
              <img
                src={SUNNYSIDE.icons.close}
                className="flex-none cursor-pointer absolute right-2"
                onClick={handleClose}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  height: `${PIXEL_SCALE * 11}px`,
                }}
              />
            )}
          </div>
          <Label className="m-1 mb-2" type="danger">
            {t("transaction.somethingWentWrong")}
          </Label>
          <Button onClick={handleRetry}>{t("try.again")}</Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
      <Panel className="inset-0 fixed pointer-events-auto flex flex-col overflow-y-auto scrollable">
        <div className="relative flex w-full justify-between pr-10 items-center  mr-auto h-[70px] mb-2">
          <div
            className="absolute inset-0 w-full h-full -z-0 rounded-sm"
            style={{
              backgroundImage: `url(${SUNNYSIDE.announcement.marketplace})`,
              imageRendering: "pixelated",
              backgroundSize: "320px",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-black opacity-50 -z-0 rounded-sm" />
          <div className="z-10 pl-4">
            <p className="text-lg text-white z-10 text-shadow">
              {t("economyDashboard.title")}
            </p>
            <span className="text-xs text-white z-10 text-shadow">
              {t("economyDashboard.reportRange", { range: rangeLabel })}
            </span>
          </div>

          {isInternalRoute && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer absolute right-2"
              onClick={handleClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          )}
        </div>

        <div className="flex flex-col px-2 pb-4 space-y-2">
          <InnerPanel className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col">
                <Label type="default" className="mb-1">
                  {t("economyDashboard.startDate")}
                </Label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleStartDateChange(event.target.value)
                  }
                  className="text-shadow rounded-sm bg-brown-200 p-2 text-sm"
                />
              </div>
              <div className="flex flex-col">
                <Label type="default" className="mb-1">
                  {t("economyDashboard.endDate")}
                </Label>
                <input
                  type="date"
                  value={endDate}
                  max={maxSelectableDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleEndDateChange(event.target.value)
                  }
                  className="text-shadow rounded-sm bg-brown-200 p-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full"
                  onClick={handleLoad}
                  disabled={!canLoad || isFetching}
                >
                  {isFetching ? t("loading") : t("economyDashboard.loadData")}
                </Button>
              </div>
            </div>
          </InnerPanel>

          {isFetching && <Loading />}

          {!requestParams && !data && !error && (
            <InnerPanel>
              <p className="text-xs">{t("economyDashboard.notLoaded")}</p>
            </InnerPanel>
          )}

          {!!reportEntries.length && (
            <>
              <ResourceSection
                reports={reportEntries}
                startDate={loadedRange?.startDate}
              />

              <AnalyticsSection
                reports={reportEntries}
                startDate={loadedRange?.startDate}
              />
            </>
          )}
        </div>
      </Panel>
    </div>
  );
};
