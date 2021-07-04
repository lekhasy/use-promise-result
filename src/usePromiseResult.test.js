import { renderHook } from "@testing-library/react-hooks";
import { usePromiseResult } from "./usePromiseResult";

describe("usePromiseResult", () => {
  it("should fetch and have correct loading flags", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      usePromiseResult(async () => {
        return 123;
      })
    );

    await waitForNextUpdate();

    expect(result.all[0]).toStrictEqual({
      ...result.all[0],
      loading: true,
      data: null,
      error: null,
      success: false,
    });
  });

  it("should fetch and return correct response", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      usePromiseResult(async () => {
        return 123;
      })
    );

    await waitForNextUpdate();

    expect(result.current).toStrictEqual({
      ...result.current,
      loading: false,
      data: 123,
      error: null,
      success: true,
    });
  });

  it("should have correct flag on error", async () => {
    const error = new Error("Unknow error");

    const { result, waitForNextUpdate } = renderHook(() =>
      usePromiseResult(async () => {
        throw error;
      })
    );

    await waitForNextUpdate();

    expect(result.current).toStrictEqual({
      ...result.current,
      loading: false,
      data: null,
      error: error,
      success: false,
    });
  });
});
