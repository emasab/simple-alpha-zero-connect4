import { Tensor } from '@tensorflow/tfjs'
import * as tf from '@tensorflow/tfjs'

export default class Board{

    public height: integer
    public width: integer
    public winLength: integer
    public npPieces: Tensor

    public static readonly DEFAULT_HEIGHT: integer = 6
    public static readonly DEFAULT_WIDTH: integer  = 7
    public static readonly DEFAULT_WIN_LENGTH: integer = 4

    public constructor(params: {
        height: integer;
        width: integer; 
        winLength: integer;
        npPieces: Tensor;
    }){
        if(!params) params = {height: null, width: null, winLength: null, npPieces: null}
        this.height = params.height || Board.DEFAULT_HEIGHT
        this.width = params.width || Board.DEFAULT_WIDTH
        this.winLength = params.winLength || Board.DEFAULT_WIN_LENGTH
        if(!params.npPieces){
            this.npPieces = tf.zeros([this.height, this.width])
        } else {
            this.npPieces = params.npPieces
            if(this.npPieces.shape[0] !=this.height || 
                this.npPieces.shape[1] != this.width) throw new Error()
        }
    }

    public async addStone(column: integer, player: integer): Promise<void>{
        let cond = this.npPieces.slice([0,column],[this.npPieces.shape[0],1]).equal(0.0)
        let idxs = await tf.whereAsync(cond)
        if(idxs.size>0){
            let idxsData = await idxs.array()
            let idxData = idxsData[idxsData.length-1][0]
            let buffer = await this.npPieces.buffer()
            buffer.set(player, idxData, column)
            this.npPieces = buffer.toTensor()
        }
    }
    
    public getValidMoves(): Tensor{
        return this.npPieces.slice([0],[1]).equal(0)
    }

    public getWinState(): {isEnded: boolean; winner: integer}{
        let players = [-1,1]
        for(let i=0;i<players.length;i++){
            let player = players[i]
            let playerPieces = this.npPieces.equal(player)
            if(this.isStraightWinner(playerPieces) ||
                this.isStraightWinner(playerPieces.transpose()) ||
                this.isDiagonalWinner(playerPieces)
            ) return {isEnded: true, winner: player}
        }

        let validMoves = this.getValidMoves().any().arraySync()
        if(!validMoves)
            return {isEnded: true, winner: null}

        return {isEnded: false, winner: null}
    }

    private isStraightWinner(playerPieces: Tensor): boolean{
        for(let i=0;i<playerPieces.shape[1]-this.winLength+1;i++){
            let maxRunLength = playerPieces
                .slice([0,i],[playerPieces.shape[0],this.winLength])
                .sum(1)
                .max()
            if(maxRunLength.dataSync()[0]>=this.winLength) return true
        }
        return false
    }

    private isDiagonalWinner(playerPieces: Tensor): boolean{
        let data: number[][] = playerPieces.arraySync() as number[][]
        for(let i=0;i<playerPieces.shape[0]-this.winLength+1;i++){

            for(let j=0;j<playerPieces.shape[1]-this.winLength+1;j++){
                let cond = Array.from(Array(this.winLength).keys())
                    .map((x: number): number=>data[i+x][j+x])
                    .every((x: number): boolean=>x==1)
                if(cond) return true
            }
            for(let j=this.winLength-1;j<playerPieces.shape[1];j++){
                let cond = Array.from(Array(this.winLength).keys())
                    .map((x: number): number=>data[i+x][j-x])
                    .every((x: number): boolean=>x==1)
                if(cond) return true
            }
        }
        return false
    }

    public withNpPieces(npPieces: Tensor): Board{
        if(npPieces == null) npPieces = this.npPieces
        return new Board({
            height: this.height,
            width: this.width,
            winLength: this.winLength,
            npPieces: npPieces
        })
    }

    public toString(): string{
        return this.npPieces.dataSync().toString()
    }
}