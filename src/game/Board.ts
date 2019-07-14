import { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs'

export default class Board {

    public height : integer
    public width : integer
    public win_length : integer
    public np_pieces : Tensor

    public static readonly DEFAULT_HEIGHT : integer = 6
    public static readonly DEFAULT_WIDTH : integer  = 7
    public static readonly DEFAULT_WIN_LENGTH : integer = 4

    constructor(params: any){
        if(!params) params = {}
        this.height = params.height || Board.DEFAULT_HEIGHT
        this.width = params.width || Board.DEFAULT_WIDTH
        this.win_length = params.win_length || Board.DEFAULT_WIN_LENGTH
        if(!params.np_pieces){
            this.np_pieces = tf.zeros([this.height, this.width])
        } else {
            this.np_pieces = params.np_pieces
            if(this.np_pieces.shape[0] !=this.height || 
                this.np_pieces.shape[1] != this.width) throw new Error()
        }
    }

    async addStone(column: integer, player: integer){
        let cond = this.np_pieces.slice([0,column],[this.np_pieces.shape[0],1]).equal(0.0)
        let idxs = await tf.whereAsync(cond)
        if(idxs.size>0){
            let idxsData = await idxs.array()
            let idxData = idxsData[idxsData.length-1][0]
            let buffer = await this.np_pieces.buffer()
            buffer.set(player, idxData, column)
            this.np_pieces = buffer.toTensor()
        }
    }
    
    getValidMoves(){
        return this.np_pieces.slice([0],[1]).equal(0)
    }

    getWinState(){
        let players = [-1,1]
        for(let i=0;i<players.length;i++){
            let player = players[i]
            let player_pieces = this.np_pieces.equal(player)
            if(this.isStraightWinner(player_pieces) ||
                this.isStraightWinner(player_pieces.transpose()) ||
                this.isDiagonalWinner(player_pieces)
            ) return {isEnded: true, winner: player}
        }

        let validMoves = this.getValidMoves().any().arraySync()
        if(!validMoves)
            return {isEnded: true, winner: null}

        return {isEnded: false, winner: null}
    }

    isStraightWinner(player_pieces: Tensor){
        let run_lengths = []
        for(let i=0;i<player_pieces.shape[1]-this.win_length+1;i++){
            let max_run_length = player_pieces
            .slice([0,i],[player_pieces.shape[0],this.win_length])
            .sum(1)
            .max()
            if(max_run_length.dataSync()[0]>=this.win_length) return true
        }
        return false
    }

    isDiagonalWinner(player_pieces: Tensor){
        let data : number[][] = <number[][]> player_pieces.arraySync()
        for(let i=0;i<player_pieces.shape[0]-this.win_length+1;i++){

            for(let j=0;j<player_pieces.shape[1]-this.win_length+1;j++){
                let cond = Array.from(Array(this.win_length).keys())
                .map((x: number)=>data[i+x][j+x])
                .every(x=>x)
                if(cond) return true
            }
            for(let j=this.win_length-1;j<player_pieces.shape[1];j++){
                let cond = Array.from(Array(this.win_length).keys())
                .map((x: number)=>data[i+x][j-x])
                .every(x=>x)
                if(cond) return true
            }
        }
        return false
    }

    withNpPieces(np_pieces: Tensor){
        if(np_pieces == null) np_pieces = this.np_pieces
        return new Board({
            height: this.height,
            width: this.width,
            win_length: this.win_length,
            np_pieces: np_pieces
        })
    }

    toString(){
        return this.np_pieces.dataSync().toString()
    }
}