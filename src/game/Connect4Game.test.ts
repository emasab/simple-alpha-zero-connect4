import Connect4Game from "./Connect4Game"
import Board from "./Board"
import { Tensor } from "@tensorflow/tfjs"

test("getInitBoard", async ()=>{
    let game = new Connect4Game()
    let board = game.getInitBoard()
    let boardSize = game.getBoardSize()
    
    expect(boardSize[0]).toBe(Board.DEFAULT_HEIGHT)
    expect(boardSize[1]).toBe(Board.DEFAULT_WIDTH)

    let sum = await board.sum().array()
    expect(sum)
        .toBe(0)
})


test("getNextState", async ()=>{
    let game = new Connect4Game()
    let initialBoard: Tensor = game.getInitBoard()
    let {board, player} = await game.getNextState(initialBoard, 1, 0)
    let data = await board.data()
    data.every((x: number,i: number)=>{
        if(i===Board.DEFAULT_WIDTH*(Board.DEFAULT_HEIGHT-1))
            return x===1
        else 
            return x===0
    })
})

test("stringRepresentation", ()=>{
    let game = new Connect4Game()
    let initialBoard: Tensor = game.getInitBoard()
    let repr = game.stringRepresentation(initialBoard)
    expect(repr).toBe("0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0")
})