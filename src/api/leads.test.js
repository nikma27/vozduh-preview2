import { describe, it, expect } from "vitest";
import {
  formatPhoneInput,
  isValidPhone,
  sanitizeText,
  postLead,
} from "./leads";

describe("leads", () => {
  it("форматирует телефонный номер к виду +7 (XXX) XXX-XX-XX", () => {
    expect(formatPhoneInput("89991234567")).toBe("+7 (999) 123-45-67");
    expect(formatPhoneInput("79991234567")).toBe("+7 (999) 123-45-67");
    expect(formatPhoneInput("9991234567")).toBe("+7 (999) 123-45-67");
    expect(formatPhoneInput("")).toBe("");
  });

  it("валидирует длину телефонного номера", () => {
    expect(isValidPhone("+7 (999) 123-45-67")).toBe(true);
    expect(isValidPhone("89130001122")).toBe(true);
    expect(isValidPhone("+7 (999) 123")).toBe(false);
    expect(isValidPhone("abc")).toBe(false);
  });

  it("очищает входные строки от XSS-тегов и управляющих символов", () => {
    expect(sanitizeText("<script>alert(1)</script>Иван\u0000")).toBe(
      "scriptalert(1)/scriptИван"
    );
  });

  it("тихо отсекает ботов при заполненном honeypot-поле (hp)", async () => {
    const res = await postLead({
      type: "contact",
      name: "Bot",
      phone: "+7 (999) 000-00-00",
      hp: "http://spam.com",
    });
    expect(res).toEqual({ ok: true, mocked: true });
  });
});
