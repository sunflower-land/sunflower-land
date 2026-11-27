import { buildUserMessage, SYSTEM_PROMPT } from "./prompt";

const stringsIn = (message: string) =>
  JSON.parse(/<strings>\n([\s\S]*)\n<\/strings>/.exec(message)?.[1] ?? "null");

describe("buildUserMessage", () => {
  it("sends the code that uses a string along with it", () => {
    const message = buildUserMessage("de", { clear: "Clear" }, [], {
      clear: [{ file: "src/Panel.tsx", code: '<Button>{t("clear")}</Button>' }],
    });

    expect(stringsIn(message)).toEqual([
      {
        key: "clear",
        text: "Clear",
        usedIn: [
          { file: "src/Panel.tsx", code: '<Button>{t("clear")}</Button>' },
        ],
      },
    ]);
  });

  it("leaves usedIn out for a string the code doesn't use as written", () => {
    const message = buildUserMessage("de", { clear: "Clear" }, [], {
      clear: [],
    });

    expect(stringsIn(message)).toEqual([{ key: "clear", text: "Clear" }]);
  });

  it("works without any code", () => {
    const message = buildUserMessage("de", { clear: "Clear" });

    expect(stringsIn(message)).toEqual([{ key: "clear", text: "Clear" }]);
  });
});

describe("SYSTEM_PROMPT", () => {
  it("explains the code sent with a string", () => {
    expect(SYSTEM_PROMPT).toContain("usedIn");
  });

  it("asks for the target language's number separators", () => {
    expect(SYSTEM_PROMPT).not.toMatch(/numbers and symbols .* as they are/);
    expect(SYSTEM_PROMPT).toContain('"7.500" in German');
  });
});
