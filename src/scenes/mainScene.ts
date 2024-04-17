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
            this.gameData.tileSize,
            this.gameData.tileTypes
        );
        this.score = 0;
        //console.log("Hello");

        this.pauseMenu = new PauseMenu(this);
        this.pauseMenu.setVisible(false);

        // Add input event listeners
        this.input.keyboard?.on("keydown", this.handleKeydown, this);
        this.scoreText = this.add.text(10, 10, "Score: 0", {
            fontSize: "32px",
            color: "#000",
        });
    }

    update() {}
}
