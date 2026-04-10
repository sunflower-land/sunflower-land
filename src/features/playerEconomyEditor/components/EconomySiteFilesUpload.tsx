import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { HostedMinigameSiteIndexInfo } from "../lib/types";
import { usePlayerEconomyEditorSession } from "../PlayerEconomyEditorSessionContext";
import { HOSTED_ECONOMY_SITE_HOST_SUFFIX } from "../lib/hostedMinigameUrl";

function formatSiteIndexTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const MAX_FILES = 200;

/** Browser `file.type` is often empty; map common extensions when guessing. */
const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  json: "application/json",
  js: "text/javascript",
  mjs: "text/javascript",
  cjs: "text/javascript",
  ts: "text/plain",
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  svg: "image/svg+xml",
  txt: "text/plain",
  md: "text/markdown",
  xml: "application/xml",
  pdf: "application/pdf",
  zip: "application/zip",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  mp4: "video/mp4",
  webm: "video/webm",
  ico: "image/x-icon",
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  wasm: "application/wasm",
  map: "application/json",
};

function sanitizeFileNameToPathSegment(name: string): string {
  const base = name.replace(/^.*[/\\]/, "");
  const cleaned = base
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/^\.+/, "file");
  return cleaned.length > 0 ? cleaned : "file";
}

function guessMimeFromExtension(fileName: string): string | null {
  const base = fileName.replace(/^.*[/\\]/, "");
  const dot = base.lastIndexOf(".");
  if (dot < 0 || dot === base.length - 1) return null;
  const ext = base.slice(dot + 1).toLowerCase();
  return EXT_TO_MIME[ext] ?? null;
}

/**
 * Hint for the API (server may normalize). The PUT uses `contentType` from the presign response.
 */
function contentTypeForFile(file: File): string {
  const raw = file.type?.split(";")[0]?.trim();
  if (raw) return raw.toLowerCase();
  return guessMimeFromExtension(file.name) ?? "application/octet-stream";
}

function getWebkitRelativePath(file: File): string | null {
  const wrp = (file as File & { webkitRelativePath?: string })
    .webkitRelativePath;
  if (typeof wrp === "string" && wrp.trim()) {
    return wrp.trim().replace(/\\/g, "/");
  }
  return null;
}

/**
 * Paths look like `dist/index.html` where `dist` is the folder the user picked.
 * We store objects at the economy root (`index.html`), not under that folder name.
 */
function stripSelectedFolderPrefix(relativePath: string): string {
  const norm = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = norm.split("/").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return parts.slice(1).join("/");
}

/** Sanitize each path segment for API `normalizeMinigamesUploadPath` rules. */
function sanitizeRelativePathForApi(relativePath: string): string | null {
  const norm = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!norm || norm.includes("..")) return null;
  const segments = norm.split("/").filter(Boolean);
  const cleaned = segments
    .map((s) => sanitizeFileNameToPathSegment(s))
    .filter((s) => s.length > 0);
  if (!cleaned.length) return null;
  const out = cleaned.join("/");
  if (!/^[a-zA-Z0-9/_.-]+$/.test(out)) return null;
  return out;
}

function dedupeAssetKeys(paths: string[]): string[] {
  const seen = new Map<string, number>();
  return paths.map((p) => {
    const count = seen.get(p) ?? 0;
    seen.set(p, count + 1);
    if (count === 0) return p;
    const dot = p.lastIndexOf(".");
    if (dot > p.lastIndexOf("/") && dot > 0) {
      return `${p.slice(0, dot)}_${count}${p.slice(dot)}`;
    }
    return `${p}_${count}`;
  });
}

/** Folder picker: object keys are `{slug}/{path}` with no `assets/` or selected folder root. */
function uniqueAssetPaths(files: File[]): string[] {
  const rels = files.map((f) => {
    const wrp = getWebkitRelativePath(f);
    if (wrp) {
      const inner = stripSelectedFolderPrefix(wrp);
      const s = sanitizeRelativePathForApi(inner);
      if (s) return s;
    }
    return sanitizeFileNameToPathSegment(f.name);
  });
  return dedupeAssetKeys(rels);
}

