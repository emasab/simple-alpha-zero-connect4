import Board from "./Board"
import * as tf from '@tensorflow/tfjs'
import { Tensor } from '@tensorflow/tfjs'

export default class Connect4Game{

    private board: Board

    public constructor(){
        this.board = new Board(null)
    }

    public getInitBoard(): Tensor{
        return this.board.npPieces
    }

    public getBoardSize(): integer[]{
        return [this.board.height, this.board.width]
    }

    public getActionSize(): integer{
        return this.board.width
    }

    public async getNextState(board: Tensor, player: integer, action: integer): Promise<{board: Tensor; player: integer}>{
        let boardArray = await board.array()
        let b = this.board.withNpPieces(tf.tensor(boardArray))
        await b.addStone(action, player)
        return {board: b.npPieces, player: -player}
    }

    public getValidMoves(board: Tensor): Tensor{
        return this.board.withNpPieces(board).getValidMoves()
    }

    public getGameEnded(board: Tensor, player: integer): number{
        let boardObj: Board = this.board.withNpPieces(board)
        let winState = boardObj.getWinState()
        if(winState.isEnded){
            if(winState.winner === null) return 1e-4
            else if(winState.winner === player) return +1
            else if(winState.winner === -player) return -1
            else throw new Error("unexpected winner")
        } else return 0
    }

    public getCanonicalForm(board: Tensor, player: integer): Tensor{
        return board.mul(player)
    }

    public stringRepresentation(board: Tensor): string{
        return this.board.withNpPieces(board).toString()
    }
}