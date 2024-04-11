import Phaser from "phaser";
import Tile from "./Tile";

enum DirectionType {
    ROW,
    COL,
    NONE,
}

export default class Board {
    private scene: Phaser.Scene;
    private tiles: Tile[][];
    private boardSize: number;
    private tileSize: number;
    private tileTypes: string[];

    private selectedTile: Tile | null = null;
    private selectedTiles: Tile[] = [];

    private currentDirection: DirectionType = DirectionType.NONE;

    private isAnimating: boolean = false;

    constructor(
        scene: Phaser.Scene,
        boardSize: number,
        tileSize: number,
        tileTypes: string[]
    ) {
        this.scene = scene;
        this.boardSize = boardSize;
        this.tileSize = tileSize;
        this.tileTypes = tileTypes;
        this.tiles = this.generateBoard();
    }

    private generateBoard(): Tile[][] {
        const board: Tile[][] = [];

        const screenWidth = this.scene.game.scale.width;
        const screenHeight = this.scene.game.scale.height;
        const boardWidth = this.boardSize * this.tileSize;
        const boardHeight = this.boardSize * this.tileSize;
        const boardX = (screenWidth - boardWidth) / 2;
        const boardY = (screenHeight - boardHeight) / 2;

        for (let row = 0; row < this.boardSize; row++) {
            board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                //console.log("tile created");
                const tileX = boardX + col * this.tileSize;
                const tileY = boardY + row * this.tileSize;
                const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
                const tile = new Tile(this.scene, tileX, tileY, tileTypeKey);
                tile.setInteractive();
                tile.on("pointerdown", this.selectTile.bind(this, tile));
                tile.setOrigin(0, 0);
                tile.setScale(1);
                board[row][col] = tile;
            }
        }

