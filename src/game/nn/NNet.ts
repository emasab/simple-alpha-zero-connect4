import { Tensor, GraphModel, Rank } from "@tensorflow/tfjs"
import * as tf from '@tensorflow/tfjs'

export default class NNet{
    private dropout: Tensor;
    private isTraining: Tensor
    private nnet: GraphModel

    public constructor(){
        this.dropout = tf.scalar(0.0)
        this.isTraining = tf.scalar(false)
    }

    public async loadGraphModelAsync(getGraphModel: string | (() => Promise<GraphModel>)): Promise<void>{
        try {
            await tf.setBackend('webgl')
        } catch(e){
            console.error(e)
        }
        
        if(typeof getGraphModel === "string") 
            this.nnet = await tf.loadGraphModel(getGraphModel)
        else
            this.nnet = await getGraphModel()
    }

    public async predict(board: Tensor): Promise<{prob: Tensor; v: number}>{
        let boards = board.reshape([1, board.shape[0], board.shape[1]])
        var output: Tensor<Rank>[] = await this.nnet.executeAsync({"Placeholder": boards, "Placeholder_1": this.dropout,"is_training": this.isTraining},
            ["Softmax","Tanh"]) as Tensor[]
        let prob: Tensor = output[0]
        let v: Float32Array = await output[1].data() as Float32Array
        if(isNaN(v[0])) throw new Error("prediction error")
        return {prob: prob, v: v[0]}
    }
}