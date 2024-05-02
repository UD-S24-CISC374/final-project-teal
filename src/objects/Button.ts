import { GameObjects } from "phaser";
import SFX from "./SFX";

export default class Button extends GameObjects.Text {
    private defaultBackgroundColor: string;
    private hoverBackgroundColor: string;
    private hoverScale: number;
    private sfx: SFX;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        callback: () => void,
        fontSize = "32px",
        fontFamily = "Arial",
        color = "#ffffff",
        backgroundColor = "#4e342e",
        hoverBackgroundColor = "#8c6659",
        hoverScale = 1.1
    ) {
        super(scene, x, y, text, {
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: color,
            backgroundColor: backgroundColor,
            padding: { x: 20, y: 10 },
        });

        this.sfx = SFX.getInstance(scene);

        this.defaultBackgroundColor = backgroundColor;
        this.hoverBackgroundColor = hoverBackgroundColor;
        this.hoverScale = hoverScale;

        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setInteractive();

        // Set hover effect
        this.on("pointerover", () => {
            this.setStyle({ backgroundColor: this.hoverBackgroundColor });
            this.setScale(this.hoverScale);
        });
        this.on("pointerout", () => {
            this.setStyle({ backgroundColor: this.defaultBackgroundColor });
            this.setScale(1);
        });

        this.on("pointerdown", () => {
            callback();
            this.sfx.play("pop-click-1");
        });
    }
}
