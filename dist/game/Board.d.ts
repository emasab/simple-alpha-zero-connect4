import { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
export default class Board {
    height: integer;
    width: integer;
    win_length: integer;
    np_pieces: Tensor;
    static readonly DEFAULT_HEIGHT: integer;
    static readonly DEFAULT_WIDTH: integer;
    static readonly DEFAULT_WIN_LENGTH: integer;
    constructor(params: any);
    addStone(column: integer, player: integer): Promise<void>;
    getValidMoves(): Tensor<tf.Rank>;
    getWinState(): {
        isEnded: boolean;
        winner: number;
    };
    isStraightWinner(player_pieces: Tensor): boolean;
    isDiagonalWinner(player_pieces: Tensor): boolean;
    withNpPieces(np_pieces: Tensor): Board;
    toString(): string;
}
