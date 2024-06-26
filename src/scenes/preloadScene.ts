import Phaser from "phaser";
import SFX from "../objects/SFX";
import Sketch from "../objects/Sketch";
import victorySketch from "../objects/victorySketch";

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

        this.load.image(
            "sliderHandle",
            "assets/img/soundSprites/sliderHandle.png"
        );
        this.load.image("soundMute", "assets/img/soundSprites/soundMute.png");
        this.load.image("soundLow", "assets/img/soundSprites/soundLow.png");
        this.load.image(
            "soundMedium",
            "assets/img/soundSprites/soundMedium.png"
        );
        this.load.image("soundHigh", "assets/img/soundSprites/soundHigh.png");

        this.load.audio("backgroundMusic", "assets/music/bg-music-1.wav");

        this.load.image("gameOver", "assets/img/game-over.png");
        this.load.image(
            "crumbleBackground",
            "assets/img/crumbled-paper-background.png"
        );
        this.load.image("fail", "assets/img/fail.png");
        this.load.image("complete", "assets/img/level-complete.png");

        this.sfx.preload();
        Sketch.preload(this);
        victorySketch.preload(this);
    }

    create() {
        this.scene.start("MenuScene");
    }
}
