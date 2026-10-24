import { describe, it, expect } from "vitest";
import { round1, pickNearestKW, VENT_PRESETS, AC_PRESETS } from "./presets";

describe("presets", () => {
  it("корректно округляет числа до 1 знака после запятой", () => {
    expect(round1(2.34)).toBe(2.3);
    expect(round1(2.36)).toBe(2.4);
    expect(round1(5)).toBe(5);
  });

  it("подбирает ближайший типоразмер кондиционера по мощности", () => {
    expect(pickNearestKW(1.8).kw).toBe(2.0);
    expect(pickNearestKW(2.4).kw).toBe(2.5);
    expect(pickNearestKW(3.4).kw).toBe(3.5);
    expect(pickNearestKW(4.8).kw).toBe(5.0);
    expect(pickNearestKW(6.8).kw).toBe(7.0);
    expect(pickNearestKW(12.0).kw).toBe(10.0);
  });

  it("содержит валидные пресеты вентиляции и кондиционирования", () => {
    expect(VENT_PRESETS.length).toBeGreaterThan(0);
    expect(AC_PRESETS.length).toBeGreaterThan(0);
    expect(VENT_PRESETS[0]).toHaveProperty("perPerson");
    expect(VENT_PRESETS[0]).toHaveProperty("ach");
  });
});
