import Phaser from "phaser";
import SFX from "../objects/SFX";
import Sketch from "../objects/Sketch";

export default class PreloadScene extends Phaser.Scene {
    private sfx: SFX;

    constructor() {
        super({ key: "PreloadScene" });
        this.sfx = SFX.getInstance(this);
    }

    preload() {
        //consider having a preload function in the tile class to handle this like SFX does
        this.load.image("trueTile", "assets/tiles/trueTile.png");
        this.load.image("falseTile", "assets/tiles/falseTile.png");
        this.load.image("andTile", "assets/tiles/andTile.png");
        this.load.image("orTile", "assets/tiles/orTile.png");
        this.load.image("leftParenTile", "assets/tiles/leftParenTile.png");
        this.load.image("rightParenTile", "assets/tiles/rightParenTile.png");
        this.load.image("xorTile", "assets/tiles/xorTile.png");
        this.load.image("notTile", "assets/tiles/notTile.png");

        this.load.image(
            "leftParenTileSelect",
            "assets/tiles/leftParenTileSelect.png"
        );
        this.load.image(
            "rightParenTileSelect",
            "assets/tiles/rightParenTileSelect.png"
        );
        this.load.image("notTileSelect", "assets/tiles/notTileSelect.png");
        this.load.image("xorTileSelect", "assets/tiles/xorTileSelect.png");
        this.load.image("orTileSelect", "assets/tiles/orTileSelect.png");
        this.load.image("andTileSelect", "assets/tiles/andTileSelect.png");
        this.load.image("trueTileSelect", "assets/tiles/trueTileSelect.png");
        this.load.image("falseTileSelect", "assets/tiles/falseTileSelect.png");

        this.load.image("background", "assets/img/looseleaf.jpeg");
        this.load.image("title", "assets/img/title-screen-boolean-bonanza.png");

        this.load.audio("backgroundMusic", "assets/music/bg-music-1.wav");

        this.sfx.preload();
        Sketch.preload(this);
    }

    create() {
        this.scene.start("MenuScene");
    }
}
