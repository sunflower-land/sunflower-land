import { portal } from "./portal";
import { ERRORS } from "lib/errors";
import { getApiErrorDetail } from "lib/apiError";

// jsdom has no global Response; this is the shape apiError and portal read.
const respond = (status: number, body: unknown) => {
  const response = {
    status,
    headers: { get: () => null },
    json: async () => body,
    clone: () => response,
  };

  return response;
};

describe("portal", () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;
  const request = {
    portalId: "chicken-rescue",
    token: "jwt",
    farmId: 1,
    skipCache: true,
  };

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("throws the maintenance code for a maintenance 503", async () => {
    fetchMock.mockResolvedValue(
      respond(503, { message: "Temporary maintenance" }),
    );

    await expect(portal(request)).rejects.toMatchObject({
      message: ERRORS.MAINTENANCE,
      status: 503,
    });
  });

  it("throws the unauthorized code for a 401", async () => {
    fetchMock.mockResolvedValue(respond(401, {}));

    await expect(portal(request)).rejects.toMatchObject({
      message: ERRORS.UNAUTHORIZED,
      status: 401,
    });
  });

  it("throws the portal login code with the status for other failures", async () => {
    fetchMock.mockResolvedValue(respond(500, {}));

    const error = await portal(request).catch((e) => e);

    expect(error.message).toBe(ERRORS.PORTAL_LOGIN_ERROR);
    expect(getApiErrorDetail(error)).toMatchObject({
      code: ERRORS.PORTAL_LOGIN_ERROR,
      status: 500,
      endpoint: "POST /portal/chicken-rescue/login",
    });
  });
});
