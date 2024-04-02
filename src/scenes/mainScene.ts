import Phaser from "phaser";
import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private boardSize: number = 3;
    private imageSize: number = 64;
    private tiles: Phaser.GameObjects.Sprite[] = [];
    private boardPositions: { [key: string]: { row: number; col: number } } =
        {};
    private draggingTile: Phaser.GameObjects.Sprite | null = null;

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        console.log("Hello");
        const screenWidth = this.game.scale.width;
        const screenHeight = this.game.scale.height;

        this.generateTiledBoard(screenWidth, screenHeight);

        this.tiles.forEach((tile) => {
            tile.setInteractive();
            tile.on("pointerdown", this.startDragging.bind(this));
            tile.on("pointerup", this.stopDragging.bind(this));
            tile.on("pointerover", this.updateDragging.bind(this));
        });

        this.fpsText = new FpsText(this);
        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);
    }

    update() {
        this.fpsText.update();
    }
    private generateTiledBoard(screenWidth: number, screenHeight: number) {
        const tileSize = this.imageSize;
        const boardWidth = this.boardSize * tileSize;
        const boardHeight = this.boardSize * tileSize;

        const boardX = (screenWidth - boardWidth) / 2;
        const boardY = (screenHeight - boardHeight) / 2;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const tileX = boardX + col * tileSize;
                const tileY = boardY + row * tileSize;

                const tile = this.add.sprite(tileX, tileY, "tileImage");
                tile.setOrigin(0, 0);
                tile.setScale(1);

                this.tiles.push(tile);
                this.boardPositions[`${row},${col}`] = { row, col };
            }
        }
    }

    private startDragging(
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Sprite
    ) {
        console.log("test!");
        this.draggingTile = gameObject;
        this.input.setTopOnly(true);
    }

    private stopDragging() {
        this.input.setTopOnly(false);
        this.draggingTile = null;
    }

    private updateDragging(
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Sprite
    ) {
        if (!this.draggingTile) return;

        const dragTileRow = this.draggingTile.data.get("row");
        const dragTileCol = this.draggingTile.data.get("col");

        if (dragTileRow === undefined || dragTileCol === undefined) return;

        const dragTilePosition =
            this.boardPositions[`${dragTileRow},${dragTileCol}`];
        const targetPosition =
            this.boardPositions[
                `${gameObject.data.get("row")},${gameObject.data.get("col")}`
            ];

        if (this.isAdjacentTile(dragTilePosition, targetPosition)) {
            this.swapTiles(this.draggingTile, gameObject);
        }
    }

    private isAdjacentTile(
        pos1: { row: number; col: number },
        pos2: { row: number; col: number }
    ) {
        return (
            (Math.abs(pos1.row - pos2.row) === 1 && pos1.col === pos2.col) ||
            (Math.abs(pos1.col - pos2.col) === 1 && pos1.row === pos2.row)
        );
    }

    private swapTiles(
        tile1: Phaser.GameObjects.Sprite,
        tile2: Phaser.GameObjects.Sprite
    ) {
        const tileSize = this.imageSize;
        const tile1Position =
            this.boardPositions[
                `${tile1.data.get("row")},${tile1.data.get("col")}`
            ];
        const tile2Position =
            this.boardPositions[
                `${tile2.data.get("row")},${tile2.data.get("col")}`
            ];

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
                this.boardPositions[
                    `${tile1Position.row},${tile1Position.col}`
                ] = tile2Position;
                this.boardPositions[
                    `${tile2Position.row},${tile2Position.col}`
                ] = tile1Position;
                tile1.data.set("row", tile2Position.row);
                tile1.data.set("col", tile2Position.col);
                tile2.data.set("row", tile1Position.row);
                tile2.data.set("col", tile1Position.col);
            },
        });
    }
}
