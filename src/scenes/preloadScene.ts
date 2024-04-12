import Phaser from "phaser";
import SFX from "../objects/SFX";

export default class PreloadScene extends Phaser.Scene {
    private sfx: SFX;

    constructor() {
        super({ key: "PreloadScene" });
        this.sfx = SFX.getInstance(this);
    }

    preload() {
        //consider having a preload function in the tile class to handle this like SFX does
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("trueTile", "assets/tiles/trueTile.png");
        this.load.image("falseTile", "assets/tiles/falseTile.png");
        this.load.image("andTile", "assets/tiles/andTile.png");
        this.load.image("orTile", "assets/tiles/orTile.png");
        this.load.image("background", "assets/img/looseleaf.jpeg");

        this.load.audio("backgroundMusic", "assets/music/bg-music-1.wav");

        this.sfx.preload();
    }

    create() {
        this.scene.start("MenuScene");
    }
}
