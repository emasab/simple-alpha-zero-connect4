import Board from "./Board"
import * as tf from '@tensorflow/tfjs'
import "jest"

test('test vertical winning states', async () => {
    var board = new Board(null)
    await board.addStone(0,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var {isEnded, winner}  = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var  {isEnded, winner}  = board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(1)

    var board = new Board(null)
    await board.addStone(0,-1)
    var  {isEnded, winner}  = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,-1)
    var {isEnded, winner}  = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var {isEnded, winner}  = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var  {isEnded, winner}  = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(0,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(1)
})

test('test horizontal winning states', async () => {
    var board = new Board(null)
    await board.addStone(0,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(1,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(2,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(3,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(1)

    var board = new Board(null)
    await board.addStone(3,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(4,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(5,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(6,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(1)
})

test('test diagonal winning states', async () => {
    var board = new Board(null)
    await board.addStone(0,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(1,-1)
    await board.addStone(1,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(2,-1)
    await board.addStone(2,-1)
    await board.addStone(2,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(3,-1)
    await board.addStone(3,-1)
    await board.addStone(3,-1)
    await board.addStone(3,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(1)

    var board = new Board(null)
    await board.addStone(3,-1)
    await board.addStone(3,-1)
    await board.addStone(3,-1)
    await board.addStone(3,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(4,-1)
    await board.addStone(4,-1)
    await board.addStone(4,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(5,-1)
    await board.addStone(5,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(false)
    await board.addStone(6,1)
    var {isEnded, winner} = board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(1)
})

test('test win state', async () => {
    var board = new Board(null)
    board = board.withNpPieces(tf.tensor(
        [[0 , 0, 0 , 0 , 0 , 0 , 0],
            [0 , 0, 0 , 0 , 0 , 0 , 0],
            [0 , 0, -1, 0 , 0 , 0 , 0],
            [0 , 0, 1 , 1 , 0 , 0 , 0],
            [1 , 1, -1, -1, -1, 1 , 0],
            [-1, 1, 1 , 1 , -1, -1, 0]]
    ))

    var {isEnded, winner} =board.getWinState()
    expect(isEnded).toBe(false)
    expect(winner).toBe(null)

    var board = new Board(null)
    board = board.withNpPieces(tf.tensor(
        [[-1, -1, -1, 1 , -1, -1, -1],
            [1 , 1 , 1 , -1, 1 , 1 , 1 ],
            [1 , -1, -1, -1, 1 , -1, -1],
            [-1, 1 , 1 , 1 , -1, -1, 1 ],
            [1 , 1 , -1, -1, -1, 1 , 1 ],
            [-1, 1 , 1 , 1 , -1, -1, 1 ]]
    ))

    var {isEnded, winner} =board.getWinState()
    expect(isEnded).toBe(true)
    expect(winner).toBe(null)
})
     