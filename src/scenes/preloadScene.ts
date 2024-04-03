import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("tile1", "assets/tiles/tile1.png");
        this.load.image("tile2", "assets/tiles/tile2.png");
        this.load.image("tile3", "assets/tiles/tile3.png");
        this.load.image("tile4", "assets/tiles/tile4.png");
    }

    create() {
        this.scene.start("MainScene");
    }
}
