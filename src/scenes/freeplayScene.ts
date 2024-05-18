import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Button from "../objects/Button";
import Game from "../objects/Game";
import Tile from "../objects/Tile"; // Import the Tile class

export default class FreeplayScene extends Phaser.Scene {
    private sfx: SFX;
    private gameButtonsShown: Phaser.GameObjects.Text[] = [];
    private tileButtonsShown: Tile[] = []; // Use Tile class

    constructor() {
        super({ key: "FreeplayScene" });
        this.sfx = SFX.getInstance(this);
    }

    create() {
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();

        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;

        const settingsX = screenWidth * 0.2;
        const settingsY = screenHeight * 0.2;
        const settingsSpacing = 100;
        const valueOffset = 250;
        const buttonOffset = 350;

        // Board size
        const boardSizeLabel = this.createFreeplayTextSettings(
            settingsX,
            settingsY,
            "Board Size:"
        );
        this.gameButtonsShown.push(boardSizeLabel);

        let boardSize = 5;
        const boardSizeValue = this.add.text(
            settingsX + valueOffset,
            settingsY,
            `${boardSize}`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(boardSizeValue);

        const boardSizeDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY,
            buttonOffset,
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
            buttonOffset + 50,
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
        const tileLabel = this.createFreeplayTextSettings(
            settingsX,
            settingsY + settingsSpacing,
            "Tiles:"
        );
        this.gameButtonsShown.push(tileLabel);

        const tileSprites = [
            "trueTile",
            "falseTile",
            "andTile",
            "orTile",
            "leftParenTile",
            "notTile",
            "xorTile",
            "rightParenTile",
        ];
        tileSprites.forEach((sprite, index) => {
            const tileButton = new Tile(
                this,
                settingsX + (index % 4) * 60 + 300,
                settingsY + settingsSpacing + Math.floor(index / 4) * 60 - 45,
                sprite,
                64
            );
            tileButton.setScale(64 / tileButton.height);
            tileButton.showOverlay();
            tileButton.setOrigin(0, 0);
            tileButton.setInteractive();
            tileButton.on("pointerdown", () => {
                if (tileButton.overlay.visible) {
                    tileButton.hideOverlay();
                } else {
                    tileButton.showOverlay();
                }
                this.sfx.play("pop-click-1");
            });
            this.tileButtonsShown.push(tileButton);
        });

        // Time limit
        const timeLimitLabel = this.createFreeplayTextSettings(
            settingsX,
            settingsY + 2 * settingsSpacing,
            "Time Limit (s):"
        );
        this.gameButtonsShown.push(timeLimitLabel);

        let timeLimit = 180;
        const timeLimitValue = this.add.text(
            settingsX + valueOffset,
            settingsY + 2 * settingsSpacing,
            `${timeLimit}`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(timeLimitValue);

        const timeLimitDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 2 * settingsSpacing,
            buttonOffset,
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
            buttonOffset + 50,
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
        const livesLabel = this.createFreeplayTextSettings(
            settingsX,
            settingsY + 3 * settingsSpacing,
            "Number of Lives:"
        );
        this.gameButtonsShown.push(livesLabel);

        let lives = 3;
        const livesValue = this.add.text(
            settingsX + valueOffset,
            settingsY + 3 * settingsSpacing,
            `${lives}`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(livesValue);

        const livesDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 3 * settingsSpacing,
            buttonOffset,
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
            buttonOffset + 50,
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
        const swapsLabel = this.createFreeplayTextSettings(
            settingsX,
            settingsY + 4 * settingsSpacing,
            "Initial Swaps:"
        );
        this.gameButtonsShown.push(swapsLabel);

        let initialSwaps = 7;
        const swapsValue = this.add.text(
            settingsX + valueOffset,
            settingsY + 4 * settingsSpacing,
            `${initialSwaps}`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(swapsValue);

        const swapsDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 4 * settingsSpacing,
            buttonOffset,
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
            buttonOffset + 50,
            "+"
        );
        swapsIncrement.setInteractive();
        swapsIncrement.on("pointerdown", () => {
            initialSwaps++;
            swapsValue.setText(`${initialSwaps}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(swapsIncrement);

        // Number of objectives swaps
        const objectivesLabel = this.createFreeplayTextSettings(
            settingsX,
            settingsY + 5 * settingsSpacing,
            "# Objectives:"
        );
        this.gameButtonsShown.push(objectivesLabel);

        let valueObjectives = 3;
        const objectivesValue = this.add.text(
            settingsX + valueOffset,
            settingsY + 5 * settingsSpacing,
            `${valueObjectives}`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.gameButtonsShown.push(objectivesValue);

        const objectivesDecrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 5 * settingsSpacing,
            buttonOffset,
            "-"
        );
        objectivesDecrement.setInteractive();
        objectivesDecrement.on("pointerdown", () => {
            valueObjectives = Math.max(valueObjectives - 1, 0);
            objectivesValue.setText(`${valueObjectives}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(objectivesDecrement);

        const objectivesIncrement = this.createIncrementDecrementButton(
            settingsX,
            settingsY + 5 * settingsSpacing,
            buttonOffset + 50,
            "+"
        );
        objectivesIncrement.setInteractive();
        objectivesIncrement.on("pointerdown", () => {
            valueObjectives++;
            objectivesValue.setText(`${valueObjectives}`);
            this.sfx.play("pop-click-1");
        });
        this.gameButtonsShown.push(objectivesIncrement);

        const startGameButton = this.add.text(
            screenWidth - settingsX,
            screenHeight * 0.5,
            "Start",
            {
                fontSize: "48px",
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
                -1,
                "Freeplay",
                this.tileButtonsShown
                    .filter((tile) => tile.overlay.visible)
                    .map((filteredTile) => filteredTile.texture.key),
                boardSize,
                timeLimit,
                lives,
                initialSwaps,
                valueObjectives
            );
            this.registry.set("currentStage", game.name);
            this.registry.set("currentGame", game.name);
            game.startGame(this);
        });
        startGameButton.on("pointerover", () => {
            startGameButton.setStyle({ backgroundColor: "#6d4c41" });
            startGameButton.setScale(1.1);
        });
        startGameButton.on("pointerout", () => {
            startGameButton.setStyle({ backgroundColor: "#4e342e" });
            startGameButton.setScale(1);
        });
        this.gameButtonsShown.push(startGameButton);

        // Add back button
        new Button(
            this,
            70,
            70,
            "Back",
            () => {
                this.scene.start("ProgressionScene");
            },
            "32px"
        );
    }

    createIncrementDecrementButton(
        settingsX: number,
        settingsY: number,
        positionX: number,
        symbol: string
    ) {
        const button = this.add.text(settingsX + positionX, settingsY, symbol, {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#ffffff",
            backgroundColor: "#4e342e",
            padding: { x: 10, y: 5 },
        });

        button.setInteractive();
        button.on("pointerover", () => {
            button.setStyle({ backgroundColor: "#6d4c41" });
            button.setScale(1.1);
        });
        button.on("pointerout", () => {
            button.setStyle({ backgroundColor: "#4e342e" });
            button.setScale(1);
        });

        return button;
    }

    createFreeplayTextSettings(
        settingsX: number,
        settingsY: number,
        text: string
    ) {
        const freeplayText = this.add.text(settingsX, settingsY, text, {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#000000",
        });
        return freeplayText;
    }
}
