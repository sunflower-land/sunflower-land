import type { ReturnedTranslation } from "./terms";

type ContentBlock = { type: string; text?: string };

/**
 * The text of the model's answer.
 *
 * When a model declines part-way through and the API hands the request to a
 * fallback model, the message keeps what the first model had written, then a
 * "fallback" block, then the fallback model's answer. Only the text after the
 * last "fallback" block is the answer.
 */
export function getAnswerText(content: readonly ContentBlock[]): string {
  const lastFallback = content.findLastIndex(
    (block) => block.type === "fallback",
  );

  return content
    .slice(lastFallback + 1)
    .map((block) => (block.type === "text" ? (block.text ?? "") : ""))
    .join("");
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
