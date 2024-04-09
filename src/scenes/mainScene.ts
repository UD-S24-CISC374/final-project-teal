import Phaser, { NONE } from "phaser";
import Board from "../objects/Board";
import PauseMenu from "../objects/PauseMenu";

enum DirectionType {
    ROW,
    COL,
    NONE,
}
export default class MainScene extends Phaser.Scene {
    private gameBoard: Board;
    private scoreText: Phaser.GameObjects.Text;
    private score: number = 0;
    private pauseMenu: PauseMenu | null = null;

    constructor() {
        super({ key: "MainGameScene" });
    }

    create() {
        //console.log("Hello");
        const tileTypes = ["tile1", "tile2", "tile3", "tile4"];

        this.gameBoard = new Board(this, 4, 130, tileTypes);

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

    private handleKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case "Escape":
                if (this.pauseMenu) {
                    this.pauseMenu.togglePauseMenu();
                }
        }
        if (!this.gameBoard.isTileSelected()) return;

        let [currentRow, currentCol] = this.gameBoard.findSelectedTile();

        if (currentRow === -1 || currentCol === -1) {
            // Selected tile not found in the board, handle this case if needed
        }

        let newRow = currentRow;
        let newCol = currentCol;

        console.log(event.key);
        switch (event.key) {
            case "ArrowUp":
            case "w":
                newRow = Math.max(currentRow - 1, 0);
                break;
            case "ArrowDown":
            case "s":
                newRow = Math.min(
                    currentRow + 1,
                    this.gameBoard.getBoardSize() - 1
                );
                break;
            case "ArrowLeft":
            case "a":
                newCol = Math.max(currentCol - 1, 0);
                break;
            case "ArrowRight":
            case "d":
                newCol = Math.min(
                    currentCol + 1,
                    this.gameBoard.getBoardSize() - 1
                );
                break;
            case "r":
                this.gameBoard.selectTiles(currentRow, DirectionType.ROW);
                break;
            case "c":
                this.gameBoard.selectTiles(currentCol, DirectionType.COL);
                break;
            case "Enter":
                //console.log("enter pressed");
                if (this.gameBoard.handleRowColCheck(currentRow, currentCol)) {
                    this.addScore(10);
                }
                //console.log("enter pressed 2");
                break;
        }

        if (newRow !== currentRow || newCol !== currentCol) {
            console.log(newRow);
            console.log(newCol);
            this.gameBoard.swapTiles(currentRow, currentCol, newRow, newCol);
        }
    }

    private addScore(score: number) {
        this.score += score;
        this.scoreText.setText(`Score: ${this.score}`);

        const scoreFeedback = this.add.text(
            this.scoreText.x,
            this.scoreText.y,
            `+${score}`
        );

        this.tweens.add({
            targets: scoreFeedback,
            y: this.scoreText.y - 50,
            alpha: 0, // Fade out
            ease: "Cubic.easeOut",
            duration: 1000,
            onComplete: () => {
                console.log("score added");
                scoreFeedback.destroy();
            },
        });
    }
    private setScore(score: number) {
        this.score += score;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}
