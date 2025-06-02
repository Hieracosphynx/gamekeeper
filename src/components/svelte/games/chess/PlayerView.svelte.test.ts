import { render, screen } from "@testing-library/svelte";
import { writable } from "svelte/store";
import { describe, it, expect, beforeEach, vi } from "vitest";

import PlayerView from "./PlayerView.svelte";
import { getReadablePosition, PieceType } from "./types";

// Mock confirm dialog
const mockConfirm = vi.fn();
Object.defineProperty(window, "confirm", {
  value: mockConfirm,
  writable: true,
});

describe("PlayerView", () => {
  beforeEach(() => {
    mockConfirm.mockClear();
  });

  it("renders the chess player view with title", () => {
    render(PlayerView);

    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("renders the move and piece", () => {
    const move = writable(getReadablePosition(0, 2));
    const chessPiece = writable(PieceType.PAWN);
    render(PlayerView, { move, chessPiece });

    expect(screen.getByText("a3")).toBeInTheDocument();
  });

  it("renders all moves", () => {
    const moves = writable<string[]>([]);

    for (let index = 0; index < 5; index++) {
      const newMove = getReadablePosition(index, index + 1);
      moves.update((move) => [...move, newMove]);
    }

    render(PlayerView, { moves });

    expect(screen.getByText("a2")).toBeInTheDocument();
    expect(screen.getByText("b3")).toBeInTheDocument();
    expect(screen.getByText("c4")).toBeInTheDocument();
    expect(screen.getByText("d5")).toBeInTheDocument();
    expect(screen.getByText("e6")).toBeInTheDocument();
  });

  //it("renders the player and moves", () => {
  //      const playersAndMoves = writable<Record<string, string>[]>([]);

  //});
});
