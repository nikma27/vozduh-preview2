import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  it("рендерит детей, когда ошибок нет", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Контент</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId("child").textContent).toBe("Контент");
  });

  it("показывает fallback UI при ошибке в ребёнке", () => {
    const ThrowError = () => {
      throw new Error("Тестовая ошибка");
    };
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Что-то пошло не так")).toBeTruthy();
    expect(screen.getByRole("button", { name: /обновить/i })).toBeTruthy();
  });
});
