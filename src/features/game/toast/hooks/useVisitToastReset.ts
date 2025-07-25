import { Context } from "features/game/GameProvider";
import { useContext } from "react";
import { ToastContext } from "../ToastProvider";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";

export const useVisitToastReset = () => {
  const { gameService } = useContext(Context);
  const { resetToastStates } = useContext(ToastContext);

  useOnMachineTransition(gameService, "visiting", "loading", () => {
    resetToastStates();
  });
};
