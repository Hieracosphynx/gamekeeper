export const row = [1, 2, 3, 4, 5, 6, 7, 8]; // Rank
export const column = ["a", "b", "c", "d", "e", "f", "g", "h"]; // File

export type PlayerMoveType = {
  player: string;
  move: string;
};

export enum PieceType {
  PAWN = "pawn", // 1
  KNIGHT = "knight", // 3
  BISHOP = "bishop", // 3
  ROOK = "rook", // 5
  QUEEN = "queen", // 9
  KING = "king", // No point value
}

export const getReadablePosition = (
  colIndex: number,
  rowIndex: number
): string => `${column[colIndex]}${row[rowIndex]}`;
