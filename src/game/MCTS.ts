import Connect4Game from "./Connect4Game"
import NNet from "./nn/NNet"
import { Tensor } from "@tensorflow/tfjs"
import * as tf from '@tensorflow/tfjs'

const EPS = 1e-8

export default class MCTS{
    private nnet: NNet
    private game: Connect4Game
    private args: {numMCTSSims: number; cpuct: number}
    private Qsa: {[s: string]: number }
    private Nsa: {[s: string]: number }
    private Ns: {[s: string]: number}
    private Ps: { [s: string]: Tensor }
    private Es: {[s: string]: number}
    private Vs: {[s: string]: Tensor }

    public constructor(game: Connect4Game, nnet: NNet, args: {numMCTSSims: number; cpuct: number}){
        this.game  = game
        this.nnet = nnet
        this.args = args
        this.Qsa = {}
        this.Nsa = {}
        this.Ns = {}
        this.Ps = {}

        this.Es = {}
        this.Vs = {}
    }

    public async getActionProb(canonicalBoard: Tensor, temp: number=1): Promise<number[]>{
        for(let i=0;i<this.args.numMCTSSims;i++){
            await this.search(canonicalBoard)
        }

        for(let a=0;a<this.game.getActionSize();a++){
            let next = await this.game.getNextState(canonicalBoard, 1, a)
            if(this.game.getGameEnded(next.board, 1)==1){
                let probs = Array(this.game.getActionSize()).fill(0)
                probs[a] = 1
                return probs
            }
        }

        let s = this.game.stringRepresentation(canonicalBoard)
        let counts = []
        for(let a=0;a<this.game.getActionSize();a++){
            let sa = s + "," + a
            if(sa in this.Nsa) counts.push(this.Nsa[sa])
            else counts.push(0)
        }

        if(temp==0){
            let argMaxCounts = await tf.argMax(counts).data()
            let bestA = argMaxCounts[0]
            let probs = Array(counts.length).fill(0)
            probs[bestA] = 1
            return probs
        }

        let countTensor = tf.tensor(counts)
        return await countTensor.pow(1/temp).div(countTensor.sum()).array() as number[]
    }

    public async search(canonicalBoard: Tensor): Promise<number>{
        let s = this.game.stringRepresentation(canonicalBoard)

        if(this.Es[s]===undefined){
            this.Es[s] = this.game.getGameEnded(canonicalBoard, 1)
        }
        if(this.Es[s]!=0){
            return -this.Es[s]
        }

        if(this.Ps[s]===undefined){
            let pred = await this.nnet.predict(canonicalBoard)
            let prob: Tensor = pred.prob
            let valids: Tensor = this.game.getValidMoves(canonicalBoard)
            this.Ps[s] = valids.mul(prob)
            let sumPsS: number = await tf.sum(this.Ps[s]).array() as number
            if(sumPsS>0){
                this.Ps[s] = this.Ps[s].div(sumPsS)
            } else {
                this.Ps[s] = this.Ps[s]
                    .add(valids)
                    .div(sumPsS)
            }

            this.Vs[s] = valids
            this.Ns[s] = 0
            return -pred.v
        }

        let valids = this.Vs[s]
        let curBest = -Infinity
        let bestAct = -1

        let Psdata = await this.Ps[s].data()
        let validsData = await valids.data()
        for(let a=0;a<this.game.getActionSize();a++){
            if(validsData[a]){
                let sa = s + "," + a
                var u = curBest
                if(sa in this.Qsa){
                    u = this.Qsa[sa] + 
                    this.args.cpuct 
                    * Psdata[a]
                    * Math.sqrt(this.Ns[s]) / (1+this.Nsa[sa])
                } else {
                    u = this.args.cpuct 
                    * Psdata[a]
                    * Math.sqrt(this.Ns[s] + EPS)
                }

                if(u > curBest){
                    curBest = u
                    bestAct = a
                }
            }
        }

        let a = bestAct
        var {board: nextBoard, player: nextPlayer} = await this.game.getNextState(canonicalBoard, 1, a)
        nextBoard = this.game.getCanonicalForm(nextBoard, nextPlayer)

        let v = await this.search(nextBoard)

        let sa = s + "," + a
        if(sa in this.Qsa){
            this.Qsa[sa] = (this.Nsa[sa] * this.Qsa[sa] + v)
            / (this.Nsa[sa] + 1)
            this.Nsa[sa] += 1
        } else {
            this.Qsa[sa] = v
            this.Nsa[sa] = 1
        }

        this.Ns[s] += 1
        return -v
    }
}