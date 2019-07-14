import Board from "./Board"
import * as tf from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs';
import { conditionalExpression } from "@babel/types";

export default class Connect4Game {

    private board: Board

    constructor(){
        this.board = new Board({})
    }

    getInitBoard() : Tensor {
        return this.board.np_pieces
    }

    getBoardSize() : Array<integer> {
        return [this.board.height, this.board.width]
    }

    getActionSize(){
        return this.board.width
    }

    async getNextState(board : Tensor, player: integer, action: integer){
        let boardArray = await board.array()
        let b = this.board.withNpPieces(tf.tensor(boardArray))
        await b.addStone(action, player)
        return {board: b.np_pieces, player: -player}
    }

    getValidMoves(board: Tensor, player: integer){
        return this.board.withNpPieces(board).getValidMoves()
    }

    getGameEnded(board: Tensor, player: integer){
        let boardObj : Board = this.board.withNpPieces(board)
        let winState = boardObj.getWinState()
        if(winState.isEnded){
            if(winState.winner === null) return 1e-4
            else if(winState.winner === player) return +1
            else if(winState.winner === -player) return -1
            else throw new Error("unexpected winner")
        } else return 0
    }

    getCanonicalForm(board: Tensor, player: integer){
        return board.mul(player)
    }

    stringRepresentation(board: Tensor){
        return this.board.withNpPieces(board).toString()
    }
}