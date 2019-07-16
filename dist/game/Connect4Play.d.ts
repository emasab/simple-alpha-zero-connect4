import { Tensor } from '@tensorflow/tfjs';
export declare type playerPlay = (x: Tensor) => Promise<number>;
export declare type playerPlayed = (x: integer) => Promise<void>;
export declare type gameEnded = (winner: integer) => Promise<void>;
export default class Connect4Play {
    private nnet;
    private game;
    private cpuPlayer;
    private mtcs;
    private player;
    private board;
    private players;
    private played;
    private gameEnded;
    constructor();
    init(player: playerPlay, played: playerPlayed, gameEnded: gameEnded): Promise<integer>;
    isAllowed(action: integer): boolean;
    play(): Promise<void>;
}
