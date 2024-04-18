import Board from "../objects/Board";
import PauseMenu from "../objects/PauseMenu";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Game from "../objects/Game";
import baseScene from "./baseScene";

export default class MainScene extends baseScene {
    private sfx: SFX;
    private gameData: Game;

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

        this.gameBoard = new Board(
            this,
            this.gameData.boardSize,
            this.gameData.tileTypes
        );
        this.score = 0;
        console.log(this.gameData);
        this.timerValue = this.gameData.timeLimitSeconds;
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
    }
    private updateTimer() {
        if (this.pauseMenu?.visible) {
            return; //dont decrement timer if paused
        }
        this.timerValue--;
        this.timerText.setText(`Time: ${this.timerValue}`);

        // Handle timer expiration (if needed)
        if (this.timerValue === 0) {
            // Game over or other actions
        }
    }

    update() {}
}
