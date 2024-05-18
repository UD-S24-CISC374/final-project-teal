import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Game from "../objects/Game";
import baseScene from "./baseScene";
import Button from "../objects/Button";
import Sketch from "../objects/Sketch";

export default class ControlScene extends baseScene {
    constructor() {
        super({ key: "ControlScene" });
        this.sfx = SFX.getInstance(this);
    }

    init(data: Game) {
        this.gameData = data;
    }

    create() {
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        const screenCenterX = (this.game.config.width as number) * 0.5;
        const screenCenterY = (this.game.config.height as number) * 0.5;

        // Add title text
        const titleText = this.add.text(
            screenCenterX,
            screenCenterY * 0.3,
            "Boolean Bonanza! Controls",
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
        const backButton = new Button(
            this,
            70,
            70,
            "Back",
            () => {
                this.scene.start("MenuScene");
            },
            "24px"
        );
        backButton.setDepth(1);

        const maxWidth = this.game.config.width as number;
        const maxHeight = this.game.config.height as number;

        new Sketch(this, 150, 150, 120);
        new Sketch(this, maxWidth - 150, 200, 120);
        new Sketch(this, maxWidth - 150, maxHeight - 150, 120);
        new Sketch(this, 100, maxHeight - 150, 120);
    }
}
