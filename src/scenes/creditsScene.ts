import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";

export default class CreditsScene extends Phaser.Scene {
    private sfx: SFX;

    constructor() {
        super({ key: "CreditsScene" });
        this.sfx = SFX.getInstance(this);
    }

    create() {
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        //this.sfx.create();

        // Add credits text or any other content you want to display in the CreditsScene
        const creditsText = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.3,
            "Credits\n\nDeveloped by: Patrick Tiamson & Angelo Ramos\nArtwork by: Angelo Ramos\nMusic & SFX by: Patrick Tiamson\n\n\nBackground Image from iStock",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
                align: "center",
            }
        );
        creditsText.setOrigin(0.5);

        const backButton = this.add.text(50, 50, "Back", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#ffffff",
            backgroundColor: "#4e342e",
            padding: { x: 20, y: 10 },
        });
        backButton.setInteractive();
        backButton.on("pointerdown", () => {
            // Go back to the progression scene
            this.sfx.play("pop-click-1");
            this.scene.start("MenuScene");
        });
    }
}