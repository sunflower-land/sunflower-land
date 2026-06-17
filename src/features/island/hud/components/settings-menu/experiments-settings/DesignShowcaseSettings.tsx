import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";

import { Context } from "features/game/GameProvider";
import { useAuth } from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";

import { NPCFixed } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { PlayerModal } from "features/social/PlayerModal";
import { playerModalManager } from "features/social/lib/playerModalManager";

import { getShowcasedDesigns } from "features/game/actions/getShowcasedDesigns";
import type { ShowcasedDesign } from "features/game/types/social";
import type { Equipped } from "features/game/types/bumpkin";
import type { MachineState } from "features/game/lib/gameMachine";
import type { ContentComponentProps } from "../types";

import { SUNNYSIDE } from "assets/sunnyside";

const _farmId = (state: MachineState) => state.context.farmId;

// NPCFixed renders the bumpkin correctly at this width; we CSS-scale it down
// for smaller avatars rather than passing a tiny width (which would crop it).
const NPC_BASE_WIDTH = PIXEL_SCALE * 16;

const BumpkinAvatar: React.FC<{ parts: Equipped; size: number }> = ({
  parts,
  size,
}) => (
  <div
    className="overflow-hidden flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <div
      style={{
        width: NPC_BASE_WIDTH,
        height: NPC_BASE_WIDTH,
        transform: `scale(${size / NPC_BASE_WIDTH})`,
        transformOrigin: "top left",
      }}
    >
      <NPCFixed parts={parts} width={NPC_BASE_WIDTH} />
    </div>
  </div>
);

const designAuthorName = (design: ShowcasedDesign) =>
  design.username ?? design.displayName ?? `#${design.farmId}`;

export const DesignShowcaseSettings: React.FC<ContentComponentProps> = () => {
  const { gameService } = useContext(Context);
  const { authState } = useAuth();
  const { t } = useAppTranslation();
  const now = useNow();

  const token = authState.context.user.rawToken as string;
  const farmId = useSelector(gameService, _farmId);

  const [designs, setDesigns] = useState<ShowcasedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<ShowcasedDesign>();

  useEffect(() => {
    if (!token) return;

    let active = true;

    getShowcasedDesigns({ token })
      .then((data) => {
        if (!active) return;
        setDesigns(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const openAuthor = (design: ShowcasedDesign) =>
    playerModalManager.open({
      farmId: design.farmId,
      username: design.username,
      clothing: design.bumpkin,
    });

  // Detail view for a single design: back button, full-size image, then a
  // clickable NPC + name that opens the player model.
  if (selected) {
    return (
      <>
        <InnerPanel className="p-1">
          <div className="max-h-[450px] overflow-y-auto scrollable">
            <div
              className="flex items-center cursor-pointer mb-2 w-fit"
              onClick={() => setSelected(undefined)}
            >
              <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
              <p className="text-xs underline">{t("back")}</p>
            </div>

            <img
              src={selected.image}
              className="w-full mb-2 rounded object-contain"
              alt={designAuthorName(selected)}
            />

            <div
              className="flex items-center gap-2 cursor-pointer w-fit"
              onClick={() => openAuthor(selected)}
            >
              <BumpkinAvatar parts={selected.bumpkin} size={PIXEL_SCALE * 12} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <p className="text-xs capitalize">
                    {designAuthorName(selected)}
                  </p>
                  <span className="text-xs underline">{`#${selected.farmId}`}</span>
                </div>
                <span className="text-xxs">
                  {getRelativeTime(selected.showcasedAt, now)}
                </span>
              </div>
            </div>
          </div>
        </InnerPanel>
        <PlayerModal
          loggedInFarmId={farmId}
          token={token}
          hasAirdropAccess={false}
        />
      </>
    );
  }

  return (
    <>
      <InnerPanel>
        <div className="flex items-center justify-between p-1">
          <Label type="default">{t("designShowcase.heading")}</Label>
        </div>
        <p className="text-xs px-1 mb-2">{t("designShowcase.description")}</p>

        <div
          className="overflow-y-auto scrollable pr-1"
          style={{ maxHeight: "350px" }}
        >
          {loading && <Loading />}

          {!loading && error && (
            <p className="text-sm p-2">{t("designShowcase.error")}</p>
          )}

          {!loading && !error && designs.length === 0 && (
            <p className="text-sm p-2">{t("designShowcase.empty")}</p>
          )}

          {!loading && !error && designs.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {designs.map((design) => (
                <ButtonPanel
                  key={design.messageId}
                  onClick={() => setSelected(design)}
                  className="flex flex-col"
                >
                  <div className="w-full aspect-square overflow-hidden rounded bg-brown-300">
                    <img
                      src={design.image}
                      className="w-full h-full object-cover"
                      alt={designAuthorName(design)}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1 overflow-hidden">
                    <BumpkinAvatar parts={design.bumpkin} size={20} />
                    <span className="text-xxs capitalize truncate">
                      {designAuthorName(design)}
                    </span>
                  </div>
                  <span className="text-xxs mt-0.5">
                    {getRelativeTime(design.showcasedAt, now)}
                  </span>
                </ButtonPanel>
              ))}
            </div>
          )}
        </div>
      </InnerPanel>
      <PlayerModal
        loggedInFarmId={farmId}
        token={token}
        hasAirdropAccess={false}
      />
    </>
  );
};
