import { buildUserMessage, SYSTEM_PROMPT, type TargetLanguage } from "./prompt";
import {
  getOutputText,
  parseTranslations,
  type ModelResponse,
} from "./response";
import type { ReferenceTerm, ReturnedTranslation } from "./terms";
import type { CodeSnippet } from "./usages";

// The model the repo's other OpenAI workflows use.
export const MODEL = "gpt-5.6-sol";

const API_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

// How many times one request is sent before giving up on a rate limit, a
// server error or a dropped connection.
const MAX_REQUEST_ATTEMPTS = 5;

const TRANSLATIONS_SCHEMA = {
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          text: { type: "string" },
        },
        required: ["key", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["translations"],
  additionalProperties: false,
};

/** An error answer from the API, with its HTTP status. */
export class OpenAIError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

type Usage = {
  input_tokens?: number;
  output_tokens?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createResponse(
  body: unknown,
): Promise<ModelResponse & { usage?: Usage }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new OpenAIError("OPENAI_API_KEY is not set", 401);

  for (let attempt = 1; ; attempt++) {
    let response: Response | undefined;
    try {
      response = await fetch(`${API_URL}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      if (attempt >= MAX_REQUEST_ATTEMPTS) throw error;
    }

    if (response?.ok) return response.json();

    if (response) {
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt >= MAX_REQUEST_ATTEMPTS) {
        throw new OpenAIError(
          `OpenAI ${response.status}: ${await response.text()}`,
          response.status,
        );
      }
    }

    await sleep(2 ** attempt * 1000);
  }
}

/**
 * Asks the model to translate the terms into one language. Returns what it
 * sent back, unchecked, with the tokens the request used.
 */
export async function requestTranslations(
  language: TargetLanguage,
  terms: Record<string, string>,
  references: ReferenceTerm[],
  usages: Record<string, CodeSnippet[]> = {},
): Promise<{
  translations: ReturnedTranslation[];
  inputTokens: number;
  outputTokens: number;
}> {
  const response = await createResponse({
    model: MODEL,
    max_output_tokens: 32000,
    reasoning: { effort: "medium" },
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildUserMessage(language, terms, references, usages),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "translations",
        schema: TRANSLATIONS_SCHEMA,
        strict: true,
      },
    },
  });

  return {
    translations: parseTranslations(getOutputText(response)),
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
  };
}
