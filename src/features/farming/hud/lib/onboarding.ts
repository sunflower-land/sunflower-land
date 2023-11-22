import { useActor } from "@xstate/react";
import { Context } from "features/auth/lib/Provider";
import { useContext } from "react";

export function useIsNewFarm() {
  const { authService } = useContext(Context);
  const [{ history }] = useActor(authService);

  if (history?.event.type === "CREATE_FARM") {
    // Translation needed
    return true;
  }

  return false;
}
