import Phaser from "phaser";
import PauseMenu from "../objects/PauseMenu";
import { DirectionType } from "../types/DirectionType";
import Board from "../objects/Board";
import Game from "../objects/Game";
import SFX from "../objects/SFX";

export default class baseScene extends Phaser.Scene {
    protected score: number = 0;
    protected scoreText: Phaser.GameObjects.Text;
    protected timerValue: number = 1000;
    protected timerText: Phaser.GameObjects.Text;
    protected livesValue: number = 3;
    protected livesText: Phaser.GameObjects.Text;
    protected restartText: Phaser.GameObjects.Text;
    protected swapsValue: number = 3;
    protected swapsText: Phaser.GameObjects.Text;
    protected pauseMenu: PauseMenu | null = null;
    protected gameBoard: Board;
    protected gameData: Game;
    protected anyValidSolutions: boolean | undefined = false;
    protected sfx: SFX;

    handleKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case "Escape":
                if (this.pauseMenu) {
                    this.pauseMenu.togglePauseMenu();
                }
                break;
            case "Enter":
                if (!this.anyValidSolutions) {
                    this.gameBoard.regenerateBoard();
                    this.anyValidSolutions =
                        this.gameBoard.isPossibleSolution();
                    this.restartText.visible = !this.anyValidSolutions;
                    this.sfx.play("crumple-paper-1");
                }
                break;
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
                if (
                    this.gameBoard.handleRowColCheck(
                        currentRow,
                        currentCol,
                        () => {}
                    )
                ) {
                    this.addScore(10);
                    this.addSwaps(this.getGameBoard().getBoardSize());
                    if (
                        this.checkObjectives(
                            this.gameBoard.lastRemovedTileTypes
                        )
                    ) {
                        this.completeGame();
                    }
                    this.anyValidSolutions =
                        this.gameBoard.isPossibleSolution();
                    this.restartText.visible = !this.anyValidSolutions;
                } else {
                    this.gameBoard.handleRowColCheck(
                        currentRow,
                        currentCol,
                        () => {
                            this.subtractLife();
                        }
                    );
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
                this.gameBoard.swapTiles(
                    currentRow,
                    currentCol,
                    newRow,
                    newCol,
                    () => {
                        this.subtractSwap(); // will be called after the swap animation is done
                    }
                );
            }
        }
    }

    private checkObjectives(tileTypes: string[]): boolean {
        if (this.gameData.objectives.length == 0) {
            return false;
        }
        let allTrue = true;
        this.gameData.objectives.forEach((objective) => {
            objective.checkObjective(tileTypes);
            if (!objective.isCompleted()) {
                allTrue = false;
            }
        });

        return allTrue;
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
    private subtractLife() {
        this.livesValue--;
        this.livesText.setText(`Lives: ${this.livesValue}`);
    }
    private addSwaps(swaps: number) {
        this.swapsValue += swaps;
        this.swapsText.setText(`Swaps: ${this.swapsValue}`);
    }
    private subtractSwap() {
        this.swapsValue--;
        this.swapsText.setText(`Swaps: ${this.swapsValue}`);
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
    protected endGame(message: string) {
        console.log("game over:");
        //create game over screen
        this.scene.start("GameOverScene", {
            lastScene: this.scene.key,
            message: message,
        });
    }
    protected completeGame() {
        console.log("game won:");
        //create game victory screen
        this.scene.start("GameVictoryScene"); //replace this with victory
    }
}
