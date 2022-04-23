import { renderHook } from "@testing-library/react-hooks";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage hook", () => {
  let localStorage: { [key: string]: string } = {};
  const key = "key";

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      localStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn((key) => localStorage[key]);
  });

  beforeEach(() => {
    localStorage = {};
  });

  afterAll(() => {
    (global.Storage.prototype.setItem as jest.Mock).mockReset();
    (global.Storage.prototype.getItem as jest.Mock).mockReset();
  });

  it("starts with a default string", () => {
    const defaultValue = "defaultValue";

    const { result } = renderHook(() => useLocalStorage(key, defaultValue));
    const [value] = result.current;

    expect(value).toBe(defaultValue);
  });
  it("starts with a default number", () => {
    const defaultValue = 123;

    const { result } = renderHook(() => useLocalStorage(key, defaultValue));
    const [value] = result.current;

    expect(value).toBe(123);
  });
  it("starts with a default boolean", () => {
    const defaultValue = true;

    const { result } = renderHook(() => useLocalStorage(key, defaultValue));
    const [value] = result.current;

    expect(value).toBe(defaultValue);
  });
  it("starts with a default object", () => {
    const defaultValue = { defaultKey: ["1", 2] };

    const { result } = renderHook(() => useLocalStorage(key, defaultValue));
    const [value] = result.current;

    expect(value).toStrictEqual(defaultValue);
  });

  it("updates a string", () => {
    const defaultValue = "defaultValue";
    const updatedValue = "updatedValue";

    const { result } = renderHook(() => useLocalStorage(key, defaultValue));
    const [, setValue] = result.current;

    setValue(updatedValue);
    const [value] = result.current;

    expect(value).toBe(updatedValue);
  });
  it("updates a number", () => {
    const defaultValue = 123;
    const updatedValue = 456;

    const { result } = renderHook(() => useLocalStorage("key", defaultValue));
    const [, setValue] = result.current;

    setValue(updatedValue);
    const [value] = result.current;

    expect(value).toBe(updatedValue);
  });
  it("updates a boolean", () => {
    const defaultValue = true;
    const updatedValue = false;

    const { result } = renderHook(() => useLocalStorage("key", defaultValue));
    const [, setValue] = result.current;

    setValue(updatedValue);
    const [value] = result.current;

    expect(value).toBe(updatedValue);
  });
  it("updates an object", () => {
    type StringStore = { [key: string]: string[] };
    const defaultValue: StringStore = { defaultKey: ["defaultValue"] };
    const updatedValue: StringStore = {
      updatedKey: ["updatedValue1", "updatedValue1"],
    };

    const { result } = renderHook(() => useLocalStorage("key", defaultValue));
    const [, setValue] = result.current;

    setValue(updatedValue);
    const [value] = result.current;

    expect(value).toStrictEqual(updatedValue);
  });
});
