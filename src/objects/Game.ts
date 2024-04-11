import Phaser from "phaser";

export default class Game {
    name: string;
    tileTypes: string[];
    tileSize: number;
    boardSize: number;
    timeLimitSeconds: number;
    numInitialSwaps: number;

    constructor(
        name: string,
        tileTypes: string[],
        tileSize: number,
        boardSize: number,
        timeLimitSeconds?: number,
        numInitialSwaps?: number
    ) {
        this.name = name;
        this.tileTypes = tileTypes;
        this.tileSize = tileSize;
        this.boardSize = boardSize;
        this.timeLimitSeconds = timeLimitSeconds || 180;
        this.numInitialSwaps = numInitialSwaps || 10;
    }

    startGame(scene: Phaser.Scene) {
        //Doesn't import game settings yet
        scene.scene.start("MainGameScene");
    }
}
