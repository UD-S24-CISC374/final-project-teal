import Phaser from "phaser";
import Objective from "./Objective";
import Board from "./Board";

export default class Game {
    lvl: number;
    name: string;
    tileTypes: string[];
    tileSize: number;
    boardSize: number;
    timeLimitSeconds: number;
    numInitialSwaps: number;
    numLives: number;
    objectives: Objective[] = [];
    objectivesNum: number;
    isLocked: boolean;

    constructor(
        lvl: number,
        name: string,
        tileTypes: string[],
        boardSize: number,
        timeLimitSeconds?: number,
        numLives?: number,
        numInitialSwaps?: number,
        objectivesNum?: number,
        isLocked?: boolean
    ) {
        this.lvl = lvl;
        this.name = name;
        this.tileTypes = tileTypes;
        this.boardSize = boardSize;
        this.timeLimitSeconds = timeLimitSeconds || 1000;
        this.numLives = numLives || 99;
        this.numInitialSwaps = numInitialSwaps || 99;
        this.objectives = [];
        this.objectivesNum = objectivesNum || 3;
        this.isLocked = isLocked !== undefined ? isLocked : true;
    }

    startGame(scene: Phaser.Scene) {
        scene.scene.start("MainGameScene", this);
    }
    startTutorial(scene: Phaser.Scene) {
        scene.scene.start("TutorialScene", this);
    }

    createBoard(scene: Phaser.Scene) {
        return new Board(scene, this.boardSize, this.tileTypes, this.name);
    }

    addObjective(objective: Objective) {
        this.objectives.push(objective);
    }
    // this.gameData.addObjective(
    //     new Objective("One AND tile", 4, (tileTypes: string[]) => {
    //         const andTiles = tileTypes.filter(
    //             (tileType) => tileType === "andTile"
    //         );
    //         return andTiles.length >= 1;
    //     })
    // );
    addRandomSimpleObjectives(n: number) {
        for (let i = 0; i < n; i++) {
            const targetTile =
                this.tileTypes[
                    Math.floor(Math.random() * this.tileTypes.length)
                ];
            const formattedTileType = targetTile
                .replace("Tile", "")
                .toUpperCase();
            let maxNumTiles = (this.boardSize - 2 + (this.boardSize % 2)) / 2;
            if (
                targetTile == "notTile" ||
                targetTile == "leftParenTile" ||
                targetTile == "rightParenTile"
            ) {
                maxNumTiles = (maxNumTiles - (maxNumTiles % 2)) / 2;
            }
            const numTiles = Math.floor(Math.random() * maxNumTiles) + 1;
            const objective = new Objective(
                `${numTiles} ${formattedTileType} tile(s)`,
                3,
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
    addRandomComplexObjectives(
        numObjectives: number,
        numCompletions: number = 3
    ) {
        for (let i = 0; i < numObjectives; i++) {
            const targetTileTypes: string[] = [];
            const numTiles: number[] = [];
            let maxNumTiles = (this.boardSize - 2 + (this.boardSize % 2)) / 2;
            let totalNumTiles = 0;

            while (totalNumTiles < maxNumTiles) {
                maxNumTiles = (this.boardSize - 2 + (this.boardSize % 2)) / 2;
                const targetTile =
                    this.tileTypes[
                        Math.floor(Math.random() * this.tileTypes.length)
                    ];
                if (
                    targetTile == "notTile" ||
                    targetTile == "leftParenTile" ||
                    targetTile == "rightParenTile"
                ) {
                    maxNumTiles = (maxNumTiles - (maxNumTiles % 2)) / 2;
                }
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
                numCompletions,
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

    resetObjectives() {
        this.objectives = [];
    }

    handleObjectives(scene: Phaser.Scene, objectives: Objective[]) {
        if (objectives.length === 0) {
            return;
        }

        // Display objectives
        scene.add.text(10, 180, "Objectives", {
            fontSize: "32px",
            color: "#000",
        });

        const objectiveSpacing = 60;

        scene.add.text(10, 220, "Make a", {
            fontSize: "25px",
            color: "#000",
        });

        scene.add.text(100, 220, " TRUE ", {
            fontSize: "25px",
            color: "#006400",
            fontStyle: "bold",
        });

        scene.add.text(10, 240, "statement with:", {
            fontSize: "25px",
            color: "#000",
        });

        let index = 0;
        objectives.forEach((objective) => {
            objective.createObjectiveText(
                scene,
                10,
                270 + objectiveSpacing * index
            );
            index++;
        });
    }
}
