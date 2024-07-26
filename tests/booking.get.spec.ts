
//COVERAGE_TAG: GET /booking/summary

import { test, expect } from "@playwright/test";
import { isValidDate } from "@helpers/date";
import { createHeaders, createInvalidHeaders } from "@helpers/createHeaders";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { addWarning } from "@helpers/warnings";

test.describe("booking/ GET requests", async () => {
  let headers;
  let invalidHeader;

  test.beforeAll(async () => {
    headers = await createHeaders();
    invalidHeader = await createInvalidHeaders();
  });

  test("GET booking summary with specific room id", async ({ request }) => {
    const response = await request.get("booking/summary?roomid=1");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    expect(isValidDate(body.bookings[0].bookingDates.checkin)).toBe(true);
    expect(isValidDate(body.bookings[0].bookingDates.checkout)).toBe(true);

    await validateJsonSchema("GET_booking_summary", "booking", body, true);
  });
});
