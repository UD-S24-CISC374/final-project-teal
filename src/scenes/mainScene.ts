import Phaser from "phaser";
import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private boardSize: number = 3;
    private imageSize: number = 64;
    private tiles: Phaser.GameObjects.Sprite[] = [];

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        const screenWidth = this.game.scale.width;
        const screenHeight = this.game.scale.height;

        this.generateTiledBoard(screenWidth, screenHeight);

        this.generateTiledBoard(screenWidth, screenHeight);

        this.tiles.forEach((tile) => {
            tile.setInteractive();
            tile.on("pointerdown", () => {
                console.log("Tile clicked!");
            });
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

        // Calculate the position to center the board
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
            }
        }
    }
}
