import {Tensor} from '@tensorflow/tfjs'
import * as tf from '@tensorflow/tfjs'
import Connect4Game from './Connect4Game'
import NNet from './nn/NNet'
import MCTS from './MCTS'

export type playerPlay = (x: Tensor) => Promise<number>

export type playerPlayed = (x: integer) => Promise<void>

export type gameEnded = (winner: integer) => Promise<void>

export default class Connect4Play{

    private nnet: NNet

    private game: Connect4Game

    private cpuPlayer: playerPlay

    private mtcs: MCTS

    private player: integer

    private board: Tensor

    private players: playerPlay[]

    private played: playerPlayed

    private gameEnded: gameEnded

    public constructor(){}

    public async init(player: playerPlay, played: playerPlayed, gameEnded: gameEnded): Promise<integer>{
        this.nnet = new NNet()
        await this.nnet.loadGraphModelAsync('nn/model.json')

        this.game = new Connect4Game()

        this.mtcs = new MCTS(this.game, this.nnet, {
            numMCTSSims: 50, 
            cpuct:1.0
        })

        this.cpuPlayer = async (x: Tensor): Promise<integer> =>{
            let actionProb: number[] = await this.mtcs.getActionProb(x, 0)
            let argMax = await tf.argMax(actionProb).data()
            return argMax[0]
        }
        
        this.player = Math.random()>=0.5 ? 1 : -1
        this.players = [player, this.cpuPlayer]
        this.played = played
        this.gameEnded = gameEnded
        this.board = this.game.getInitBoard()

        return this.player
    }

    public isAllowed(action: integer): boolean{
        let validMoves: number[][] = this.game.getValidMoves(this.board).arraySync() as number[][]
        return validMoves[0][action]==1
    }

    public async play(): Promise<void>{
        var gameEnded = this.game.getGameEnded(this.board, -1)
        while(!gameEnded){
            let idx: integer = this.player>0 ? 1 : 0
            let action: integer = await this.players[idx](this.board)
            let {board, player} = await this.game.getNextState(this.board, this.player, action)
            this.board = board
            this.player = player
            await this.played(action)
            gameEnded = this.game.getGameEnded(this.board, -1)
            await new Promise((resolve: Function): void => {
                setTimeout(resolve, 500)
            })
        }
        this.gameEnded(gameEnded)
    }

}