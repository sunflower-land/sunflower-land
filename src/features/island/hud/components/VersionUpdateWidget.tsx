import React, { useEffect, useRef, useState } from "react";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const POLL_INTERVAL_MS = 5 * 60 * 1000;

interface VersionMetadata {
  releaseVersion?: string;
}

const buildVersionUrl = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.href);
  const versionUrl = new URL("version.json", baseUrl);
  versionUrl.searchParams.set("ts", Date.now().toString());

  return versionUrl.toString();
};

const fetchLatestReleaseVersion = async (): Promise<string | undefined> => {
  const url = buildVersionUrl();
  if (!url) {
    return undefined;
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return undefined;
    }

    const metadata = (await response.json()) as VersionMetadata;

    return metadata?.releaseVersion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to fetch latest version metadata", error);
    return undefined;
  }
};

export const VersionUpdateWidget: React.FC = () => {
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const { t } = useAppTranslation();
  const checkingRef = useRef(false);

  const handleClose = () => {
    setIsUpdateReady(false);
  };

  useEffect(() => {
    let cancelled = false;

    const checkForUpdate = async () => {
      if (checkingRef.current) {
        return;
      }

      checkingRef.current = true;
      const latest = await fetchLatestReleaseVersion();
      checkingRef.current = false;

      if (cancelled || !latest) {
        return;
      }

      if (latest !== CONFIG.RELEASE_VERSION) {
        setIsUpdateReady(true);
      }
    };

    checkForUpdate();
    const interval = window.setInterval(checkForUpdate, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (!isUpdateReady) {
    return null;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <ButtonPanel className="flex space-x-2 px-2 py-1" onClick={handleReload}>
      <div>
        <div className="flex items-center text-xs space-x-2">
          <span>{t("version.updateReady")}</span>
        </div>

        <span className="text-xs underline">{t("version.updateCta")}</span>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="h-5 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      />
    </ButtonPanel>
  );
};
