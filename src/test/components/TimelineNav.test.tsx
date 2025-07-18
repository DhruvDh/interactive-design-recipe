import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TimelineNav } from "../../components/navigation/TimelineNav";

// Mock the hooks
vi.mock("../../hooks/useYjs", () => ({
  useStatusDoc: vi.fn(() => null),
  useYMap: vi.fn(() => [new Map(), vi.fn()]),
}));

// Wrapper component with router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("TimelineNav", () => {
  it("should render all navigation items", () => {
    render(
      <RouterWrapper>
        <TimelineNav />
      </RouterWrapper>
    );

    // Check that key navigation items are rendered
    expect(screen.getByText("Select Project")).toBeInTheDocument();
    expect(screen.getByText("Project Overview")).toBeInTheDocument();
    expect(screen.getByText("Step 0 — Restate")).toBeInTheDocument();
    expect(screen.getByText("Step 1 — Data Definitions")).toBeInTheDocument();
    expect(
      screen.getByText("Step 2 — Signature & Purpose")
    ).toBeInTheDocument();
    expect(screen.getByText("Step 3 — Examples & Tests")).toBeInTheDocument();
    expect(screen.getByText("Step 4 — Skeleton")).toBeInTheDocument();
    expect(
      screen.getByText("Step 5 — Implementation Notes")
    ).toBeInTheDocument();
    expect(screen.getByText("Finalise Submission")).toBeInTheDocument();
  });

  it("should have correct data-testid attributes", () => {
    render(
      <RouterWrapper>
        <TimelineNav />
      </RouterWrapper>
    );

    // Check that test IDs are present
    expect(screen.getByTestId("timeline-nav")).toBeInTheDocument();
    expect(screen.getByTestId("nav-select")).toBeInTheDocument();
    expect(screen.getByTestId("nav-overview")).toBeInTheDocument();
    expect(screen.getByTestId("nav-step0")).toBeInTheDocument();
    expect(screen.getByTestId("nav-step1")).toBeInTheDocument();
    expect(screen.getByTestId("nav-final")).toBeInTheDocument();
  });

  it("should group navigation items by category", () => {
    render(
      <RouterWrapper>
        <TimelineNav />
      </RouterWrapper>
    );

    // Check that categories are rendered
    expect(screen.getByText("Project")).toBeInTheDocument();
    expect(screen.getByText("Design Recipe")).toBeInTheDocument();
    expect(screen.getByText("Finish")).toBeInTheDocument();
  });
});
