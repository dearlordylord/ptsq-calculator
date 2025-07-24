import { describe, it, expect } from "vitest";
import { greet } from "./index.js";

describe("hello-world", () => {
  it("should greet properly", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  it("should greet with custom name", () => {
    expect(greet("PTSQ")).toBe("Hello, PTSQ!");
  });
});