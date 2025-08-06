import { expect, test } from "vitest";
import { uriToRkey } from "../lib/utils";

test("should throw if invalid at uri is passed in", () => {
	expect(() => uriToRkey("test")).toThrowError("get rkey");
});

test("should pass if valid at uri is passed in", () => {
	expect(
		uriToRkey(
			"at://did:plc:qttsv4e7pu2jl3ilanfgc3zn/pub.leaflet.document/3lvl7m6jd4s2e",
		),
	).toBe("3lvl7m6jd4s2e");
});
