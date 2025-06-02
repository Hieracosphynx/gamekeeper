import { render, screen } from "@testing-library/svelte";
import { writable } from "svelte/store";
import { describe, it, expect, beforeEach, vi } from "vitest";

import PlayerView from "./PlayerView.svelte";
import { getReadablePosition, PieceType } from "./utils";

import type { PlayerMoveType } from "./utils";

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

  it("renders the player and moves", () => {
    const playersAndMoves = writable<PlayerMoveType[]>([]);

    for (let index = 0; index < 2; index++) {
      const newPlayer1Move: PlayerMoveType = {
        player: "Player 1",
        move: getReadablePosition(index, index + 1),
      };
      const newPlayer2Move: PlayerMoveType = {
        player: "Player 2",
        move: getReadablePosition(index + 1, index),
      };

      playersAndMoves.update((pm) => [...pm, newPlayer1Move, newPlayer2Move]);
    }

    render(PlayerView, { playersAndMoves });

    // Player 1
    expect(screen.getAllByText("Player 1")).toHaveLength(2);
    expect(screen.getByText("a2")).toBeInTheDocument();
    expect(screen.getByText("b3")).toBeInTheDocument();

    // Player 2
    expect(screen.getAllByText("Player 2")).toHaveLength(2);
    expect(screen.getByText("b1")).toBeInTheDocument();
    expect(screen.getByText("c2")).toBeInTheDocument();
  });
});
