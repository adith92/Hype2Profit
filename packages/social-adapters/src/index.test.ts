import { describe, expect, it } from "vitest";
import { MockSocialSearchProvider, getSocialSearchProvider } from "./index";

describe("social adapters", () => {
  it("MockSocialSearchProvider returns deterministic result", async () => {
    const provider = new MockSocialSearchProvider();
    const result = await provider.searchPublicConversation({ category: "Fashion", keyword: "Tas Padel", platform: "mock" });
    expect(result.summary.relatedKeywords).toContain("tas padel");
  });

  it("getSocialSearchProvider defaults to mock", () => {
    const provider = getSocialSearchProvider();
    expect(provider.provider).toBe("mock");
  });
});
