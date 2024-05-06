import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Button from "../objects/Button";

export default class SettingsScene extends Phaser.Scene {
    private sfx: SFX;

    constructor() {
        super({ key: "SettingsScene" });
        this.sfx = SFX.getInstance(this);
    }

    create() {
        const sliderMinX = 600;
        const sliderStartX = 400;

        const sliderMaxX = sliderMinX + sliderStartX;
        const sliderY = (this.game.config.height as number) * 0.3;
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        this.sfx.create();

        const volume = this.sound.volume;
        const volumeMute = this.add
            .sprite(sliderMaxX + 50, sliderY, "soundMute")
            .setScale(0.4);
        const volumeLow = this.add
            .sprite(sliderMaxX + 50, sliderY, "soundLow")
            .setScale(0.4);
        const volumeMedium = this.add
            .sprite(sliderMaxX + 50, sliderY, "soundMedium")
            .setScale(0.4);
        const volumeHigh = this.add
            .sprite(sliderMaxX + 50, sliderY, "soundHigh")
            .setScale(0.4);

        volumeMute.setVisible(false);
        volumeLow.setVisible(false);
        volumeMedium.setVisible(false);

        const volumeText = this.add.text(
            350,
            200,
            `Volume: ${(volume * 100).toFixed(0)}%`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                align: "center",
                color: "#000",
            }
        );

        const settingsText = this.add.text(
            (this.game.config.width as number) * 0.5,
            (this.game.config.height as number) * 0.2,
            "Settings\n\n",
            {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
                align: "center",
            }
        );
        settingsText.setOrigin(0.5);

        const sliderBar = this.add.graphics();
        sliderBar.fillStyle(0x000000, 1);
        sliderBar.fillRect(sliderMinX, sliderY, sliderStartX, 5);

        const sliderHandle = this.add
            .sprite(sliderMinX, sliderY, "sliderHandle")
            .setInteractive();
        sliderHandle.setInteractive();

        const soundVolume = this.sound.volume;
        sliderHandle.x = sliderMinX + soundVolume * sliderStartX;

        this.input.setDraggable(sliderHandle);

        this.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject,
                dragX: number
            ) => {
                if (dragX >= sliderMinX && dragX <= sliderMaxX) {
                    (gameObject as Phaser.GameObjects.Image).x = dragX;

                    // Update the volume
                    const volume = (dragX - sliderMinX) / sliderStartX;
                    this.sound.volume = volume;

                    volumeText.setText(`Volume: ${(volume * 100).toFixed(0)}%`);

                    volumeMute.setVisible(volume < 0.01);
                    volumeLow.setVisible(volume > 0.01 && volume <= 0.33);
                    volumeMedium.setVisible(volume > 0.33 && volume <= 0.66);
                    volumeHigh.setVisible(volume > 0.66);
                }
            }
        );

        new Button(
            this,
            70,
            70,
            "Back",
            () => {
                this.scene.start("MenuScene");
            },
            "24px"
        );
    }
}
