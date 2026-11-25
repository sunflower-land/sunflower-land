import type { ReturnedTranslation } from "./terms";

// The parts of an OpenAI Responses API reply that the script reads.
export type ModelResponse = {
  status?: string;
  incomplete_details?: { reason?: string } | null;
  output?: {
    type: string;
    content?: { type: string; text?: string; refusal?: string }[];
  }[];
};

/**
 * The text of the model's answer. Throws if the reply was cut off, refused or
 * empty, which makes the caller ask again.
 */
export function getOutputText(response: ModelResponse): string {
  if (response.status !== "completed") {
    const reason = response.incomplete_details?.reason ?? "unknown reason";
    throw new Error(`Response ${response.status}: ${reason}`);
  }

  const parts = (response.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? []);

  const refusal = parts.find((part) => part.type === "refusal");
  if (refusal) throw new Error(`Refused: ${refusal.refusal}`);

  const text = parts
    .filter((part) => part.type === "output_text")
    .map((part) => part.text ?? "")
    .join("");
  if (!text) throw new Error("Response had no text");

  return text;
}

function isReturnedTranslation(item: unknown): item is ReturnedTranslation {
  if (typeof item !== "object" || item === null) return false;

  const { key, text } = item as Record<string, unknown>;
  return typeof key === "string" && typeof text === "string";
}

/**
 * Reads the translations out of the answer. Throws if the answer is not the
 * JSON that was asked for, which makes the caller ask again.
 */
export function parseTranslations(answer: string): ReturnedTranslation[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(answer);
  } catch {
    throw new Error("Response was not valid JSON");
  }

  const translations =
    typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>).translations
      : undefined;
  if (!Array.isArray(translations)) {
    throw new Error("Response had no translations");
  }

  return translations.filter(isReturnedTranslation);
}
