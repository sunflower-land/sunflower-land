import { useStepper } from "../useStepper";
import { act, renderHook } from "@testing-library/react-hooks";

describe("useStepper hook", () => {
  it("starts with initial value", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: 8, max: 10, min: 0, step: 1 },
    });

    expect(result.current.value).toBe(8);
  });
  it("increase value", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: 8, max: 10, min: 0, step: 1 },
    });

    act(() => {
      result.current.increase();
    });

    expect(result.current.value).toBe(9);
  });
  it("decrease value", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: 5, max: 10, min: 0, step: 1 },
    });

    act(() => {
      result.current.decrease();
    });

    expect(result.current.value).toBe(4);
  });
  it("decrease stops at min value", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: 1, max: 10, min: 0, step: 1 },
    });

    act(() => {
      result.current.decrease();
    });

    expect(result.current.value).toBe(0);

    act(() => {
      result.current.decrease();
    });

    expect(result.current.value).toBe(0);
  });
  it("increase stops at max value", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: 9, max: 10, min: 0, step: 1 },
    });

    act(() => {
      result.current.increase();
    });

    expect(result.current.value).toBe(10);

    act(() => {
      result.current.increase();
    });

    expect(result.current.value).toBe(10);
  });
  it("initial value cannot be lower than min", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: -9, max: 10, min: 0, step: 1 },
    });

    expect(result.current.value).toBe(0);
  });
  it("initial value cannot be higher than max", () => {
    const { result } = renderHook(useStepper, {
      initialProps: { initial: 11, max: 10, min: 0, step: 1 },
    });

    expect(result.current.value).toBe(10);
  });
});
