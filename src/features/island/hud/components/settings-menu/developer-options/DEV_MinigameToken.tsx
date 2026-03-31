import React, { useState } from "react";
import clipboard from "clipboard";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ContentComponentProps } from "../GameOptions";
import { useAuth } from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import { portal } from "features/world/ui/community/actions/portal";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { useSound } from "lib/utils/hooks/useSound";

export const DEV_MinigameToken: React.FC<ContentComponentProps> = () => {
  const { authState } = useAuth();
  const { gameState } = useGame();
  const copypaste = useSound("copypaste");

  const sessionToken = authState.context.user.rawToken as string | undefined;
  const farmId = gameState.context.farmId;

  const [portalId, setPortalId] = useState<MinigameName>("chicken-rescue-v2");
  const [minigameToken, setMinigameToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setError(null);
    setMinigameToken("");
    if (!sessionToken) {
      setError("Not signed in.");
      return;
    }
    if (!farmId) {
      setError("No farm loaded.");
      return;
    }
    setLoading(true);
    try {
      const { token } = await portal({
        portalId,
        token: sessionToken,
        farmId,
        skipCache: true,
      });
      setMinigameToken(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch token");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (!minigameToken) return;
    clipboard.copy(minigameToken);
    copypaste.play();
  };

  return (
    <div className="p-1 flex flex-col gap-2 max-w-md">
      <p className="text-xs text-gray-700">
        {
          "Uses the existing portal login request (minigame-scoped JWT). Copy and paste into local minigame dev URLs as"
        }{" "}
        <code className="text-xxs bg-gray-200 px-0.5 rounded">{"jwt=…"}</code>
        {"."}
      </p>

      <div className="flex flex-col gap-1">
        <Label type="default">{"Minigame"}</Label>
        <select
          className="text-sm p-1 border-2 border-gray-400 rounded bg-white"
          value={portalId}
          onChange={(e) => setPortalId(e.target.value as MinigameName)}
          disabled={loading}
        >
          {SUPPORTED_MINIGAMES.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      <Button className="p-1" onClick={generate} disabled={loading}>
        <span>{loading ? "Generating…" : "Generate token"}</span>
      </Button>

      {error && (
        <p className="text-xs text-red-600 break-words" role="alert">
          {error}
        </p>
      )}

      {minigameToken && (
        <div className="flex flex-col gap-1">
          <Label type="default">{"Token"}</Label>
          <textarea
            readOnly
            className="text-xxs font-mono p-1 border-2 border-gray-400 rounded bg-gray-50 w-full min-h-[120px] break-all"
            value={minigameToken}
            aria-label="Minigame JWT"
          />
          <Button className="p-1" type="button" onClick={copyToken}>
            <span>{"Copy to clipboard"}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
