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
    preloadGame(): void;
    setPlayEnabled(enabled: boolean): void;
    getIndex(x: integer): number;
    getAbsolutePos(index: integer): number;
    setAbsolutePosition(index: integer): void;
    letStoneFall(): void;
    setupPlayer(player: integer): void;
    nextPlayer(): void;
    gameEnded(outcome: integer): void;
    showNotSupported(): void;
    update(): void;
    create(): void;
}
