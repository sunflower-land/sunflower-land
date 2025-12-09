import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";

type InteractionMenuOption = {
  id: "details" | "wave";
  label: string;
  action: () => void;
};

export type InteractionMenuPayload = {
  targetFarmId: number;
  targetUsername?: string;
  position: { x: number; y: number };
  options: InteractionMenuOption[];
};

type MenuListener = (payload?: InteractionMenuPayload) => void;

class PlayerInteractionMenuManager {
  private listener?: MenuListener;

  public open(payload: InteractionMenuPayload) {
    if (this.listener) {
      this.listener(payload);
    }
  }

  public close() {
    if (this.listener) {
      this.listener(undefined);
    }
  }

  public listen(cb: MenuListener) {
    this.listener = cb;
  }
}

export const playerInteractionMenuManager = new PlayerInteractionMenuManager();

const MENU_WIDTH = 176;
const MENU_HEIGHT = 96;

export const PlayerInteractionMenu: React.FC = () => {
  const [payload, setPayload] = useState<InteractionMenuPayload>();

  useEffect(() => {
    playerInteractionMenuManager.listen(setPayload);
  }, []);

  useEffect(() => {
    if (!payload) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const closestPanel = target.closest("[data-player-quick-menu]");
      if (!closestPanel) {
        setPayload(undefined);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [payload]);

  const { left, top } = useMemo(() => {
    if (!payload) {
      return { left: -9999, top: -9999 };
    }

    const padding = 12;
    const computedLeft = Math.min(
      window.innerWidth - MENU_WIDTH - padding,
      Math.max(padding, payload.position.x + 8),
    );
    const computedTop = Math.min(
      window.innerHeight - MENU_HEIGHT - padding,
      Math.max(padding, payload.position.y + 8),
    );

    return { left: computedLeft, top: computedTop };
  }, [payload]);

  if (!payload) return null;

  return (
    <InnerPanel
      className={classNames(
        "fixed z-50 w-[176px] p-2 flex flex-col gap-2 text-sm",
      )}
      style={{ left, top }}
      data-player-quick-menu
    >
      <div className="text-xs text-center uppercase tracking-wide">
        {payload.targetUsername
          ? `${payload.targetUsername} (#${payload.targetFarmId})`
          : `#${payload.targetFarmId}`}
      </div>
      {payload.options.map((option) => (
        <button
          key={option.id}
          className="bg-brown-400 hover:bg-brown-300 text-white text-xs py-1 px-2 rounded-md transition-colors"
          onClick={() => {
            setPayload(undefined);
            option.action();
          }}
        >
          {option.label}
        </button>
      ))}
    </InnerPanel>
  );
};
