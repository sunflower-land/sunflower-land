import { getAnswerText, parseTranslations } from "./response";

const ANSWER = '{"translations":[{"key":"hello","text":"Hallo"}]}';

describe("getAnswerText", () => {
  it("returns the text of the answer", () => {
    expect(getAnswerText([{ type: "text", text: ANSWER }])).toEqual(ANSWER);
  });

  it("ignores blocks that are not text", () => {
    const text = getAnswerText([
      { type: "thinking" },
      { type: "text", text: ANSWER },
    ]);

    expect(text).toEqual(ANSWER);
  });

  it("joins an answer that arrives in several text blocks", () => {
    const text = getAnswerText([
      { type: "text", text: ANSWER.slice(0, 10) },
      { type: "text", text: ANSWER.slice(10) },
    ]);

    expect(text).toEqual(ANSWER);
  });

  it("leaves out what a model wrote before it declined", () => {
    const text = getAnswerText([
      { type: "text", text: '{"translations":[{"key":"hello","te' },
      { type: "fallback" },
      { type: "thinking" },
      { type: "text", text: ANSWER },
    ]);

    expect(text).toEqual(ANSWER);
  });

  it("uses the text after the last fallback when there are several", () => {
    const text = getAnswerText([
      { type: "text", text: '{"transl' },
      { type: "fallback" },
      { type: "text", text: '{"translations":[{"key"' },
      { type: "fallback" },
      { type: "text", text: ANSWER },
    ]);

    expect(text).toEqual(ANSWER);
  });

  it("returns nothing when the fallback model wrote no text", () => {
    const text = getAnswerText([
      { type: "text", text: '{"transl' },
      { type: "fallback" },
    ]);

    expect(text).toEqual("");
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
