import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
<<<<<<< HEAD
    private boardSize: number = 8;
    private imageSize: number = 64;
    private tiles: Phaser.GameObjects.Sprite[] = [];
    private tilePositions: Phaser.GameObjects.Sprite[][] = [];
    private draggingTile: Phaser.GameObjects.Sprite | null = null;

=======
    private boardSize: number = 3;
    private imageSize: number = 130;
    private tiles: Phaser.GameObjects.Sprite[] = [];
    private score: number = 0;
    private tileTypes: string[];
>>>>>>> 43c4843b4ae50f4b431e2ab3684d0aed7cf84de6
    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        console.log("Hello");
        const screenWidth = this.game.scale.width;
        const screenHeight = this.game.scale.height;
        this.tileTypes = ["tile1", "tile2", "tile3", "tile4"];

        this.tiles.forEach((tile) => {
            tile.setInteractive();
            tile.on("pointerdown", this.startDragging.bind(this));
            tile.on("pointerup", this.stopDragging.bind(this));
            tile.on("pointerover", this.updateDragging.bind(this));
        });
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
                tile.setOrigin(0, 0);
                tile.setScale(1);

                this.tiles.push(tile);
                this.tilePositions[row][col] = tile;
            }
        }
    }

    private startDragging(
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Sprite
    ) {
        console.log("Tile Clicked");
        this.draggingTile = gameObject;
        this.input.setTopOnly(true);
    }

    private stopDragging() {
        console.log("Tile Released");
        this.input.setTopOnly(false);
        this.draggingTile = null;
    }

    private updateDragging(
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Sprite
    ) {
        if (!this.draggingTile) return;
        console.log("Dragging");
        const dragTileRow =
            (this.tiles.indexOf(this.draggingTile) / this.boardSize) | 0;
        const dragTileCol =
            this.tiles.indexOf(this.draggingTile) % this.boardSize;
        const targetRow = (this.tiles.indexOf(gameObject) / this.boardSize) | 0;
        const targetCol = this.tiles.indexOf(gameObject) % this.boardSize;

        if (
            this.isAdjacentTile(dragTileRow, dragTileCol, targetRow, targetCol)
        ) {
            this.swapTiles(dragTileRow, dragTileCol, targetRow, targetCol);
        }
    }

    private isAdjacentTile(
        row1: number,
        col1: number,
        row2: number,
        col2: number
    ) {
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    }

    private swapTiles(row1: number, col1: number, row2: number, col2: number) {
        console.log("swapping");
        const tileSize = this.imageSize;
        const tile1 = this.tilePositions[row1][col1];
        const tile2 = this.tilePositions[row2][col2];

        this.tweens.add({
            targets: [tile1, tile2],
            x: {
                getEndValue: () => {
                    if (this.draggingTile === tile1) {
                        return tile2.x;
                    } else {
                        return tile1.x;
                    }
                },
            },
            y: {
                getEndValue: () => {
                    if (this.draggingTile === tile1) {
                        return tile2.y;
                    } else {
                        return tile1.y;
                    }
                },
            },
            duration: 200,
            onComplete: () => {
                this.tilePositions[row1][col1] = tile2;
                this.tilePositions[row2][col2] = tile1;
            },
        });
    }
}
