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
    addRandomSimpleObjectives(n: number) {
        for (let i = 0; i < n; i++) {
            const targetTile =
                this.tileTypes[
                    Math.floor(Math.random() * this.tileTypes.length)
                ];
            const formattedTileType = targetTile
                .replace("Tile", "")
                .toUpperCase();
            const maxNumTiles = (this.boardSize - (this.boardSize % 2)) / 2;
            const numTiles = Math.floor(Math.random() * maxNumTiles) + 1;
            const objective = new Objective(
                `${numTiles} ${formattedTileType} tile(s)`,
                4,
                (tileTypes: string[]) => {
                    const tiles = tileTypes.filter(
                        (tileType) => tileType === targetTile
                    );
                    return tiles.length >= numTiles;
                }
            );
            this.addObjective(objective);
        }
    }
    addRandomComplexObjectives(n: number) {
        for (let i = 0; i < n; i++) {
            const targetTileTypes: string[] = [];
            const numTiles: number[] = [];
            const maxNumTiles = (this.boardSize - (this.boardSize % 2)) / 2;
            let totalNumTiles = 0;

            while (totalNumTiles < maxNumTiles) {
                const targetTile =
                    this.tileTypes[
                        Math.floor(Math.random() * this.tileTypes.length)
                    ];
                const formattedTileType = targetTile
                    .replace("Tile", "")
                    .toUpperCase();
                const remainingTiles = maxNumTiles - totalNumTiles;
                const currNumTiles =
                    Math.floor(Math.random() * remainingTiles) + 1;

                const existingIndex = targetTileTypes.indexOf(targetTile);
                if (existingIndex !== -1) {
                    numTiles[existingIndex] += currNumTiles;
                } else {
                    targetTileTypes.push(targetTile);
                    numTiles.push(currNumTiles);
                }

                totalNumTiles += currNumTiles;
            }

            const objectiveDescription = `${numTiles
                .map(
                    (num, index) =>
                        `${num} ${targetTileTypes[index]
                            .replace("Tile", "")
                            .toUpperCase()}`
                )
                .join(", ")} tile(s)`;

            const objective = new Objective(
                objectiveDescription,
                4,
                (tileTypes: string[]) => {
                    return targetTileTypes.every((targetTile, index) => {
                        const tiles = tileTypes.filter(
                            (tileType) => tileType === targetTile
                        );
                        return tiles.length >= numTiles[index];
                    });
                }
            );

            this.addObjective(objective);
        }
    }
    isCompleted() {
        if (this.objectives.length === 0) {
            return false;
        }
        return this.objectives.every((objective) => objective.isCompleted());
    }
}
