import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("tile1", "assets/tiles/trueTile.png");
        this.load.image("tile2", "assets/tiles/falseTile.png");
        this.load.image("tile3", "assets/tiles/andTile.png");
        this.load.image("tile4", "assets/tiles/orTile.png");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
