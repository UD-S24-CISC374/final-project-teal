import Phaser from "phaser";
import Background from "../objects/Background";

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: "TutorialScene" });
    }

    create() {
        const backgroundImage = new Background(this, "background");
        backgroundImage.create();
        const screenCenterX = (this.game.config.width as number) * 0.5;
        const screenCenterY = (this.game.config.height as number) * 0.5;

        // Add title text
        const titleText = this.add.text(
            screenCenterX,
            screenCenterY * 0.3,
            "Boolean Bonanza! Tutorial",
            {
                fontSize: "36px",
                fontFamily: "Arial",
                color: "#000000",
            }
        );
        titleText.setOrigin(0.5);

        // Add controls text
        const controlsText = this.add.text(
            screenCenterX,
            screenCenterY,
            `Controls:
            Arrow Keys or WASD: Move selected tile
            R: Select entire row
            C: Select entire column
            Enter: Check selected row or column
            Esc: Pause`,
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#000000",
                align: "center",
            }
        );
        controlsText.setOrigin(0.5, 0.5);

        // Add a back button
        const backButton = this.add.text(
            screenCenterX,
            screenCenterY * 1.7,
            "Back",
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
        backButton.setOrigin(0.5);
        backButton.setInteractive();
        backButton.on("pointerdown", () => {
            // Go back to the menu scene when the back button is clicked
            this.scene.start("MenuScene");
        });
    }
}
