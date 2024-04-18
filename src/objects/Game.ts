import Phaser from "phaser";

export default class Game {
    name: string;
    tileTypes: string[];
    tileSize: number;
    boardSize: number;
    timeLimitSeconds: number;
    numInitialSwaps: number;
    numLives: number;

    constructor(
        name: string,
        tileTypes: string[],
        boardSize: number,
        timeLimitSeconds?: number,
        numLives?: number,
        numInitialSwaps?: number
    ) {
        console.log(timeLimitSeconds);
        this.name = name;
        this.tileTypes = tileTypes;
        this.boardSize = boardSize;
        this.timeLimitSeconds = timeLimitSeconds || 1000;
        this.numLives = numLives || 100;
        this.numInitialSwaps = numInitialSwaps || 100;
    }

    startGame(scene: Phaser.Scene) {
        scene.scene.start("MainGameScene", {
            name: this.name,
            tileTypes: this.tileTypes,
            boardSize: this.boardSize,
            timeLimitSeconds: this.timeLimitSeconds,
            numLives: this.numLives,
            numInitialSwaps: this.numInitialSwaps,
        });
    }

    startTutorial(scene: Phaser.Scene) {
        scene.scene.start("TutorialScene", {
            name: this.name,
            tileTypes: this.tileTypes,
            boardSize: this.boardSize,
        });
    }
}
