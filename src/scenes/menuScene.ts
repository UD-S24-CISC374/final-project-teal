import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    create() {
        // Add title text
        const titleText = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.3,
            "Boolean Bonanza!",
            {
                fontSize: "80px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        titleText.setOrigin(0.5);

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
            this.scene.start("MainGameScene");
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
            // Add tutorial functionality here
            this.scene.start("TutorialScene");
        });
    }
}
