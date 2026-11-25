import { getOutputText, parseTranslations } from "./response";

const ANSWER = '{"translations":[{"key":"hello","text":"Hallo"}]}';

const message = (
  ...content: { type: string; text?: string; refusal?: string }[]
) => ({
  type: "message",
  content,
});

describe("getOutputText", () => {
  it("returns the text of the answer", () => {
    const text = getOutputText({
      status: "completed",
      output: [message({ type: "output_text", text: ANSWER })],
    });

    expect(text).toEqual(ANSWER);
  });

  it("ignores items that are not the message", () => {
    const text = getOutputText({
      status: "completed",
      output: [
        { type: "reasoning" },
        message({ type: "output_text", text: ANSWER }),
      ],
    });

    expect(text).toEqual(ANSWER);
  });

  it("joins an answer that arrives in several parts", () => {
    const text = getOutputText({
      status: "completed",
      output: [
        message(
          { type: "output_text", text: ANSWER.slice(0, 10) },
          { type: "output_text", text: ANSWER.slice(10) },
        ),
      ],
    });

    expect(text).toEqual(ANSWER);
  });

  it("throws when the model refused", () => {
    expect(() =>
      getOutputText({
        status: "completed",
        output: [
          message({ type: "refusal", refusal: "I can't help with that" }),
        ],
      }),
    ).toThrow("Refused: I can't help with that");
  });

  it("throws when the answer was cut off", () => {
    expect(() =>
      getOutputText({
        status: "incomplete",
        incomplete_details: { reason: "max_output_tokens" },
        output: [message({ type: "output_text", text: '{"transl' })],
      }),
    ).toThrow("Response incomplete: max_output_tokens");
  });

  it("throws when there is no answer", () => {
    expect(() => getOutputText({ status: "completed", output: [] })).toThrow(
      "Response had no text",
    );
  });
});

describe("parseTranslations", () => {
  it("reads the translations from the answer", () => {
    expect(parseTranslations(ANSWER)).toEqual([
      { key: "hello", text: "Hallo" },
    ]);
  });

  it("throws when the answer is cut off", () => {
    expect(() => parseTranslations('{"translations":[{"key":"he')).toThrow(
      "Response was not valid JSON",
    );
  });

  it("throws when the answer is empty", () => {
    expect(() => parseTranslations("")).toThrow("Response was not valid JSON");
  });

  it("throws when the answer has no list of translations", () => {
    expect(() => parseTranslations('{"hello":"Hallo"}')).toThrow(
      "Response had no translations",
    );
  });

  it("drops entries that are not a key and a text", () => {
    const translations = parseTranslations(
      '{"translations":[{"key":"hello","text":"Hallo"},{"key":"bye"},"x",null]}',
    );

    expect(translations).toEqual([{ key: "hello", text: "Hallo" }]);
  });
});
