import PauseMenu from "../objects/PauseMenu";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Game from "../objects/Game";
import baseScene from "./baseScene";
import Objective from "../objects/Objective";
import Tile from "../objects/Tile";

export default class MainScene extends baseScene {
    private sfx: SFX;

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

        this.gameBoard = this.gameData.createBoard(this);
        //SAMPLE OBJECTIVE
        // this.gameData.addObjective(
        //     new Objective("One AND tile", 4, (tileTypes: string[]) => {
        //         const andTiles = tileTypes.filter(
        //             (tileType) => tileType === "andTile"
        //         );
        //         return andTiles.length >= 1;
        //     })
        // );

        this.handleObjectives(this.gameData.objectives);

        this.score = 0;
        console.log(this.gameData);
        this.timerValue = this.gameData.timeLimitSeconds;
        this.livesValue = this.gameData.numLives;
        this.swapsValue = this.gameData.numInitialSwaps;

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
            this.endGame();
        }
    }

    update() {
        if (this.livesValue == 0 || this.swapsValue == 0) {
            this.endGame();
        }
    }
    handleObjectives(objectives: Objective[]) {
        console.log(objectives.length);
        if (objectives.length === 0) {
            return;
        }
        //objectives label
        this.add.text(10, 180, "Objectives:", {
            fontSize: "32px",
            color: "#000",
        });
        const objectiveSpacing = 60;
        //objectives description
        this.add.text(10, 220, "Make a statement with:", {
            fontSize: "25px",
            color: "#000",
        });
        let index = 0;
        objectives.forEach((objective) => {
            console.log(objective);
            objective.createObjectiveText(
                this,
                10,
                260 + objectiveSpacing * index
            );
            index++;
        });
    }
}
