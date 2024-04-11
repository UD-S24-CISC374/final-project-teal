import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("trueTile", "assets/tiles/trueTile.png");
        this.load.image("falseTile", "assets/tiles/falseTile.png");
        this.load.image("andTile", "assets/tiles/andTile.png");
        this.load.image("orTile", "assets/tiles/orTile.png");
        this.load.image("background", "assets/img/looseleaf.jpeg");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