type RowStatus = "presigning" | "uploading" | "done" | "error" | "idle";

type UploadRow = {
  id: string;
  displayName: string;
  path: string;
  contentType: string;
  file: File;
  status: RowStatus;
  error?: string;
  publicUrl?: string;
};

function newRowId() {
  return `site-up-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function EconomySiteUploadTitleRow({
  slugTrim,
  onOpenCacheInvalidate,
}: {
  slugTrim: string;
  onOpenCacheInvalidate: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <Label
        type="info"
        icon={SUNNYSIDE.icons.seedling}
        className="mb-0 min-w-0 flex-1"
      >
        {t("playerEconomyEditor.siteUpload.title")}
      </Label>
      <button
        type="button"
        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-right font-[inherit] text-[10px] text-amber-200/90 underline underline-offset-2 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={onOpenCacheInvalidate}
        disabled={!slugTrim}
      >
        {t("playerEconomyEditor.cacheInvalidate.link")}
      </button>
    </div>
  );
}

export const EconomySiteFilesUpload: React.FC<{
  slug: string;
  mode: "create" | "edit";
  hostedSiteIndex: HostedMinigameSiteIndexInfo | null;
  onOpenCacheInvalidate: () => void;
  onAfterIndexUpload?: () => void;
  /** Opens hosted game in a new tab (fetches portal JWT + same query params as in-game portal). */
  onPlayGame?: () => void;
  playGameLoading?: boolean;
  playGameError?: string | null;
}> = ({
  slug,
  mode,
  hostedSiteIndex,
  onOpenCacheInvalidate,
  onAfterIndexUpload,
  onPlayGame,
  playGameLoading = false,
  playGameError = null,
}) => {
  const { t } = useAppTranslation();
  const folderInputId = useId();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { prepareEconomySiteUploads } = usePlayerEconomyEditorSession();
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [recentIndexUpload, setRecentIndexUpload] = useState(false);

  const slugTrim = slug.trim();

  useEffect(() => {
    setRecentIndexUpload(false);
  }, [slugTrim]);
  const hasApi = Boolean(CONFIG.API_URL);

  const setRow = useCallback((id: string, patch: Partial<UploadRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const runPipeline = useCallback(
    async (nextRows: UploadRow[]) => {
      if (!nextRows.length) return;

      setIsRunning(true);
      setBatchError(null);
      setRows((prev) =>
        prev.map((r) => ({
          ...r,
          status: "presigning" as const,
          error: undefined,
        })),
      );

      try {
        const presigned = await prepareEconomySiteUploads(
          slugTrim,
          nextRows.map((r) => ({
            path: r.path,
            contentType: r.contentType,
            file: r.file,
          })),
        );

        let indexUploadedOk = false;

        for (let i = 0; i < nextRows.length; i++) {
          const row = nextRows[i];
          const p = presigned[i];
          if (!p) {
            setRow(row.id, {
              status: "error",
              error: t("playerEconomyEditor.siteUpload.missingPresign"),
            });
            continue;
          }

          setRow(row.id, { status: "uploading", error: undefined });

          try {
            const put = await fetch(p.presignedPutUrl, {
              method: "PUT",
              body: row.file,
              headers: {
                "Content-Type": p.contentType,
              },
            });
            if (!put.ok) {
              throw new Error(`HTTP ${put.status}`);
            }
            setRow(row.id, {
              status: "done",
              publicUrl: p.publicUrl || undefined,
            });
            const lower = row.path.toLowerCase();
            if (lower === "index.html" || lower.endsWith("/index.html")) {
              indexUploadedOk = true;
            }
          } catch {
            setRow(row.id, {
              status: "error",
              error: t("playerEconomyEditor.siteUpload.putFailed"),
            });
          }
        }

        if (indexUploadedOk) {
          setRecentIndexUpload(true);
          if (onAfterIndexUpload) onAfterIndexUpload();
        }
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : t("playerEconomyEditor.siteUpload.presignFailed");
        setBatchError(message);
        setRows((prev) =>
          prev.map((r) => ({
            ...r,
            status: "error" as const,
            error: message,
          })),
        );
      } finally {
        setIsRunning(false);
      }
    },
    [prepareEconomySiteUploads, setRow, slugTrim, t, onAfterIndexUpload],
  );

  const showPlaySection = Boolean(hostedSiteIndex) || recentIndexUpload;

  const onPickFolder = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      const picked = Array.from(list);
      if (picked.length > MAX_FILES) {
        setBatchError(
          t("playerEconomyEditor.siteUpload.tooManyFiles", {
            max: MAX_FILES,
          }),
        );
        return;
      }
      setBatchError(null);

      const paths = uniqueAssetPaths(picked);
      const nextRows: UploadRow[] = picked.map((file, i) => {
        const contentType = contentTypeForFile(file);
        const path = paths[i] ?? sanitizeFileNameToPathSegment(file.name);
        const displayName = getWebkitRelativePath(file) ?? file.name;
        return {
          id: newRowId(),
          displayName,
          path,
          contentType,
          file,
          status: "idle" as const,
        };
      });

      setRows(nextRows);
      if (folderInputRef.current) folderInputRef.current.value = "";

      void runPipeline(nextRows);
    },
    [runPipeline, t],
  );

  if (!slugTrim) {
    return (
      <InnerPanel className="p-3 space-y-2">
        <EconomySiteUploadTitleRow
          slugTrim={slugTrim}
          onOpenCacheInvalidate={onOpenCacheInvalidate}
        />
        <p className="text-[10px] opacity-70 leading-snug">
          {t("playerEconomyEditor.basics.setSlugFirstForHosted")}
        </p>
      </InnerPanel>
    );
  }

  if (mode === "create") {
    return (
      <InnerPanel className="p-3 space-y-2">
        <EconomySiteUploadTitleRow
          slugTrim={slugTrim}
          onOpenCacheInvalidate={onOpenCacheInvalidate}
        />
        <p className="text-[10px] opacity-70 leading-snug">
          {t("playerEconomyEditor.siteUpload.saveEconomyFirst")}
        </p>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className="p-3 space-y-2">
      <EconomySiteUploadTitleRow
        slugTrim={slugTrim}
        onOpenCacheInvalidate={onOpenCacheInvalidate}
      />
      <p className="text-[10px] opacity-70 leading-snug ml-0.5">
        {t("playerEconomyEditor.siteUpload.hint", {
          slug: slugTrim,
          host: HOSTED_ECONOMY_SITE_HOST_SUFFIX,
        })}
      </p>

      {hostedSiteIndex ? (
        <div className="flex items-start gap-2 rounded-sm bg-[#286c4e]/20 border border-[#1e4d38]/45 px-2 py-1.5 ml-0.5">
          <img
            src={SUNNYSIDE.icons.confirm}
            alt=""
            className="w-3.5 h-3.5 mt-0.5 shrink-0"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] text-emerald-200/95 leading-snug">
              {t("playerEconomyEditor.siteUpload.indexDeployed")}
            </p>
            <p
              className="text-[9px] font-mono text-amber-100/85 truncate"
              title={`s3://${hostedSiteIndex.bucket}/${hostedSiteIndex.key}`}
            >
              {`s3://${hostedSiteIndex.bucket}/${hostedSiteIndex.key}`}
            </p>
            <p className="text-[9px] opacity-75 leading-snug">
              {t("playerEconomyEditor.siteUpload.lastUploaded", {
                time: formatSiteIndexTime(hostedSiteIndex.lastModified),
              })}
            </p>
          </div>
        </div>
      ) : recentIndexUpload ? (
        <div className="flex items-start gap-2 rounded-sm bg-[#286c4e]/20 border border-[#1e4d38]/45 px-2 py-1.5 ml-0.5">
          <img
            src={SUNNYSIDE.icons.confirm}
            alt=""
            className="w-3.5 h-3.5 mt-0.5 shrink-0"
            style={{ imageRendering: "pixelated" }}
          />
          <p className="text-[10px] text-emerald-200/95 leading-snug">
            {t("playerEconomyEditor.siteUpload.indexDeployed")}
          </p>
        </div>
      ) : (
        <p className="text-[10px] opacity-55 leading-snug ml-0.5">
          {t("playerEconomyEditor.siteUpload.noIndexYet")}
        </p>
      )}

      {showPlaySection ? (
        <div className="space-y-2 rounded-sm bg-black/25 border border-[#3e2731]/40 px-2 py-2 ml-0.5">
          {playGameError ? (
            <Label type="danger" className="block text-xs">
              {playGameError}
            </Label>
          ) : null}
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={
              !hasApi || playGameLoading || typeof onPlayGame !== "function"
            }
            onClick={() => onPlayGame?.()}
          >
            <span className="text-sm">
              {playGameLoading
                ? t("playerEconomyEditor.siteUpload.playGameLoading")
                : t("playerEconomyEditor.siteUpload.playGame")}
            </span>
          </Button>
        </div>
      ) : null}

      <input
        ref={folderInputRef}
        id={folderInputId}
        type="file"
        multiple
        className="hidden"
        disabled={!hasApi || isRunning}
        {...({
          webkitdirectory: "",
          directory: "",
        } as React.InputHTMLAttributes<HTMLInputElement>)}
        onChange={(e) => onPickFolder(e.target.files)}
      />

      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={!hasApi || isRunning}
        onClick={() => folderInputRef.current?.click()}
      >
        <span className="text-sm">
          {isRunning
            ? t("playerEconomyEditor.siteUpload.working")
            : t("playerEconomyEditor.siteUpload.uploadFolder")}
        </span>
      </Button>

      {!hasApi ? (
        <p className="text-[10px] text-amber-200/80 leading-snug">
          {t("playerEconomyEditor.error.imageUploadNeedsApi")}
        </p>
      ) : null}

      {batchError ? (
        <Label type="danger" className="block text-xs">
          {batchError}
        </Label>
      ) : null}

      {rows.length > 0 ? (
        <ul className="mt-1 space-y-1.5 border-t border-[#3e2731]/40 pt-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-0.5 rounded-sm bg-black/20 px-2 py-1.5 text-[10px]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="truncate font-mono text-amber-100/90"
                  title={r.path}
                >
                  {r.displayName}
                </span>
                <StatusBadge row={r} />
              </div>
              <span className="truncate opacity-60 text-[9px]">{r.path}</span>
              {r.status === "error" ? (
                <span className="text-red-300/95 text-[9px]">{r.error}</span>
              ) : null}
              {r.status === "done" && r.publicUrl ? (
                <span
                  className="text-emerald-300/90 text-[9px] truncate"
                  title={r.publicUrl}
                >
                  {r.publicUrl}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </InnerPanel>
  );
};

function StatusBadge({ row }: { row: UploadRow }) {
  const { t } = useAppTranslation();
  if (row.status === "presigning" || row.status === "idle") {
    return (
      <span className="shrink-0 flex items-center gap-1 text-amber-200/90 text-[9px] animate-pulse">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400/80" />
        {t("playerEconomyEditor.siteUpload.status.presigning")}
      </span>
    );
  }
  if (row.status === "uploading") {
    return (
      <span className="shrink-0 flex items-center gap-1 text-amber-200/90 text-[9px] animate-pulse">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400/80" />
        {t("playerEconomyEditor.siteUpload.status.uploading")}
      </span>
    );
  }
  if (row.status === "done") {
    return (
      <span className="shrink-0 text-emerald-300/95 text-[9px]">
        {t("playerEconomyEditor.siteUpload.status.done")}
      </span>
    );
  }
  if (row.status === "error") {
    return (
      <span className="shrink-0 text-red-300/95 text-[9px]">
        {t("playerEconomyEditor.siteUpload.status.error")}
      </span>
    );
  }
  return null;
}
