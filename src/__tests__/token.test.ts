import {
  getToken,
  setToken,
  removeToken,
  hasToken,
  getUserId,
  setUserId,
  removeUserId,
} from "@/utilis/token";

describe("token utilities", () => {
  beforeEach(() => {
    // jsdom already provides window + localStorage; just clear between tests
    window.localStorage.clear();
  });

  test("setToken and getToken work with localStorage", () => {
    expect(getToken()).toBeNull();
    setToken("abc123");
    expect(getToken()).toBe("abc123");
    expect(hasToken()).toBe(true);
  });

  test("removeToken clears token", () => {
    setToken("xyz");
    removeToken();
    expect(getToken()).toBeNull();
    expect(hasToken()).toBe(false);
  });

  test("userId helpers work correctly", () => {
    expect(getUserId()).toBeNull();
    setUserId("user-1");
    expect(getUserId()).toBe("user-1");
    removeUserId();
    expect(getUserId()).toBeNull();
  });
});

