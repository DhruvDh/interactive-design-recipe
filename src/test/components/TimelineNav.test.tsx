import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TimelineNav } from "../../components/navigation/TimelineNav";
import { navItems } from "../../constants/navigation";

// Mock the hooks
vi.mock("../../hooks/useYjs", () => ({
  useStatusDoc: vi.fn(() => null),
  useYMap: vi.fn(() => [new Map(), vi.fn()]),
}));

// Silence React key warnings within these tests
beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((msg, ...args) => {
    if (
      typeof msg === "string" &&
      msg.includes("Each child in a list should have a unique \"key\"")
    ) {
      return;
    }
    console.error(msg, ...args);
  });
});

// Wrapper component with router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("TimelineNav", () => {
  it("renders all navigation labels", () => {
    render(
      <RouterWrapper>
        <TimelineNav />
      </RouterWrapper>
    );

    navItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("exposes the top-level test id", () => {
    render(
      <RouterWrapper>
        <TimelineNav />
      </RouterWrapper>
    );

    expect(screen.getByTestId("timeline-nav")).toBeInTheDocument();
  });

  it("renders items in the declared order", () => {
    render(
      <RouterWrapper>
        <TimelineNav />
      </RouterWrapper>
    );

    const renderedTexts = screen
      .getAllByRole("link")
      .map((n) => n.textContent?.trim());

    expect(renderedTexts).toEqual(navItems.map((i) => i.name));
  });
});
