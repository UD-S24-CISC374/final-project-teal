import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Button from "../objects/Button";
import Sketch from "../objects/Sketch";

export default class MenuScene extends Phaser.Scene {
    private sfx: SFX;

    constructor() {
        super({ key: "MenuScene" });
        this.sfx = SFX.getInstance(this);
    }

    create() {
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        this.sfx.create();

        // Add title text

        const titleImg = this.add.image(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.25,
            "title"
        );
        titleImg.setOrigin(0.5);
        titleImg.setScale(1.2);

        this.tweens.add({
            targets: titleImg,
            scale: 1.4,
            duration: 1200, // Duration of the tween in milliseconds
            yoyo: true, // Reverse the tween on completion
            repeat: -1, // Repeat indefinitely
            ease: "Sine.easeInOut", // Easing function for smooth animation
        });

        // Add Play button
        const middleWidth = (this.game.config.width as number) * 0.5;
        const middleHeight = (this.game.config.height as number) * 0.5;
        const buttonSpacing = (this.game.config.height as number) * 0.1;
        let index = 0;
        /*const playButton = */ new Button(
            this,
            middleWidth,
            middleHeight + buttonSpacing * index,
            "Play",
            () => {
                this.scene.start("ProgressionScene");
            }
        );
        index++;
        /*const settingsButton = */ new Button(
            this,
            middleWidth,
            middleHeight + buttonSpacing * index,
            "Settings",
            () => {
                this.scene.start("SettingsScene");
            }
        );

        index++;
        /*const controlsButton = */ new Button(
            this,
            middleWidth,
            middleHeight + buttonSpacing * index,
            "Controls",
            () => {
                this.scene.start("ControlScene");
            }
        );

        index++;
        /*const creditsButton = */ new Button(
            this,
            middleWidth,
            middleHeight + buttonSpacing * index,
            "Credits",
            () => {
                this.scene.start("CreditsScene");
            }
        );

        const maxWidth = this.game.config.width as number;
        const maxHeight = this.game.config.height as number;

        new Sketch(this, 150, 150, 120);
        new Sketch(this, maxWidth - 150, 200, 120);
        new Sketch(this, maxWidth - 150, maxHeight - 150, 120);
        new Sketch(this, 100, maxHeight - 150, 120);
    }
}
