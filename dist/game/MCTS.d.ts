import Connect4Game from "./Connect4Game";
import NNet from "./nn/NNet";
import { Tensor } from "@tensorflow/tfjs";
export default class MCTS {
    private nnet;
    private game;
    private args;
    private Qsa;
    private Nsa;
    private Ns;
    private Ps;
    private Es;
    private Vs;
    constructor(game: Connect4Game, nnet: NNet, args: any);
    getActionProb(canonicalBoard: Tensor, temp?: number): Promise<number[]>;
    search(canonicalBoard: Tensor): Promise<number>;
}
