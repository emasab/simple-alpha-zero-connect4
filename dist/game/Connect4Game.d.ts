import * as tf from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs';
export default class Connect4Game {
    private board;
    constructor();
    getInitBoard(): Tensor;
    getBoardSize(): Array<integer>;
    getActionSize(): number;
    getNextState(board: Tensor, player: integer, action: integer): Promise<{
        board: tf.Tensor<tf.Rank>;
        player: number;
    }>;
    getValidMoves(board: Tensor, player: integer): tf.Tensor<tf.Rank>;
    getGameEnded(board: Tensor, player: integer): 0 | 1 | -1 | 0.0001;
    getCanonicalForm(board: Tensor, player: integer): tf.Tensor<tf.Rank>;
    stringRepresentation(board: Tensor): string;
}
