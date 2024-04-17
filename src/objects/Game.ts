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
        scene.scene.start("MainGameScene", {
            name: this.name,
            tileTypes: this.tileTypes,
            tileSize: this.tileSize,
            boardSize: this.boardSize,
            timeLimitSeconds: this.timeLimitSeconds,
            numInitialSwaps: this.numInitialSwaps,
        });
    }

    startTutorial(scene: Phaser.Scene) {
        scene.scene.start("TutorialScene", {
            name: this.name,
            tileTypes: this.tileTypes,
            tileSize: this.tileSize,
            boardSize: this.boardSize,
        });
    }
}
