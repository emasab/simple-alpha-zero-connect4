import { Tensor } from '@tensorflow/tfjs';
export default class Connect4Game {
    private board;
    constructor();
    getInitBoard(): Tensor;
    getBoardSize(): integer[];
    getActionSize(): integer;
    getNextState(board: Tensor, player: integer, action: integer): Promise<{
        board: Tensor;
        player: integer;
    }>;
    getValidMoves(board: Tensor): Tensor;
    getGameEnded(board: Tensor, player: integer): number;
    getCanonicalForm(board: Tensor, player: integer): Tensor;
    stringRepresentation(board: Tensor): string;
}
