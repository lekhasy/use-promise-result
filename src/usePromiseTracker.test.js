import { expect } from "@jest/globals";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";

import { usePromiseTracker } from "./usePromiseTracker";

it("should return correct flag when nothing tracked", () => {
  const { result } = renderHook(() => usePromiseTracker());
  expect(result.current).toMatchObject({
    loading: false,
    success: false,
    data: null,
    error: null,
    tracking: false,
  });

  expect(result.current.track instanceof Function).toBeTruthy();
});

it("should return correct flag when initial promise provided", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    usePromiseTracker(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 1);
      })
    )
  );

  await waitForNextUpdate();

  expect(result.current).toMatchObject({
    loading: false,
    success: true,
    data: 1,
    error: null,
    tracking: true,
  });

  expect(result.current.track instanceof Function).toBeTruthy();
});

describe("first request success", () => {
  it("should start track the promise and return correct flag", async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePromiseTracker());

    act(() =>
      result.current.track(
        new Promise((resolve) => {
          setTimeout(resolve(1), 500);
        })
      )
    );

    expect(result.current).toMatchObject({
      loading: true,
      success: false,
      data: null,
      error: null,
      tracking: true,
    });

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      loading: false,
      success: true,
      data: 1,
      error: null,
      tracking: true,
    });
  });
  it("should return correct flags when second request fail", async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePromiseTracker());

    act(() =>
      result.current.track(
        new Promise((resolve) => {
          setTimeout(resolve(1), 1);
        })
      )
    );

    await waitForNextUpdate();

    // first request success
    expect(result.current).toMatchObject({
      loading: false,
      success: true,
      data: 1,
      error: null,
      tracking: true,
    });

    const error = new Error("Interesting reason");

    act(() =>
      result.current.track(
        new Promise((_, reject) => {
          setTimeout(reject(error), 1);
        })
      )
    );

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      loading: false,
      success: false,
      data: null,
      error: error,
      tracking: true,
    });
  });
});

describe("first request fail", () => {
  it("should return error for fail case", async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePromiseTracker());

    const error = new Error("Interesting reason");

    act(() =>
      result.current.track(
        new Promise((_, reject) => {
          setTimeout(reject(error), 1);
        })
      )
    );

    expect(result.current).toMatchObject({
      loading: true,
      success: false,
      data: null,
      error: null,
      tracking: true,
    });

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      loading: false,
      success: false,
      data: null,
      error: error,
      tracking: true,
    });
  });
  it("should return correct flags when second request success", async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      usePromiseTracker()
    );

    const error = new Error("Interesting reason");

    act(() =>
      result.current.track(
        new Promise((_, reject) => {
          setTimeout(reject(error), 1);
        })
      )
    );

    await waitForValueToChange(() => result.current.loading);

    // first request fail
    expect(result.current).toMatchObject({
      loading: false,
      success: false,
      data: null,
      error: error,
      tracking: true,
    });

    act(() =>
      result.current.track(
        new Promise((resolve) => {
          setTimeout(resolve(1), 1);
        })
      )
    );

    await waitForValueToChange(() => result.current.loading);
    expect(result.current).toMatchObject({
      loading: false,
      success: true,
      data: 1,
      error: null,
      tracking: true,
    });
  });
});

it("should discard the first request when the second request come right after", async () => {
  const { result, waitForValueToChange, waitFor } = renderHook(() =>
    usePromiseTracker()
  );

  act(() =>
    result.current.track(
      new Promise((resolve) => {
        setTimeout(resolve("first"), 1);
      })
    )
  );

  act(() =>
    result.current.track(
      new Promise((resolve) => {
        setTimeout(resolve("second"), 100);
      })
    )
  );

  await waitFor(() => result.current.data === "second");

  // there are none of the results that have data of the first request
  expect(!result.all.some((r) => r.data === "first")).toBeTruthy();
});
