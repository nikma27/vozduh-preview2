import { describe, it, expect } from "vitest";
import { formatPhoneInput, isValidPhone, postLead } from "./leads";

describe("leads helpers & API", () => {
  it("форматирует российский номер телефона к маске +7 (XXX) XXX-XX-XX", () => {
    expect(formatPhoneInput("89131234567")).toBe("+7 (913) 123-45-67");
    expect(formatPhoneInput("79131234567")).toBe("+7 (913) 123-45-67");
    expect(formatPhoneInput("9131234567")).toBe("+7 (913) 123-45-67");
    expect(formatPhoneInput("")).toBe("");
  });

  it("валидирует длину телефонного номера", () => {
    expect(isValidPhone("+7 (913) 123-45-67")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });

  it("блокирует спам при заполненном honeypot-поле", async () => {
    const res = await postLead({
      type: "lead",
      name: "Bot",
      phone: "123",
      hp: "http://spam.example",
    });
    expect(res).toEqual({ ok: true, mocked: true });
  });

  it("отклоняет заявку с некорректным телефоном", async () => {
    await expect(
      postLead({
        type: "lead",
        name: "Иван",
        phone: "123",
      })
    ).rejects.toThrow(/корректный номер телефона/i);
  });
});
