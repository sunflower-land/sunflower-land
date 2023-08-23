import { serializeError } from "serialize-error";
import { CONFIG } from "./config";

type Source =
  | "phaser_preloader_scene"
  | "phaser_base_scene"
  | "react_error_modal";

export const createErrorLogger = (source: Source, farmId: number) => {
  let errorsEmitted = 3;

  return async (error: any) => {
    if (errorsEmitted-- <= 0) return;

    await fetch(`${CONFIG.API_URL}/support/errors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source,
        farmId,
        error: serializeError(error),
      }),
    });
  };
};
