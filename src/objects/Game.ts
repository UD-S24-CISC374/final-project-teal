import Phaser from "phaser";
import Objective from "./Objective";
import Board from "./Board";

export default class Game {
    name: string;
    tileTypes: string[];
    tileSize: number;
    boardSize: number;
    timeLimitSeconds: number;
    numInitialSwaps: number;
    numLives: number;
    objectives: Objective[] = [];

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
        this.numLives = numLives || 3;
        this.numInitialSwaps = numInitialSwaps || 3;
        this.objectives = [];
    }

    startGame(scene: Phaser.Scene) {
        scene.scene.start("MainGameScene", this);
    }

    createBoard(scene: Phaser.Scene) {
        return new Board(scene, this.boardSize, this.tileTypes);
    }

    startTutorial(scene: Phaser.Scene) {
        scene.scene.start("TutorialScene", {
            name: this.name,
            tileTypes: this.tileTypes,
            boardSize: this.boardSize,
        });
    }
    addObjective(objective: Objective) {
        this.objectives.push(objective);
    }
    isCompleted() {
        if (this.objectives.length === 0) {
            return false;
        }
        return this.objectives.every((objective) => objective.isCompleted());
    }
}
