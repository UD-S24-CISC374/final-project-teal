import PauseMenu from "../objects/PauseMenu";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Game from "../objects/Game";
import baseScene from "./baseScene";
import Phaser from "phaser";

export default class TutorialScene extends baseScene {
    private sfx: SFX;
    private instructionText: Phaser.GameObjects.Text;
    private instructionString: string;
    private counter = 0;
    private tutorialStep: number;

    constructor() {
        super({ key: "TutorialScene" });
        this.sfx = SFX.getInstance(this);
    }

    // receive data from the progressionscene and store it in the gameData property
    init(data: Game) {
        this.gameData = data;
    }

    create() {
        this.tutorialStep = 0;
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        this.gameData.resetObjectives();

        this.gameBoard = this.gameData.createBoard(this);

        this.gameData.addRandomComplexObjectives(
            this.gameData.objectivesNum,
            1
        );

        this.score = 0;

        this.gameData.handleObjectives(this, this.gameData.objectives);

        console.log(this.gameData);
        this.timerValue = this.gameData.timeLimitSeconds;
        this.livesValue = this.gameData.numLives;
        this.swapsValue = this.gameData.numInitialSwaps;

        this.pauseMenu = new PauseMenu(this);
        this.pauseMenu.setVisible(false);

        this.input.keyboard?.on("keydown", this.handleKeydown, this);
        this.scoreText = this.add.text(
            (this.game.config.width as number) / 2 - 15,
            10,
            "Score: 0",
            {
                fontSize: "32px",
                color: "#000",
            }
        );
        this.scoreText.setOrigin(0.5, 0);
        this.timerText = this.add.text(10, 10, `Time: ${this.timerValue}`, {
            fontSize: "32px",
            color: "#000",
        });
        this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
        this.livesText = this.add.text(10, 50, `Lives: ${this.livesValue}`, {
            fontSize: "32px",
            color: "#000",
        });
        this.swapsText = this.add.text(10, 90, `Swaps: ${this.swapsValue}`, {
            fontSize: "32px",
            color: "#000",
        });

        this.instructionString = "Click on a tile to select it";
        this.instructionText = this.add.text(
            (this.game.config.width as number) - 325,
            100,
            "",
            {
                lineSpacing: -15,
                fontFamily: "Architects Daughter",
                fontStyle: "bold",
                fontSize: "50px",
                color: "#ff0000",
                wordWrap: {
                    width: 300,
                },
            }
        );

        this.counter = 0;
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.instructionText.text +=
                    this.instructionString[this.counter];
                this.counter++;
            },
            callbackScope: this,
            repeat: this.instructionString.length - 1,
        });

        this.input.on("pointerdown", async () => {
            if (this.tutorialStep === 0 && this.gameBoard.isTileSelected()) {
                this.changeTextGreen();
                this.tutorialStep++;

                await new Promise((resolve) => {
                    let checkInterval = setInterval(() => {
                        if (this.counter >= this.instructionString.length) {
                            clearInterval(checkInterval);
                            resolve(null);
                        }
                    }, 100);
                });
                this.tutorialStep++;
                if (this.counter === this.instructionString.length) {
                    this.instructionString =
                        "Use the arrow or WASD keys to move the selected tile";

                    this.instructionText.text = "";
                    this.changeTextRed();
                    this.buildTutorialText();
                    this.counter = 0;
                }
            }
        });

        if (this.input.keyboard) {
            this.input.keyboard.on(
                "keydown",
                async (event: Phaser.Input.Keyboard.Key) => {
                    if (
                        this.tutorialStep === 2 &&
                        this.gameBoard.isTileSelected() &&
                        (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP ||
                            event.keyCode ===
                                Phaser.Input.Keyboard.KeyCodes.DOWN ||
                            event.keyCode ===
                                Phaser.Input.Keyboard.KeyCodes.LEFT ||
                            event.keyCode ===
                                Phaser.Input.Keyboard.KeyCodes.RIGHT ||
                            event.keyCode ===
                                Phaser.Input.Keyboard.KeyCodes.W ||
                            event.keyCode ===
                                Phaser.Input.Keyboard.KeyCodes.A ||
                            event.keyCode ===
                                Phaser.Input.Keyboard.KeyCodes.S ||
                            event.keyCode === Phaser.Input.Keyboard.KeyCodes.D)
                    ) {
                        this.changeTextGreen();
                        this.tutorialStep++;

                        await new Promise((resolve) => {
                            let checkInterval = setInterval(() => {
                                if (
                                    this.counter >=
                                    this.instructionString.length
                                ) {
                                    clearInterval(checkInterval);
                                    resolve(null);
                                }
                            }, 100);
                        });
                        this.tutorialStep++;
                        if (this.counter === this.instructionString.length) {
                            this.instructionString =
                                "Press 'r' or 'c' to select a row or column";
                            this.instructionText.text = "";
                            this.changeTextRed();
                            this.buildTutorialText();
                            this.counter = 0;
                        }
                    }
                }
            );
        }

        if (this.input.keyboard) {
            this.input.keyboard.on(
                "keydown",
                async (event: Phaser.Input.Keyboard.Key) => {
                    if (
                        this.tutorialStep === 4 &&
                        this.gameBoard.isTileSelected() &&
                        (event.keyCode === Phaser.Input.Keyboard.KeyCodes.R ||
                            event.keyCode === Phaser.Input.Keyboard.KeyCodes.C)
                    ) {
                        this.changeTextGreen();
                        this.tutorialStep++;

                        await new Promise((resolve) => {
                            let checkInterval = setInterval(() => {
                                if (
                                    this.counter >=
                                    this.instructionString.length
                                ) {
                                    clearInterval(checkInterval);
                                    resolve(null);
                                }
                            }, 100);
                        });
                        this.tutorialStep++;
                        if (this.counter === this.instructionString.length) {
                            this.instructionString =
                                "Press enter to confirm your choice";
                            this.instructionText.text = "";
                            this.changeTextRed();
                            this.buildTutorialText();
                            this.counter = 0;
                        }
                    }
                }
            );
        }

        if (this.input.keyboard) {
            this.input.keyboard.on(
                "keydown",
                async (event: Phaser.Input.Keyboard.Key) => {
                    if (
                        this.tutorialStep === 6 &&
                        this.gameBoard.isTileSelected() &&
                        event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER
                    ) {
                        this.changeTextGreen();
                        this.tutorialStep++;

                        await new Promise((resolve) => {
                            let checkInterval = setInterval(() => {
                                if (
                                    this.counter >=
                                    this.instructionString.length
                                ) {
                                    clearInterval(checkInterval);
                                    resolve(null);
                                }
                            }, 100);
                        });
                        this.tutorialStep++;
                        if (this.counter === this.instructionString.length) {
                            this.instructionString =
                                "Evaluate the row/column to true to complete the objectives";
                            this.instructionText.text = "";
                            this.changeTextRed();
                            this.buildTutorialText();
                            this.counter = 0;
                        }
                    }
                }
            );
        }
    }

    private updateTimer() {
        if (this.pauseMenu?.visible) {
            return; //dont decrement timer if paused
        }
        this.timerValue--;
        this.timerText.setText(`Time: ${this.timerValue}`);

        // Handle timer expiration (if needed)
        if (this.timerValue === 0) {
            this.endGame("You ran out of time!");
        }
    }

    update() {
        if (this.livesValue == 0) {
            this.endGame("You lost all of your lives!");
        }
        if (this.swapsValue == 0) {
            this.endGame("You ran out of swaps!");
        }
    }

    private buildTutorialText() {
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.instructionText.text +=
                    this.instructionString[this.counter];
                this.counter++;
            },
            callbackScope: this,
            repeat: this.instructionString.length - 1,
        });
    }

    private changeTextGreen() {
        this.instructionText.setColor("#00ff00");
    }

    private changeTextRed() {
        this.instructionText.setColor("#ff0000");
    }
}
