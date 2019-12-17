import { Tensor, GraphModel } from "@tensorflow/tfjs";
export default class NNet {
    private dropout;
    private isTraining;
    private nnet;
    constructor();
    loadGraphModelAsync(getGraphModel: string | (() => Promise<GraphModel>)): Promise<void>;
    predict(board: Tensor): Promise<{
        prob: Tensor;
        v: number;
    }>;
}
