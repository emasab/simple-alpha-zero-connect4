import * as Phaser from 'phaser';
export default class GameScene extends Phaser.Scene {
    private connect4Play;
    private enabled;
    private stone;
    private chosenPromise;
    private choose;
    private playedPromise;
    private played;
    private player;
    private readonly worldBounds;
    private loading;
    constructor();
    preload(): void;
    private preloadGame;
    private setPlayEnabled;
    private getIndex;
    private getAbsolutePos;
    private setAbsolutePosition;
    private letStoneFall;
    private setupPlayer;
    private nextPlayer;
    private gameEnded;
    private showNotSupported;
    update(): void;
    create(): void;
}
