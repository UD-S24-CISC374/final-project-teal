import Phaser from "phaser";
import Background from "../objects/Background";
import victorySketch from "../objects/victorySketch";
import Button from "../objects/Button";

export default class GameVictoryScene extends Phaser.Scene {
    private lastScene: string;

    constructor() {
        super({ key: "GameVictoryScene" });
    }

    init() {}

    create() {
        const width: number = this.game.config.width as number;
        const height: number = this.game.config.height as number;
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        this.add.image(width * 0.5, height * 0.2, "complete").setOrigin(0.5);

        new victorySketch(
            this,
            width * 0.2,
            height * 0.6,
            200,
            1.5,
            1.5,
            -15,
            15
        );

        new victorySketch(
            this,
            width * 0.8,
            height * 0.6,
            200,
            1.5,
            1.5,
            -15,
            15
        );

        new Button(this, width * 0.5, height * 0.6, "Next Level", () => {
            this.scene.start("MenuScene");
        });

        new Button(this, width * 0.5, height * 0.7, "Menu", () => {
            this.scene.start("MenuScene");
        });
    }
}
