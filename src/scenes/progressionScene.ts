import Phaser from "phaser";
import Game from "../objects/Game";
import Stage from "../objects/Stages";
import Background from "../objects/Background";

export default class ProgressionScene extends Phaser.Scene {
    private currentStage: Stage | null = null;
    private stageTitleText: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "ProgressionScene" });
    }

    create() {
        const backgroundImage = new Background(this, "background");
        backgroundImage.create();
        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;

        // Add title text
        const titleText = this.add.text(
            screenWidth * 0.5,
            screenHeight * 0.2,
            "Progression",
            {
                fontSize: "48px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        titleText.setOrigin(0.5);

        // Define stages and games
        const stages = [
            new Stage("Beginner", [
                new Game("Game 1", ["trueTile", "falseTile"], 64, 5),
                new Game("Game 2", ["trueTile", "falseTile", "andTile"], 64, 6),
                new Game("Game 3", ["trueTile", "falseTile", "orTile"], 64, 7),
                new Game(
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    64,
                    8
                ),
                new Game(
                    "Game 5",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    64,
                    9
                ),
            ]),
            new Stage("Intermediate", [
                new Game("Game 1", ["trueTile", "falseTile"], 48, 6),
                new Game("Game 2", ["trueTile", "falseTile", "andTile"], 48, 7),
                new Game("Game 3", ["trueTile", "falseTile", "orTile"], 48, 8),
                new Game(
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    48,
                    9
                ),
                new Game(
                    "Game 5",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    48,
                    10
                ),
            ]),
            new Stage("Advanced", [
                new Game("Game 1", ["trueTile", "falseTile"], 32, 8),
                new Game("Game 2", ["trueTile", "falseTile", "andTile"], 32, 9),
                new Game("Game 3", ["trueTile", "falseTile", "orTile"], 32, 10),
                new Game(
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    32,
                    11
                ),
                new Game(
                    "Game 5",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    32,
                    12
                ),
            ]),
        ];

        this.stageTitleText = this.add.text(
            screenWidth * 0.5,
            50,
            `${this.currentStage?.name || ""}`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.stageTitleText.setOrigin(0.5);

        // Add stage buttons
        const stageY = screenHeight * 0.4;
        const stageSpacing = 100;
        stages.forEach((stage, index) => {
            const stageButton = this.add.text(
                screenWidth * 0.5,
                stageY + index * stageSpacing,
                stage.name,
                {
                    fontSize: "32px",
                    fontFamily: "Arial",
                    color: "#ffffff",
                    backgroundColor: "#4e342e",
                    padding: { x: 20, y: 10 },
                }
            );
            stageButton.setOrigin(0.5);
            stageButton.setInteractive();
            stageButton.on("pointerdown", () => {
                this.currentStage = stage;
                this.showGames(stage.games);
            });
        });

        const backButton = this.add.text(50, 50, "Back", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#ffffff",
            backgroundColor: "#4e342e",
            padding: { x: 20, y: 10 },
        });
        backButton.setInteractive();
        backButton.on("pointerdown", () => {
            // Go back to the progression scene
            this.scene.start("MenuScene");
        });
    }

    showGames(games: Game[]) {
        // need to clear out the buttons but its fine for now

        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;

        // Add current stage title

        this.stageTitleText.text = this.currentStage?.name || "";

        // Add game list
        const gameListX = screenWidth * 0.2;
        const gameListY = screenHeight * 0.3;
        const gameSpacing = 50;
        games.forEach((game, index) => {
            const gameButton = this.add.text(
                gameListX,
                gameListY + index * gameSpacing,
                game.name,
                {
                    fontSize: "24px",
                    fontFamily: "Arial",
                    color: "#ffffff",
                    backgroundColor: "#4e342e",
                    padding: { x: 20, y: 10 },
                }
            );
            gameButton.setInteractive();
            gameButton.on("pointerdown", () => {
                // Start the selected game scene
                game.startGame(this);
            });
        });
    }
}