        return board;
    }

    private selectTile(tile: Tile) {
        this.unselectTiles();
        if (this.selectedTile) {
            this.selectedTile.setTint(0xffffff); // Reset tint of previously selected tile
        }
        this.selectedTile = tile;
        tile.setTint(0xff0000); // Tint the selected tile red
    }
    public swapTiles(row1: number, col1: number, row2: number, col2: number) {
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        this.unselectTiles();
        const tile1 = this.tiles[row1][col1];
        const tile2 = this.tiles[row2][col2];
        console.log(tile1, tile2);
        const tweenDuration = 300;
        //create tile1 tween
        this.scene.tweens.add({
            targets: tile1,
            x: tile2.x,
            y: tile2.y,
            duration: tweenDuration,
            onComplete: () => {
                this.isAnimating = false;
                this.tiles[row2][col2] = tile1;
                this.selectedTile?.setTint(0xffffff);
                this.selectedTile = null; // Deselect the tile after swapping
                console.log("tween1 complete");
            },
        });
        //create tile2 tween
        this.scene.tweens.add({
            targets: tile2,
            x: tile1.x,
            y: tile1.y,
            duration: tweenDuration,
            onComplete: () => {
                this.tiles[row1][col1] = tile2;
                console.log("tween2 complete");
            },
        });
        console.log("adding tween");
    }

    public selectTiles(directionIndex: number, direction: DirectionType) {
        this.unselectTiles();
        this.currentDirection = direction;
        if (direction == DirectionType.ROW) {
            for (let tileIndex = 0; tileIndex < this.boardSize; tileIndex++) {
                const tile = this.tiles[directionIndex][tileIndex];
                this.selectedTiles.push(tile);
                tile.setTint(0x00ff00);
            }
        } else if (direction == DirectionType.COL) {
            for (let tileIndex = 0; tileIndex < this.boardSize; tileIndex++) {
                const tile = this.tiles[tileIndex][directionIndex];
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

    private checkRow(currentRow: number): boolean {
        if (this.checkLine(this.tiles[currentRow])) {
            this.removeTilesRow(currentRow);
            return true;
        }

        this.shakeTiles();
        return false;
    }

    // function to check if a row or column equates to true. ONLY WORKS FOR 3x3
    private checkLine(line: Tile[]): boolean {
        let firstTileType = line[0].tileType;

        if (firstTileType === "trueTile") {
            if (line[1].tileType === "orTile") {
                if (
                    line[2].tileType === "trueTile" ||
                    line[2].tileType === "falseTile"
                ) {
                    return true;
                }
            } else if (line[1].tileType === "andTile") {
                if (line[2].tileType === "trueTile") {
                    return true;
                }
            }
        } else if (firstTileType === "falseTile") {
            if (line[1].tileType === "orTile") {
                if (line[2].tileType === "trueTile") {
                    return true;
                }
            } else if (line[1].tileType === "andTile") {
                if (line[2].tileType === "falseTile") {
                    return true;
                }
            }
        }
        return false;
    }

    private removeTilesRow(currentRow: number) {
        // remove all the tiles in the current row
        for (let col = 0; col < this.boardSize; col++) {
            const tile = this.tiles[currentRow][col];
            tile.destroy();
        }

        // move all the tiles above the current row down
        for (let row = currentRow; row > 0; row--) {
            for (let col = 0; col < this.boardSize; col++) {
                const tile = this.tiles[row - 1][col];
                this.tiles[row][col] = tile;
                this.scene.tweens.add({
                    targets: tile,
                    y: tile.y + this.tileSize,
                    duration: 300,
                });
            }
        }
        this.addTilesRow();
    }

    private addTilesRow() {
        for (let col = 0; col < this.boardSize; col++) {
            const tileX = this.tiles[0][col].x;
            const tileY = this.tiles[0][col].y;
            const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
            const tile = new Tile(
                this.scene,
                tileX,
                tileY - this.tileSize,
                tileTypeKey
            );

            tile.setInteractive();
            tile.on("pointerdown", this.selectTile.bind(this, tile));
            tile.setOrigin(0, 0);
            tile.setScale(1);
            this.tiles[0][col] = tile;

            this.scene.tweens.add({
                targets: tile,
                y: tile.y + this.tileSize,
                duration: 300,
            });
        }
    }

    private checkCol(currentCol: number): boolean {
        let column = this.tiles.map((row) => row[currentCol]);
        if (this.checkLine(column)) {
            this.removeTilesCol(currentCol);
            return true;
        }
        this.shakeTiles();
        return false;
    }

    private removeTilesCol(currentCol: number) {
        for (let row = 0; row < this.boardSize; row++) {
            const tile = this.tiles[row][currentCol];
            tile.destroy();
        }
        //this.addScore(10);
        this.addTilesCol(currentCol);
    }

    private addTilesCol(currentCol: number) {
        for (let row = 0; row < this.boardSize; row++) {
            const tileX = this.tiles[row][currentCol].x;
            const tileY = this.tiles[row][0].y;
            const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
            const tile = new Tile(
                this.scene,
                tileX,
                tileY - this.boardSize * this.tileSize,
                tileTypeKey
            );
            tile.setInteractive();
            tile.on("pointerdown", this.selectTile.bind(this, tile));
            tile.setOrigin(0, 0);
            tile.setScale(1);
            this.tiles[row][currentCol] = tile;

            this.scene.tweens.add({
                targets: tile,
                y: tile.y + this.tileSize * this.boardSize,
                duration: 450,
            });
        }
    }

    private shakeTiles() {
        console.log("shaking tiles");
        this.selectedTiles.forEach((tile) => {
            const originalX = tile.x;
            const originalY = tile.y;

            this.scene.tweens.add({
                targets: tile,
                duration: 100, // Duration of each shake segment
                repeat: 2, // Number of shakes
                yoyo: true, // Go back and forth
                ease: "Sine.easeInOut", // Easing function to make it smooth
                x: {
                    getStart: () => originalX - 5, // Start 5 pixels to the left
                    getEnd: () => originalX + 5, // End 5 pixels to the right
                },
                onComplete: () => {
                    // Optional: Reset sprite position after shaking, in case of rounding errors
                    tile.x = originalX;
                    tile.y = originalY;
                },
            });
        });
    }

    public isTileSelected(): boolean {
        return this.selectedTile !== null;
    }

    public findSelectedTile(): number[] {
        if (!this.selectedTile) {
            return [-1, 1];
        }

        let currentRow = -1;
        let currentCol = -1;

        // Find the row and column of the selected tile
        for (let row = 0; row < this.boardSize; row++) {
            const col = this.tiles[row].indexOf(this.selectedTile);
            if (col !== -1) {
                currentCol = col;
                currentRow = row;
                break;
            }
        }

        return [currentRow, currentCol];
    }

    public getBoardSize(): number {
        return this.boardSize;
    }

    public handleRowColCheck(currentRow: number, currentCol: number): boolean {
        if (this.currentDirection == DirectionType.ROW) {
            return this.checkRow(currentRow);
        } else if (this.currentDirection == DirectionType.COL) {
            return this.checkCol(currentCol);
        }

        this.currentDirection = DirectionType.NONE;
        return false;
    }
}
