import Phaser, { NONE } from "phaser";
import FpsText from "../objects/fpsText";

enum DirectionType {
    ROW,
    COL,
    NONE,
}
export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private boardSize: number = 4;
    private imageSize: number = 130;
    private score: number = 0;
    private tileTypes: string[];
    private tileSprites: Phaser.GameObjects.Sprite[][] = [];
    private selectedTile: Phaser.GameObjects.Sprite | null = null;
    private selectedTiles: Phaser.GameObjects.Sprite[] = [];
    private currentDirection: DirectionType = NONE;
    private currentDirectionIndex: -1;
    private isSwapping: boolean = false;

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
            this.tileSprites[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const tileX = boardX + col * tileSize;
                const tileY = boardY + row * tileSize;

                const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);

                const tile = this.add.sprite(tileX, tileY, tileTypeKey);
                tile.setInteractive();
                tile.on("pointerdown", this.selectTile.bind(this, tile));
                tile.setOrigin(0, 0);
                tile.setScale(1);

                this.tileSprites[row][col] = tile;
            }
        }
    }

    private selectTile(tile: Phaser.GameObjects.Sprite) {
        this.unselectTiles();
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
            const col = this.tileSprites[row].indexOf(this.selectedTile);
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
            case "r":
                this.selectTiles(currentRow, DirectionType.ROW);
                this.currentDirection = DirectionType.ROW;
                break;
            case "c":
                this.selectTiles(currentCol, DirectionType.COL);
                this.currentDirection = DirectionType.COL;
                break;
            case "Enter":
                //HANDLE ROW/COL CHECK FUNCTIONALITY
                if (this.currentDirection == DirectionType.ROW) {
                    this.removeTilesRow(currentRow);
                } else if (this.currentDirection == DirectionType.COL) {
                    this.removeTilesCol(currentCol);
                }

                this.currentDirection = DirectionType.NONE;
                break;
        }

        if (newRow !== currentRow || newCol !== currentCol) {
            console.log(newRow);
            console.log(newCol);
            this.swapTiles(currentRow, currentCol, newRow, newCol);
        }
    }
    private selectTiles(directionIndex: number, direction: DirectionType) {
        this.unselectTiles();
        if (direction == DirectionType.ROW) {
            console.log("test");
            for (let tileIndex = 0; tileIndex < this.boardSize; tileIndex++) {
                const tile = this.tileSprites[directionIndex][tileIndex];
                this.selectedTiles.push(tile);
                tile.setTint(0x00ff00);
            }
        } else if (direction == DirectionType.COL) {
            for (let tileIndex = 0; tileIndex < this.boardSize; tileIndex++) {
                const tile = this.tileSprites[tileIndex][directionIndex];
                this.selectedTiles.push(tile);
                tile.setTint(0x00ff00);
            }
        }
    }
    private unselectTiles() {
        while (this.selectedTiles.length > 0) {
            const tile = this.selectedTiles.shift();
            tile?.setTint(0xffffff);
        }
        this.currentDirection = DirectionType.NONE;
    }
    private swapTiles(row1: number, col1: number, row2: number, col2: number) {
        if (this.isSwapping) {
            return;
        }
        this.isSwapping = true;
        this.unselectTiles();
        const tile1 = this.tileSprites[row1][col1];
        const tile2 = this.tileSprites[row2][col2];
        console.log(tile1, tile2);
        const tweenDuration = 300;
        //create tile1 tween
        this.tweens.add({
            targets: tile1,
            x: tile2.x,
            y: tile2.y,
            duration: tweenDuration,
            onComplete: () => {
                this.isSwapping = false;
                this.tileSprites[row2][col2] = tile1;
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
                this.tileSprites[row1][col1] = tile2;
                console.log("tween2 complete");
            },
        });
        console.log("adding tween");
    }

    private removeTilesRow(currentRow: number) {
        // remove all the tiles in the current row
        for (let col = 0; col < this.boardSize; col++) {
            const tile = this.tileSprites[currentRow][col];
            tile.destroy();
        }

        // move all the tiles above the current row down
        for (let row = currentRow; row > 0; row--) {
            for (let col = 0; col < this.boardSize; col++) {
                const tile = this.tileSprites[row - 1][col];
                tile.y += this.imageSize;
                this.tileSprites[row][col] = tile;
            }
        }
        this.addTilesRow();
    }

    private addTilesRow() {
        for (let col = 0; col < this.boardSize; col++) {
            const tileX = this.tileSprites[0][col].x;

            let tileY;
            if (this.tileSprites[0][col].y > this.imageSize) {
                tileY = this.tileSprites[0][col].y - this.imageSize;
            } else {
                tileY = this.tileSprites[0][col].y;
            }

            const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
            const tile = this.add.sprite(tileX, tileY, tileTypeKey);
            tile.setInteractive();
            tile.on("pointerdown", this.selectTile.bind(this, tile));
            tile.setOrigin(0, 0);
            tile.setScale(1);
            this.tileSprites[0][col] = tile;
        }
    }

    private removeTilesCol(currentCol: number) {
        for (let row = 0; row < this.boardSize; row++) {
            const tile = this.tileSprites[row][currentCol];
            tile.destroy();
        }
        this.addTilesCol(currentCol);
    }

    private addTilesCol(currentCol: number) {
        for (let row = 0; row < this.boardSize; row++) {
            const tileX = this.tileSprites[row][currentCol].x;
            const tileY = this.tileSprites[row][0].y;
            const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
            const tile = this.add.sprite(tileX, tileY, tileTypeKey);
            tile.setInteractive();
            tile.on("pointerdown", this.selectTile.bind(this, tile));
            tile.setOrigin(0, 0);
            tile.setScale(1);
            this.tileSprites[row][currentCol] = tile;
        }
    }
}
