import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private boardSize: number = 3;
    private imageSize: number = 130;
    private tiles: Phaser.GameObjects.Sprite[] = [];
    private score: number = 0;
    private tileTypes: string[];
    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        const screenWidth = this.game.scale.width;
        const screenHeight = this.game.scale.height;
        this.tileTypes = ["tile1", "tile2", "tile3", "tile4"];

        this.generateTiledBoard(screenWidth, screenHeight);

        this.tiles.forEach((tile) => {
            tile.setInteractive();
            tile.on("pointerdown", () => {
                console.log("Tile clicked!");
            });
        });
    }

    update() {}
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

                const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);

                const tile = this.add.sprite(tileX, tileY, tileTypeKey);
                tile.setOrigin(0, 0);
                tile.setScale(1);

                this.tiles.push(tile);
            }
        }
    }
}
