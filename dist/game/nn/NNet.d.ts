import { Tensor, Rank } from "@tensorflow/tfjs";
export default class NNet {
    private dropout;
    private isTraining;
    private nnet;
    constructor();
    loadGraphModelAsync(getGraphModel: string | (() => Promise<any>)): Promise<void>;
    predict(board: Tensor): Promise<{
        prob: Tensor<Rank>;
        v: number;
    }>;
}
