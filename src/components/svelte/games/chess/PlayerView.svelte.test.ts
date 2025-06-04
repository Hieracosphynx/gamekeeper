import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import { writable } from "svelte/store";
import { describe, it, expect, beforeEach, vi } from "vitest";

import PlayerView from "./PlayerView.svelte";
import { getReadablePosition, PieceType } from "./utils";

import type { StandardMoveSet, KingMoveSet, RookMoveSet } from "./utils";

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

  it("renders the player, piece, and moves", () => {
    const playerMoveSet = writable<StandardMoveSet[]>([]);

    for (let index = 0; index < 2; index++) {
      const newPlayer1Move: StandardMoveSet = {
        player: "Player 1",
        piece: PieceType.ROOK,
        take: false,
        move: getReadablePosition(index, index + 1),
        capturedPiece: undefined,
      };
      const newPlayer2Move: StandardMoveSet = {
        player: "Player 2",
        piece: PieceType.BISHOP,
        take: false,
        move: getReadablePosition(index + 1, index),
        capturedPiece: undefined,
      };

      playerMoveSet.update((pm) => [...pm, newPlayer1Move, newPlayer2Move]);
    }

    render(PlayerView, { playerMoveSet });

    const getOnlyText = (txt: string) =>
      screen.getAllByText(txt, { selector: ":not(button)" });

    // Player 1
    expect(getOnlyText("Player 1")).toHaveLength(2);
    expect(getOnlyText("rook")).toHaveLength(2);
    expect(screen.getByText("a2")).toBeInTheDocument();
    expect(screen.getByText("b3")).toBeInTheDocument();

    // Player 2
    expect(getOnlyText("Player 2")).toHaveLength(2);
    expect(getOnlyText("bishop")).toHaveLength(2);
    expect(screen.getByText("b1")).toBeInTheDocument();
    expect(screen.getByText("c2")).toBeInTheDocument();
  });

  it("renders the capture/take event of a piece by a player", () => {
    const playerMoveSet = writable<StandardMoveSet[]>([]);
    const playerMove: StandardMoveSet = {
      player: "Player 1",
      piece: PieceType.BISHOP,
      move: getReadablePosition(2, 1),
      take: true,
      capturedPiece: PieceType.ROOK,
    };

    playerMoveSet.update((pm) => [...pm, playerMove]);

    render(PlayerView, { playerMoveSet });

    expect(
      screen.getByText("Player 1 bishop has taken rook")
    ).toBeInTheDocument();
  });

  it("renders the castling of the player's king and rook", () => {
    const p1KingMoveSet: KingMoveSet = {
      player: "Player 1",
      piece: PieceType.KING,
      take: false,
      capturedPiece: undefined,
      move: getReadablePosition(6, 0),
      isCastling: true,
      castlingType: "kingside",
      isKing: true,
    };
    const p1RookMoveSet: RookMoveSet = {
      player: "Player 1",
      piece: PieceType.ROOK,
      take: false,
      capturedPiece: undefined,
      move: getReadablePosition(5, 0),
      isCastling: true,
      castlingType: "kingside",
    };
    const p2KingMoveSet: KingMoveSet = {
      player: "Player 2",
      piece: PieceType.KING,
      take: false,
      capturedPiece: undefined,
      move: getReadablePosition(5, 7),
      isCastling: true,
      castlingType: "queenside",
      isKing: true,
    };
    const p2RookMoveSet: RookMoveSet = {
      player: "Player 2",
      piece: PieceType.ROOK,
      take: false,
      capturedPiece: undefined,
      move: getReadablePosition(4, 7),
      isCastling: true,
      castlingType: "queenside",
    };

    const playerMoveSet = writable<
      StandardMoveSet[] | KingMoveSet[] | RookMoveSet[]
    >([]);

    playerMoveSet.update((pm) => [
      ...pm,
      p1KingMoveSet,
      p1RookMoveSet,
      p2KingMoveSet,
      p2RookMoveSet,
    ]);

    render(PlayerView, { playerMoveSet });

    expect(
      screen.getByText("Player 1 king castled kingside")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Player 1 rook castled kingside")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Player 2 king castled queenside")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Player 2 rook castled queenside")
    ).toBeInTheDocument();
  });

  it("renders which player lost and won", () => {
    const isGameOver = true;
    const matchLoser = "Player 1";
    const matchWinner = "Player 2";

    render(PlayerView, { matchLoser, matchWinner, isGameOver });

    expect(screen.getByText("Player 1 lost the match!"));
    expect(screen.getByText("Player 2 won the match!"));
  });

  it("renders buttons that selects which piece is moved by the player", () => {
    render(PlayerView);

    const chessPieceBtn = screen.getAllByRole("button");
    const pawnBtn = chessPieceBtn.find(
      (btn) => btn.textContent === PieceType.PAWN
    ) as HTMLButtonElement;
    const knightBtn = chessPieceBtn.find(
      (btn) => btn.textContent === PieceType.KNIGHT
    ) as HTMLButtonElement;
    const bishopBtn = chessPieceBtn.find(
      (btn) => btn.textContent === PieceType.BISHOP
    ) as HTMLButtonElement;
    const rookBtn = chessPieceBtn.find(
      (btn) => btn.textContent === PieceType.ROOK
    ) as HTMLButtonElement;
    const queenBtn = chessPieceBtn.find(
      (btn) => btn.textContent === PieceType.QUEEN
    ) as HTMLButtonElement;
    const kingBtn = chessPieceBtn.find(
      (btn) => btn.textContent === PieceType.KING
    ) as HTMLButtonElement;

    const pressBtnEvent = (btn: HTMLButtonElement) => {
      const text = btn.textContent;
      fireEvent.click(btn);
      waitFor(() => {
        expect(
          screen.getByText(
            `Active Piece: ${PieceType[text as keyof typeof PieceType]}`
          )
        ).toBeInTheDocument();
      });
    };

    pressBtnEvent(pawnBtn);
    pressBtnEvent(bishopBtn);
    pressBtnEvent(knightBtn);
    pressBtnEvent(rookBtn);
    pressBtnEvent(queenBtn);
    pressBtnEvent(kingBtn);
  });

  it("renders a textbox that awaits user input for the move", () => {
    // TODO
  });
});
