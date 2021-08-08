import { renderHook, act } from "@testing-library/react-hooks";
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
      reloadCount: 1,
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
      reloadCount: 1,
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

  it("should return false for reloadCount if initFetch set to false", () => {
    const { result } = renderHook(() =>
      usePromiseResult(async () => {
        return 1;
      }, false)
    );

    expect(result.current).toStrictEqual({
      ...result.current,
      reloadCount: 0,
    });
  });

  it("should call to success callback on resolve", async () => {
    const successHandler = jest.fn(() => {});

    const { result, waitForValueToChange } = renderHook(() =>
      usePromiseResult(async () => {
        return 1;
      }, false)
    );

    act(() => result.current.reload({ onSuccess: successHandler }));

    await waitForValueToChange(() => result.current.success);

    expect(successHandler).toBeCalledTimes(1);
  });

  it("should call to error callback on reject", async () => {
    const errorHandler = jest.fn(() => {});

    const { result, waitForValueToChange } = renderHook(() =>
      usePromiseResult(async () => {
        throw new Error();
      }, false)
    );

    act(() => result.current.reload({ onError: errorHandler }));

    await waitForValueToChange(() => result.current.error);

    expect(errorHandler).toBeCalledTimes(1);
  });
});
