import React, { useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";
import { useLocation, useNavigate } from "react-router";

import { Panel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Loading } from "features/auth/components/Loading";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useAuth } from "features/auth/lib/Provider";
import {
  RetentionDataResponse,
  getRetentionData,
  RetentionEntry,
} from "./actions/getRetentionData";

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString();
};

type ParsedRetentionEntry = RetentionEntry & { parsedDate: Date };

export const RetentionDashboard: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isInternalRoute = pathname.includes("/game");
  const { authState } = useAuth();

  const token = authState.context.user.rawToken as string | undefined;

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
    useSWR<RetentionDataResponse>(
      token ? ["retention-dashboard", token] : null,
      ([, authToken]: [string, string]) =>
        getRetentionData({
          token: authToken,
        }),
      {
        revalidateOnFocus: false,
        dedupingInterval: 60 * 60 * 1000,
      },
    );

  const entries = data?.entries;

  const filteredEntries = useMemo(() => {
    if (!entries?.length) return [];

    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const cutoff = new Date(now);
    cutoff.setUTCDate(now.getUTCDate() - 59);

    return entries
      .map((entry) => {
        const parsedDate = parseDate(entry.date);
        if (!parsedDate) return null;
        return { ...entry, parsedDate } as ParsedRetentionEntry;
      })
      .filter((entry): entry is ParsedRetentionEntry => entry !== null)
      .filter((entry) => entry.parsedDate >= cutoff)
      .sort((a, b) => (a.parsedDate > b.parsedDate ? -1 : 1))
      .slice(0, 60)
      .map(({ parsedDate: _unused, ...rest }) => rest);
  }, [entries]);

  const handleRetry = () => {
    mutate();
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
                {t("retentionDashboard.title")}
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

  const mausValue = formatNumber(data?.maus);
  const latestReport = data?.reportDate
    ? data.reportDate
    : t("retentionDashboard.unknownDate");

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
              {t("retentionDashboard.title")}
            </p>
            <span className="text-xs text-white z-10 text-shadow">
              {t("retentionDashboard.latestReport", { date: latestReport })}
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
          {(isLoading || isValidating) && <Loading />}

          {!data && !isLoading && !isValidating && (
            <InnerPanel>
              <p className="text-xs text-white">
                {t("retentionDashboard.noData")}
              </p>
            </InnerPanel>
          )}

          {data && (
            <>
              <InnerPanel className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <Label type="default" className="mb-1">
                      {t("retentionDashboard.activeUsers")}
                    </Label>
                    <p className="text-lg text-white text-shadow">
                      {mausValue}
                    </p>
                  </div>
                  <p className="text-xs text-white">
                    {t("retentionDashboard.latestReport", {
                      date: latestReport,
                    })}
                  </p>
                </div>
              </InnerPanel>

              <InnerPanel className="flex flex-col gap-2">
                <Label type="default">
                  {t("retentionDashboard.tableTitle")}
                </Label>

                {!filteredEntries.length && (
                  <p className="text-xs text-white">
                    {t("retentionDashboard.noData")}
                  </p>
                )}

                {!!filteredEntries.length && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left border-b border-[#b96f50]">
                          <th className="py-1 pr-2">
                            {t("retentionDashboard.date")}
                          </th>
                          <th className="py-1 pr-2">
                            {t("retentionDashboard.signups")}
                          </th>
                          <th className="py-1 pr-2">
                            {t("retentionDashboard.d1")}
                          </th>
                          <th className="py-1 pr-2">
                            {t("retentionDashboard.d7")}
                          </th>
                          <th className="py-1">
                            {t("retentionDashboard.d30")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map((entry) => (
                          <tr
                            key={entry.date}
                            className="border-b border-[#b96f50] last:border-b-0"
                          >
                            <td className="py-1 pr-2 whitespace-nowrap">
                              {entry.date ||
                                t("retentionDashboard.unknownDate")}
                            </td>
                            <td className="py-1 pr-2">
                              {formatNumber(entry.signups)}
                            </td>
                            <td className="py-1 pr-2">
                              {formatNumber(entry.d1)}
                            </td>
                            <td className="py-1 pr-2">
                              {formatNumber(entry.d7)}
                            </td>
                            <td className="py-1">{formatNumber(entry.d30)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </InnerPanel>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
};
