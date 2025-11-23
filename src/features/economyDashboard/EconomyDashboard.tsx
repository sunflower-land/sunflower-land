import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { useAuth } from "features/auth/lib/Provider";
import { ResourceSection } from "./components/ResourceSection";
import { ActivitySection } from "./components/ActivitySection";
import { IslandSection } from "./components/IslandSection";
import { SkillSection } from "./components/SkillSection";
import { FinancialSection } from "./components/FinancialSection";
import classNames from "classnames";

const formatDateInput = (date: Date) =>
  date.toISOString().split("T")[0] as string;

const initialEndDate = formatDateInput(new Date());
const initialStartDate = formatDateInput(
  new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
);

const filterRecords = (
  record: Record<string, string | number> | undefined,
  resource: string,
) => {
  if (!record || !resource) return [];
  const entries = Object.entries(record);

  if (!resource) {
    return entries;
  }

  return entries.filter(([key]) =>
    key.toLowerCase().includes(resource.toLowerCase()),
  );
};

const formatRecordValue = (value: string | number) => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const numericValue = Number(value);
    return numericValue.toLocaleString();
  }

  return value;
};

export const EconomyDashboard: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isInternalRoute = pathname.includes("/game");
  const { authState } = useAuth();

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [requestParams, setRequestParams] = useState<EconomyDataRequest | null>(
    null,
  );
  const maxSelectableDate = formatDateInput(new Date());

  const inventoryOptions = useMemo(
    () =>
      getKeys(ITEM_DETAILS).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      ),
    [],
  );

  useEffect(() => {
    if (selectedResource || inventoryOptions.length === 0) return;

    const fallback =
      inventoryOptions.find((option) => option === "Sunflower") ??
      inventoryOptions[0];

    if (fallback) {
      setSelectedResource(fallback);
    }
  }, [inventoryOptions, selectedResource]);

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
      ([, start, end]) =>
        getEconomyData({
          startDate: start,
          endDate: end,
          token: authState.context.user.rawToken as string,
        }),
      {
        revalidateOnFocus: false,
      },
    );

  const summary = data?.summary;
  const reportEntries = data?.reports ?? [];
  const summaryReports = reportEntries.map((entry) => entry.summary);
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

  const normalizedResource = selectedResource.trim();
  const normalizedSkill = selectedSkill.trim();

  const supplyRecords = filterRecords(summary?.totals, normalizedResource);
  const holderRecords = filterRecords(summary?.holders, normalizedResource);

  const resourceHistory = useMemo(() => {
    if (!normalizedResource) return [];

    const baseHistory =
      summaryReports.length > 0
        ? summaryReports.map((report) => ({
            date: report.reportDate,
            supply: report.totals?.[normalizedResource],
            distribution: report.holders?.[normalizedResource],
          }))
        : (data?.batches ?? []).map((batch) => ({
            date: batch.reportDate ?? batch.startedAt ?? "",
            supply: batch.totals?.[normalizedResource],
            distribution: batch.holders?.[normalizedResource],
          }));

    return baseHistory
      .filter(
        (entry) =>
          entry.date &&
          (entry.supply !== undefined || entry.distribution !== undefined),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [summaryReports, data?.batches, normalizedResource]);

  const formattedSupplyRecords = supplyRecords.map(
    ([key, value]) => [key, formatRecordValue(value)] as [string, string],
  );

  const formattedHolderRecords = holderRecords.map(
    ([key, value]) => [key, formatRecordValue(value)] as [string, string],
  );

  const formattedHistory = resourceHistory.map((entry) => ({
    ...entry,
    supply:
      entry.supply !== undefined ? formatRecordValue(entry.supply) : undefined,
    distribution:
      entry.distribution !== undefined
        ? formatRecordValue(entry.distribution)
        : undefined,
  }));

  const activityHistory = summaryReports
    .map((report) => ({
      date: report.reportDate,
      value: report.dailyActiveUsers ?? 0,
    }))
    .filter((entry) => !!entry.date)
    .sort((a, b) => (a.date! < b.date! ? 1 : -1));

  const islands =
    Object.keys(summary?.islands ?? {}).length > 0
      ? summary?.islands ?? {}
      : summaryReports[summaryReports.length - 1]?.islands ?? {};

  const skillOptions = useMemo(() => {
    const skillSet = new Set<string>();
    if (summary?.skills) {
      Object.keys(summary.skills).forEach((skill) => skillSet.add(skill));
    }
    summaryReports.forEach((report) => {
      Object.keys(report.skills ?? {}).forEach((skill) => skillSet.add(skill));
    });
    return Array.from(skillSet).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [summary?.skills, summaryReports]);

  useEffect(() => {
    if (normalizedSkill || skillOptions.length === 0) return;

    const randomSkill =
      skillOptions[Math.floor(Math.random() * skillOptions.length)];

    if (randomSkill) {
      setSelectedSkill(randomSkill);
    }
  }, [normalizedSkill, skillOptions]);

  const skillHistory = useMemo(() => {
    if (!normalizedSkill) return [];
    return summaryReports
      .map((report) => ({
        date: report.reportDate,
        value: report.skills?.[normalizedSkill] ?? 0,
      }))
      .filter((entry) => !!entry.date)
      .sort((a, b) => (a.date! < b.date! ? 1 : -1));
  }, [summaryReports, normalizedSkill]);

  const selectedSkillValue = normalizedSkill
    ? summary?.skills?.[normalizedSkill] ??
      summaryReports[summaryReports.length - 1]?.skills?.[normalizedSkill] ??
      0
    : 0;

  const financialHistory = reportEntries
    .map((entry) => ({
      date: entry.summary.reportDate,
      xsollaUsd: Number(entry.summary.xsollaUsdTotal ?? 0),
      feesUsd: entry.stats?.processedFees?.totalUsd ?? 0,
      deposits: entry.stats?.flowerDeposits?.total ?? 0,
      withdrawals: entry.stats?.flowerWithdrawals?.total ?? 0,
    }))
    .filter((entry) => !!entry.date);

  const latestBatch =
    data?.batches && data.batches.length > 0
      ? data.batches[data.batches.length - 1]
      : undefined;

  const rangeLabel = requestParams
    ? requestParams.startDate === requestParams.endDate
      ? requestParams.startDate
      : `${requestParams.startDate} - ${requestParams.endDate}`
    : t("economyDashboard.notLoaded");

  const resourceLabel =
    normalizedResource || t("economyDashboard.resourceUnset");

  const canLoad = Boolean(startDate && endDate);

  const handleLoad = () => {
    if (!canLoad) return;
    setRequestParams({
      startDate,
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

            <div className="flex flex-wrap gap-3 text-xs">
              {summary && (
                <span className="text-white text-shadow">
                  {t("economyDashboard.latestReport", {
                    date: summary.reportDate ?? "—",
                  })}
                </span>
              )}
              {!!latestBatch?.completedAt && (
                <span className="text-white text-shadow">
                  {t("economyDashboard.completedAt", {
                    date: new Date(latestBatch.completedAt).toLocaleString(),
                  })}
                </span>
              )}
            </div>
          </InnerPanel>

          {isFetching && <Loading />}

          {!requestParams && !data && !error && (
            <InnerPanel>
              <p className="text-xs">{t("economyDashboard.notLoaded")}</p>
            </InnerPanel>
          )}

          {!isFetching && summary && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <InnerPanel>
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={SUNNYSIDE.icons.money_icon}
                        alt="Supply"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span className="text-sm">
                        {t("economyDashboard.farmCount")}
                      </span>
                      <span className="text-xs">
                        {summary.farmCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </InnerPanel>

                <InnerPanel>
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={SUNNYSIDE.icons.player}
                        alt="Players"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span className="text-sm">
                        {t("economyDashboard.dailyActive")}
                      </span>
                      <span className="text-xs">
                        {summary.dailyActiveUsers.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </InnerPanel>

                <InnerPanel>
                  <div className="flex w-full space-x-3 p-1">
                    <div className="flex items-start justify-center w-8">
                      <img
                        src={SUNNYSIDE.icons.timer}
                        alt="Batches"
                        className="img-highlight w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col -mt-1">
                      <span className="text-sm">
                        {t("economyDashboard.batchCount")}
                      </span>
                      <span className="text-xs">
                        {(summary.batches?.length ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </InnerPanel>
              </div>

              <ResourceSection
                selectedResource={selectedResource}
                normalizedResource={normalizedResource}
                resourceLabel={resourceLabel}
                options={inventoryOptions}
                onResourceChange={setSelectedResource}
                supplyRecords={formattedSupplyRecords}
                holderRecords={formattedHolderRecords}
                history={formattedHistory}
              />

              {!!summary.skills && Object.keys(summary.skills).length > 0 && (
                <InnerPanel className="flex flex-col">
                  <Label type="default" className="mb-1.5">
                    {t("economyDashboard.skillDistribution")}
                  </Label>
                  {Object.entries(summary.skills).map(
                    ([skill, count], index) => (
                      <div
                        key={skill}
                        className={classNames(
                          "flex items-center justify-between p-1.5 text-xs",
                          {
                            "bg-[#ead4aa]": index % 2 === 0,
                          },
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                      >
                        <span>{skill}</span>
                        <span>{count.toLocaleString()}</span>
                      </div>
                    ),
                  )}
                </InnerPanel>
              )}
            </>
          )}

          <ActivitySection
            currentValue={summary?.dailyActiveUsers ?? 0}
            history={activityHistory}
          />

          <IslandSection islands={islands ?? {}} />

          <SkillSection
            selectedSkill={selectedSkill}
            onSkillChange={setSelectedSkill}
            options={skillOptions}
            currentValue={selectedSkillValue}
            history={skillHistory}
          />

          <FinancialSection
            xsollaTotal={Number(summary?.xsollaUsdTotal ?? 0)}
            history={financialHistory}
          />
        </div>
      </Panel>
    </div>
  );
};
