import { Tensor } from '@tensorflow/tfjs';
export default class Board {
    height: integer;
    width: integer;
    winLength: integer;
    npPieces: Tensor;
    static readonly DEFAULT_HEIGHT: integer;
    static readonly DEFAULT_WIDTH: integer;
    static readonly DEFAULT_WIN_LENGTH: integer;
    constructor(params: {
        height: integer;
        width: integer;
        winLength: integer;
        npPieces: Tensor;
    });
    addStone(column: integer, player: integer): Promise<void>;
    getValidMoves(): Tensor;
    getWinState(): {
        isEnded: boolean;
        winner: integer;
    };
    private isStraightWinner;
    private isDiagonalWinner;
    withNpPieces(npPieces: Tensor): Board;
    toString(): string;
}
