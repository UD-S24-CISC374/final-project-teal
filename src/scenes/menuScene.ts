import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";

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

        // Add Play button
        const playButton = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.5,
            "Play",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: {
                    x: 20,
                    y: 10,
                },
            }
        );
        playButton.setOrigin(0.5);
        playButton.setInteractive();
        playButton.on("pointerdown", () => {
            // Start the game scene when Play button is clicked
            this.scene.start("ProgressionScene");
            this.sfx.play("pop-click-1");
        });

        // Add Settings button
        const settingsButton = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.6,
            "Settings",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: {
                    x: 20,
                    y: 10,
                },
            }
        );
        settingsButton.setOrigin(0.5);
        settingsButton.setInteractive();
        settingsButton.on("pointerdown", () => {
            // Add settings functionality here
        });

        // Add Tutorial button
        const tutorialButton = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.7,
            "Tutorial",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: {
                    x: 20,
                    y: 10,
                },
            }
        );
        tutorialButton.setOrigin(0.5);
        tutorialButton.setInteractive();
        tutorialButton.on("pointerdown", () => {
            this.sfx.play("pop-click-1");
            // Add tutorial functionality here
            this.scene.start("TutorialScene");
        });
        const creditsButton = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.8,
            "Credits",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 20, y: 10 },
            }
        );
        creditsButton.setOrigin(0.5);
        creditsButton.setInteractive();
        creditsButton.on("pointerdown", () => {
            this.sfx.play("pop-click-1");
            this.scene.start("CreditsScene");
        });
    }
}
