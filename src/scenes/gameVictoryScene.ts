import Phaser from "phaser";
import Background from "../objects/Background";
import victorySketch from "../objects/victorySketch";
import Button from "../objects/Button";
import Stage from "../objects/Stages";
import Game from "../objects/Game";

export default class GameVictoryScene extends Phaser.Scene {
    private lastScene: string;
    private allLevelsCompleted: boolean = false;
    constructor() {
        super({ key: "GameVictoryScene" });
    }

    init() {}

    create() {
        const width: number = this.game.config.width as number;
        const height: number = this.game.config.height as number;
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        this.add.image(width * 0.5, height * 0.2, "complete").setOrigin(0.5);

        new victorySketch(
            this,
            width * 0.2,
            height * 0.6,
            200,
            1.5,
            1.5,
            -15,
            15
        );

        new victorySketch(
            this,
            width * 0.8,
            height * 0.6,
            200,
            1.5,
            1.5,
            -15,
            15
        );

        this.allLevelsCompleted = false;
        const stages = this.registry.get("stages") as Stage[];
        console.log(stages);
        let currentStage = this.registry.get("currentStage") as string;
        let currentGame = this.registry.get("currentGame") as string;

        // return 0 for stage 1, 1 for stage 2, 2 for stage 3
        let currentStageIndex = stages.findIndex(
            (stage) => stage.name === currentStage
        );

        if (currentStage === "Freeplay") {
            currentStageIndex = 0;
        }

        // return 0 for game 1, 1 for game 2, 2 for game 3
        let currentGameIndex = stages[currentStageIndex].games.findIndex(
            (game) => game.name === currentGame
        );

        let nextGame: Game;
        if (currentGameIndex < stages[currentStageIndex].games.length - 1) {
            nextGame = stages[currentStageIndex].games[currentGameIndex + 1];
        } else if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            currentGameIndex = 0;
            nextGame = stages[currentStageIndex].games[currentGameIndex];
        } else {
            this.allLevelsCompleted = true;
        }

        if (this.allLevelsCompleted) {
            this.add
                .text(width * 0.5, height * 0.5, "All Levels Completed", {
                    font: "48px Arial",
                    color: "#000000",
                    align: "center",
                })
                .setOrigin(0.5, 0.5);
        } else if (currentStage === "Freeplay") {
            this.add
                .text(width * 0.5, height * 0.5, "", {
                    font: "48px Arial",
                    color: "#000000",
                    align: "center",
                })
                .setOrigin(0.5, 0.5);
        } else {
            new Button(this, width * 0.5, height * 0.6, "Next Level", () => {
                this.registry.set("currentGame", nextGame.name);
                this.registry.set(
                    "currentStage",
                    stages[currentStageIndex].name
                );
                this.scene.start("MainGameScene", nextGame);
            });
        }

        new Button(this, width * 0.5, height * 0.7, "Menu", () => {
            this.scene.start("MenuScene");
        });
    }
}
