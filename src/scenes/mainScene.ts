import PauseMenu from "../objects/PauseMenu";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Game from "../objects/Game";
import baseScene from "./baseScene";

export default class MainScene extends baseScene {
    constructor() {
        super({ key: "MainGameScene" });
        this.sfx = SFX.getInstance(this);
    }

    // receive data from the progressionscene and store it in the gameData property
    init(data: Game) {
        this.gameData = data;
    }

    create() {
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        this.gameData.resetObjectives();

        this.gameBoard = this.gameData.createBoard(this);

        this.anyValidSolutions = this.gameBoard.isPossibleSolution();

        this.gameData.addRandomComplexObjectives(this.gameData.objectivesNum);

        //SAMPLE OBJECTIVE
        // this.gameData.addObjective(
        //     new Objective("One AND tile", 4, (tileTypes: string[]) => {
        //         const andTiles = tileTypes.filter(
        //             (tileType) => tileType === "andTile"
        //         );
        //         return andTiles.length >= 1;
        //     })
        // );

        this.score = 0;

        this.gameData.handleObjectives(this, this.gameData.objectives);

        console.log(this.gameData);
        this.timerValue = this.gameData.timeLimitSeconds;
        this.livesValue = this.gameData.numLives;
        this.swapsValue = this.gameData.numInitialSwaps;

        this.restartText = this.add.text(
            950,
            400,
            `No more possible solutions,\npress Enter to restart.`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        this.restartText.visible = !this.anyValidSolutions;

        //console.log("Hello");

        this.pauseMenu = new PauseMenu(this);
        this.pauseMenu.setVisible(false);

        // Add input event listeners
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
}
