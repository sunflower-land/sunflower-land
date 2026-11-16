import { apiError, createApiError, getApiErrorDetail } from "./apiError";
import { ERRORS } from "./errors";
import { buildErrorReport, isExpectedErrorCode } from "./errorLogger";

const response = ({
  status,
  body,
  headers = {},
}: {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}) =>
  ({
    status,
    headers: new Headers(headers),
    clone: () => ({
      json: async () => {
        if (body === undefined) throw new SyntaxError("Unexpected end of JSON");

        return body;
      },
    }),
  }) as unknown as Response;

describe("apiError", () => {
  it("keeps the status, endpoint and transaction id of the failed request", async () => {
    const error = await apiError(response({ status: 500 }), {
      endpoint: "GET /marketplace",
      transactionId: "tx-1",
      meta: { filters: "resources" },
    });

    expect(error.message).toBe(ERRORS.FAILED_REQUEST);
    expect(error.code).toBe(ERRORS.FAILED_REQUEST);
    expect(error.status).toBe(500);
    expect(error.endpoint).toBe("GET /marketplace");
    expect(error.transactionId).toBe("tx-1");
    expect(error.meta).toMatchObject({ filters: "resources" });
  });

  it("attaches client context that a status code cannot show", async () => {
    const error = await apiError(response({ status: 502 }), {
      endpoint: "GET /marketplace",
    });

    // The signer state is the one that matters on mobile WebViews.
    expect(error.meta).toMatchObject({ signer: expect.any(String) });
    expect(error.meta).toHaveProperty("online");
    expect(error.meta).toHaveProperty("visibility");
  });

  it("prefers the code the backend returned", async () => {
    const error = await apiError(
      response({ status: 400, body: { errorCode: "TRADE_NOT_FOUND" } }),
      { endpoint: "GET /collection/:type/:id" },
    );

    expect(error.code).toBe("TRADE_NOT_FOUND");
    expect(error.status).toBe(400);
  });

  it("maps an expired session to UNAUTHORIZED so it is not reported", async () => {
    const error = await apiError(response({ status: 401 }), {
      endpoint: "GET /marketplace",
    });

    expect(error.code).toBe(ERRORS.UNAUTHORIZED);
    expect(isExpectedErrorCode(error.code)).toBe(true);
  });

  it("still reports an unexpected 403 rather than treating it as a login problem", async () => {
    const error = await apiError(response({ status: 403 }), {
      endpoint: "GET /marketplace",
    });

    expect(error.code).toBe(ERRORS.FAILED_REQUEST);
    expect(isExpectedErrorCode(error.code)).toBe(false);
  });

  it("maps throttling to the existing rate limit code", async () => {
    const error = await apiError(response({ status: 429 }), {
      endpoint: "GET /marketplace",
    });

    expect(error.code).toBe(ERRORS.TOO_MANY_REQUESTS);
  });

  it("survives a response body that is not JSON", async () => {
    const error = await apiError(response({ status: 504 }), {
      endpoint: "GET /marketplace",
    });

    expect(error.code).toBe(ERRORS.FAILED_REQUEST);
    expect(error.status).toBe(504);
  });

  it("falls back to correlation ids the response carries", async () => {
    const error = await apiError(
      response({
        status: 500,
        headers: {
          "x-transaction-id": "server-tx",
          "x-amzn-requestid": "amzn-1",
        },
      }),
      { endpoint: "GET /marketplace" },
    );

    expect(error.transactionId).toBe("server-tx");
    expect(error.meta).toMatchObject({ requestId: "amzn-1" });
  });
});

describe("getApiErrorDetail", () => {
  it("reads the detail back off an error rethrown through a boundary", () => {
    const thrown: unknown = createApiError({
      code: ERRORS.FAILED_REQUEST,
      status: 500,
      endpoint: "GET /marketplace",
      transactionId: "tx-1",
    });

    expect(getApiErrorDetail(thrown)).toMatchObject({
      code: ERRORS.FAILED_REQUEST,
      status: 500,
      endpoint: "GET /marketplace",
      transactionId: "tx-1",
    });
  });

  it("ignores errors that carry no detail", () => {
    expect(getApiErrorDetail(new Error("FAILED_REQUEST"))).toBeUndefined();
    expect(getApiErrorDetail(undefined)).toBeUndefined();
  });

  it("produces a support row that says which request failed", async () => {
    const error = await apiError(response({ status: 500 }), {
      endpoint: "GET /marketplace",
      transactionId: "tx-1",
      meta: { filters: "resources" },
    });

    const report = buildErrorReport("react_error_modal", 1, {
      error: error.message,
      ...getApiErrorDetail(error),
    });

    expect(report).toMatchObject({
      code: ERRORS.FAILED_REQUEST,
      status: 500,
      endpoint: "GET /marketplace",
      transactionId: "tx-1",
    });
    expect(report.meta).toMatchObject({ filters: "resources" });
  });
});
