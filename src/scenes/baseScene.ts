import Phaser from "phaser";
import PauseMenu from "../objects/PauseMenu";
import { DirectionType } from "../types/DirectionType";
import Board from "../objects/Board";

export default class baseScene extends Phaser.Scene {
    protected score: number = 0;
    protected scoreText: Phaser.GameObjects.Text;
    protected pauseMenu: PauseMenu | null = null;
    protected gameBoard: Board;

    handleKeydown(event: KeyboardEvent) {
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

        //console.log(event.key);
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
                if (this.gameBoard.handleRowColCheck(currentRow, currentCol)) {
                    this.addScore(10);
                }
                break;
        }

        if (
            newRow >= 0 &&
            newRow < this.gameBoard.getBoardSize() &&
            newCol >= 0 &&
            newCol < this.gameBoard.getBoardSize()
        ) {
            if (newRow !== currentRow || newCol !== currentCol) {
                console.log(newRow);
                console.log(newCol);
                this.gameBoard.swapTiles(
                    currentRow,
                    currentCol,
                    newRow,
                    newCol
                );
            }
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

    protected getGameBoard(): Board {
        return this.gameBoard;
    }
    protected getScore(): number {
        return this.score;
    }
    protected getPauseMenu(): PauseMenu | null {
        return this.pauseMenu;
    }
    protected getScoreText(): Phaser.GameObjects.Text {
        return this.scoreText;
    }
}
