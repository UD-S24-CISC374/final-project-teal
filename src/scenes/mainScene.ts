import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private boardSize: number = 4;
    private imageSize: number = 130;
    private score: number = 0;
    private tileTypes: string[];
    private tilePositions: Phaser.GameObjects.Sprite[][] = []; //tile sprites (edit name)
    private selectedTile: Phaser.GameObjects.Sprite | null = null;

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        console.log("Hello");
        const screenWidth = this.game.scale.width;
        const screenHeight = this.game.scale.height;
        this.tileTypes = ["tile1", "tile2", "tile3", "tile4"];

        this.generateTiledBoard(screenWidth, screenHeight);

        // Add input event listeners
        this.input.keyboard?.on("keydown", this.handleKeydown, this);
    }

    update() {}

    private generateTiledBoard(screenWidth: number, screenHeight: number) {
        const tileSize = this.imageSize;
        const boardWidth = this.boardSize * tileSize;
        const boardHeight = this.boardSize * tileSize;

        const boardX = (screenWidth - boardWidth) / 2;
        const boardY = (screenHeight - boardHeight) / 2;

        for (let row = 0; row < this.boardSize; row++) {
            this.tilePositions[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const tileX = boardX + col * tileSize;
                const tileY = boardY + row * tileSize;

                const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);

                const tile = this.add.sprite(tileX, tileY, tileTypeKey);
                tile.setInteractive();
                tile.on("pointerdown", this.selectTile.bind(this, tile));
                tile.setOrigin(0, 0);
                tile.setScale(1);

                this.tilePositions[row][col] = tile;
            }
        }
    }

    private selectTile(tile: Phaser.GameObjects.Sprite) {
        if (this.selectedTile) {
            this.selectedTile.setTint(0xffffff); // Reset tint of previously selected tile
        }
        this.selectedTile = tile;
        tile.setTint(0xff0000); // Tint the selected tile red
    }

    private handleKeydown(event: KeyboardEvent) {
        if (!this.selectedTile) return;

        let currentRow = -1;
        let currentCol = -1;

        // Find the row and column of the selected tile
        for (let row = 0; row < this.boardSize; row++) {
            const col = this.tilePositions[row].indexOf(this.selectedTile);
            if (col !== -1) {
                currentCol = col;
                currentRow = row;
                break;
            }
        }

        if (currentRow === -1 || currentCol === -1) {
            // Selected tile not found in the board, handle this case if needed
            return;
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
                newRow = Math.min(currentRow + 1, this.boardSize - 1);
                break;
            case "ArrowLeft":
            case "a":
                newCol = Math.max(currentCol - 1, 0);
                break;
            case "ArrowRight":
            case "d":
                newCol = Math.min(currentCol + 1, this.boardSize - 1);
                break;
        }

        if (newRow !== currentRow || newCol !== currentCol) {
            console.log(newRow);
            console.log(newCol);
            this.swapTiles(currentRow, currentCol, newRow, newCol);
        }
    }

    private swapTiles(row1: number, col1: number, row2: number, col2: number) {
        const tile1 = this.tilePositions[row1][col1];
        const tile2 = this.tilePositions[row2][col2];
        console.log(tile1, tile2);
        const tweenDuration = 300;
        //create tile1 tween
        this.tweens.add({
            targets: tile1,
            x: tile2.x,
            y: tile2.y,
            duration: tweenDuration,
            onComplete: () => {
                this.tilePositions[row2][col2] = tile1;
                this.selectedTile?.setTint(0xffffff);
                this.selectedTile = null; // Deselect the tile after swapping
                console.log("tween1 complete");
            },
        });
        //create tile2 tween
        this.tweens.add({
            targets: tile2,
            x: tile1.x,
            y: tile1.y,
            duration: tweenDuration,
            onComplete: () => {
                this.tilePositions[row1][col1] = tile2;
                console.log("tween2 complete");
            },
        });
        console.log("adding tween");
    }
}
