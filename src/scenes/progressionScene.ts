import Phaser from "phaser";
import Game from "../objects/Game";
import Stage from "../objects/Stages";
import Background from "../objects/Background";
import SFX from "../objects/SFX";

export default class ProgressionScene extends Phaser.Scene {
    private currentStage: Stage | null = null;
    private stageTitleText: Phaser.GameObjects.Text;
    private sfx: SFX;
    private gameButtonsShown: Phaser.GameObjects.Text[] = [];
    private tileButtonsShown: Phaser.GameObjects.Sprite[] = [];
    constructor() {
        super({ key: "ProgressionScene" });
        this.sfx = SFX.getInstance(this);
    }

    create() {
        const backgroundImage = Background.getInstance(this, "background");
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
                new Game(
                    "Game 1",
                    ["trueTile", "falseTile", "orTile", "andTile"],
                    3
                ),
                new Game(
                    "Game 2",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    5
                ),
                new Game("Game 3", ["trueTile", "falseTile", "orTile"], 7),
                new Game(
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    8
                ),
                new Game(
                    "Game 5",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    9
                ),
            ]),
            new Stage("Intermediate", [
                new Game("Game 1", ["trueTile", "falseTile"], 6),
                new Game("Game 2", ["trueTile", "falseTile", "andTile"], 7),
                new Game("Game 3", ["trueTile", "falseTile", "orTile"], 8),
                new Game(
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile"],

                    9
                ),
                new Game(
                    "Game 5",
                    ["trueTile", "falseTile", "andTile", "orTile"],

                    10
                ),
            ]),
            new Stage("Advanced", [
                new Game("Game 1", ["trueTile", "falseTile"], 8),
                new Game("Game 2", ["trueTile", "falseTile", "andTile"], 9),
                new Game("Game 3", ["trueTile", "falseTile", "orTile"], 10),
                new Game(
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile"],

                    11
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
                this.sfx.play("pop-click-1");
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
            this.sfx.play("pop-click-1");
            // Go back to the progression scene
            this.scene.start("MenuScene");
        });

        const freeplayButton = this.add.text(
            screenWidth * 0.5,
            stageY + 3 * stageSpacing,
            "Freeplay",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 20, y: 10 },
            }
        );
        freeplayButton.setOrigin(0.5);
        freeplayButton.setInteractive();
        freeplayButton.on("pointerdown", () => {
            this.sfx.play("pop-click-1");
            this.openFreeplaySettings();
        });
    }

    openFreeplaySettings() {
        this.hideGames();

        //this function is in need of refactoring..

        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;

        const settingsX = screenWidth * 0.7;
        const settingsY = screenHeight * 0.2;
        const settingsSpacing = 75;

        // Board size
        const boardSizeLabel = this.add.text(
            settingsX,
            settingsY,
            "Board Size:",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(boardSizeLabel);
        let boardSize = 5;
        const boardSizeValue = this.add.text(
            settingsX + 200,
            settingsY,
            `${boardSize}`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(boardSizeValue);

        const boardSizeDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY,
            250,
            "-"
        );
        boardSizeDecrement.setInteractive();
        boardSizeDecrement.on("pointerdown", () => {
            boardSize = Math.max(boardSize - 1, 3);
            boardSizeValue.setText(`${boardSize}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(boardSizeDecrement);
        const boardSizeIncrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY,
            275,
            "+"
        );

        boardSizeIncrement.setInteractive();
        boardSizeIncrement.on("pointerdown", () => {
            boardSize = Math.min(boardSize + 1, 15);
            boardSizeValue.setText(`${boardSize}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(boardSizeIncrement);

        // Tiles
        const tileLabel = this.add.text(
            settingsX,
            settingsY + settingsSpacing,
            "Tiles:",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(tileLabel);

        const tileSprites = ["trueTile", "falseTile", "andTile", "orTile"];
        tileSprites.forEach((sprite, index) => {
            const tileButton = this.add.sprite(
                settingsX + 200 + index * 50,
                settingsY + settingsSpacing + 15,
                sprite
            );
            tileButton.setInteractive();
            tileButton.setScale(0.4);
            tileButton.on("pointerdown", () => {
                tileButton.setTint(
                    tileButton.tintTopLeft === 0xffffff ? 0x000000 : 0xffffff
                );
                this.sfx.play("pop-click-1");
            });
            this.tileButtonsShown.push(tileButton);
        });

        // Time limit
        const timeLimitLabel = this.add.text(
            settingsX,
            settingsY + 2 * settingsSpacing,
            "Time Limit (s):",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(timeLimitLabel);
        let timeLimit = 180;
        const timeLimitValue = this.add.text(
            settingsX + 200,
            settingsY + 2 * settingsSpacing,
            `${timeLimit}`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(timeLimitValue);

        const timeLimitDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 2 * settingsSpacing,
            250,
            "-"
        );
        timeLimitDecrement.setInteractive();
        timeLimitDecrement.on("pointerdown", () => {
            timeLimit = Math.max(timeLimit - 10, 0);
            timeLimitValue.setText(`${timeLimit}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(timeLimitDecrement);

        const timeLimitIncrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 2 * settingsSpacing,
            275,
            "+"
        );
        timeLimitIncrement.setInteractive();
        timeLimitIncrement.on("pointerdown", () => {
            timeLimit += 10;
            timeLimitValue.setText(`${timeLimit}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(timeLimitIncrement);
        // Number of lives
        const livesLabel = this.add.text(
            settingsX,
            settingsY + 3 * settingsSpacing,
            "Number of Lives:",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(livesLabel);

        let lives = 3;
        const livesValue = this.add.text(
            settingsX + 200,
            settingsY + 3 * settingsSpacing,
            `${lives}`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(livesValue);

        const livesDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 3 * settingsSpacing,
            250,
            "-"
        );
        livesDecrement.setInteractive();
        livesDecrement.on("pointerdown", () => {
            lives = Math.max(lives - 1, 1);
            livesValue.setText(`${lives}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(livesDecrement);

        const livesIncrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 3 * settingsSpacing,
            275,
            "+"
        );
        livesIncrement.setInteractive();
        livesIncrement.on("pointerdown", () => {
            lives++;
            livesValue.setText(`${lives}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(livesIncrement);

        // Number of initial swaps
        const swapsLabel = this.add.text(
            settingsX,
            settingsY + 4 * settingsSpacing,
            "Initial Swaps:",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(swapsLabel);
        let initialSwaps = 7;
        const swapsValue = this.add.text(
            settingsX + 200,
            settingsY + 4 * settingsSpacing,
            `${initialSwaps}`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(swapsValue);

        const swapsDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 4 * settingsSpacing,
            250,
            "-"
        );
        swapsDecrement.setInteractive();
        swapsDecrement.on("pointerdown", () => {
            initialSwaps = Math.max(initialSwaps - 1, 0);
            swapsValue.setText(`${initialSwaps}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(swapsDecrement);

        const swapsIncrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 4 * settingsSpacing,
            275,
            "+"
        );

        swapsIncrement.setInteractive();
        swapsIncrement.on("pointerdown", () => {
            initialSwaps = Math.max(initialSwaps + 1, 0);
            swapsValue.setText(`${initialSwaps}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(swapsIncrement);

        // Number of objectives swaps
        const objectivesLabel = this.add.text(
            settingsX,
            settingsY + 5 * settingsSpacing,
            "# Objectives:",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(objectivesLabel);
        let valueObjectives = 3;
        const objetivesValue = this.add.text(
            settingsX + 200,
            settingsY + 5 * settingsSpacing,
            `${valueObjectives}`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(objetivesValue);

        const objectivesDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 5 * settingsSpacing,
            250,
            "-"
        );
        objectivesDecrement.setInteractive();
        objectivesDecrement.on("pointerdown", () => {
            valueObjectives = Math.max(valueObjectives - 1, 0);
            objetivesValue.setText(`${valueObjectives}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(objectivesDecrement);

        const objectivesIncrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 5 * settingsSpacing,
            275,
            "+"
        );
        objectivesIncrement.setInteractive();
        objectivesIncrement.on("pointerdown", () => {
            valueObjectives = Math.max(valueObjectives + 1, 0);
            objetivesValue.setText(`${valueObjectives}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(objectivesIncrement);

        const startGameButton = this.add.text(
            settingsX + 200,
            settingsY + 6 * settingsSpacing,
            "Start Game",
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 20, y: 10 },
            }
        );
        startGameButton.setInteractive();
        startGameButton.on("pointerdown", () => {
            this.sfx.play("crumple-paper-1");

            const game = new Game(
                "Freeplay",
                this.tileButtonsShown
                    .filter((tile) => tile.tintTopLeft === 0xffffff)
                    .map((filteredTile) => filteredTile.texture.key),
                boardSize,
                timeLimit,
                lives,
                initialSwaps
            );
            game.addRandomComplexObjectives(valueObjectives);
            game.startGame(this);
        });
        this.gameButtonsShown.push(startGameButton);
    }

    createIncrementDecrementButton(
        settingsX: number,
        settingsY: number,
        positionX: number,
        symbol: string
    ) {
        const incrementButton = this.add.text(
            settingsX + positionX,
            settingsY,
            symbol,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 10, y: 5 },
            }
        );

        return incrementButton;
    }

    hideGames() {
        for (const button of this.gameButtonsShown) {
            button.destroy();
        }
        this.gameButtonsShown = [];
        for (const button of this.tileButtonsShown) {
            button.destroy();
        }
        this.tileButtonsShown = [];
    }

    showGames(games: Game[]) {
        this.hideGames();

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
                this.sfx.play("crumple-paper-1");
                // Start the selected game scene
                game.startGame(this);
            });
            this.gameButtonsShown.push(gameButton);
        });
    }
}
