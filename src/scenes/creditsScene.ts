import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Button from "../objects/Button";
import Sketch from "../objects/Sketch";

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

        /*const backButton = */ new Button(
            this,
            70,
            70,
            "Back",
            () => {
                this.scene.start("MenuScene");
            },
            "24px"
        );

        const maxWidth = this.game.config.width as number;
        const maxHeight = this.game.config.height as number;

        new Sketch(this, 150, 150, 120);
        new Sketch(this, maxWidth - 150, 200, 120);
        new Sketch(this, maxWidth - 150, maxHeight - 150, 120);
        new Sketch(this, 100, maxHeight - 150, 120);
    }
}
