import Phaser from "phaser";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Button from "../objects/Button";
import Sketch from "../objects/Sketch";

export default class SettingsScene extends Phaser.Scene {
    private sfx: SFX;
    private music: Phaser.Sound.HTML5AudioSound;
    private sfxSounds: Map<string, Phaser.Sound.HTML5AudioSound>;

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

        this.music = this.sfx.getMusic();
        this.sfxSounds = this.sfx.getSFX();

        // get current volume
        const musicVolume = this.music.volume;
        const sfxVolume = this.sfxSounds.get("pop-click-1")?.volume;

        // create volume sprites
        const musicVolumeSliders = this.createVolumeSprites(
            sliderMaxX,
            sliderY,
            0
        );
        const SFXVolumeSliders = this.createVolumeSprites(
            sliderMaxX,
            sliderY,
            50
        );

        this.volumeSetVisible(musicVolumeSliders, musicVolume);
        this.volumeSetVisible(SFXVolumeSliders, sfxVolume || 0);

        const volumeText = this.add.text(
            350,
            200,
            `Music: ${(musicVolume * 100).toFixed(0)}%`,
            {
                fontSize: "32px",
                fontFamily: "Arial",
                align: "center",
                color: "#000",
            }
        );

        const SFXText = this.add.text(
            350,
            250,
            `SFX: ${(sfxVolume ? sfxVolume * 100 : 0).toFixed(0)}%`,
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

        // create slider bars
        const sliderBarMusic = this.add.graphics();
        sliderBarMusic.fillStyle(0x000000, 1);
        sliderBarMusic.fillRect(sliderMinX, sliderY, sliderStartX, 5);

        const sliderBarSFX = this.add.graphics();
        sliderBarSFX.fillStyle(0x000000, 1);
        sliderBarSFX.fillRect(sliderMinX, sliderY + 50, sliderStartX, 5);

        // create slider handles
        const sliderHandleMusic = this.add
            .sprite(sliderMinX, sliderY, "sliderHandle")
            .setInteractive();
        sliderHandleMusic.setInteractive();

        const sliderHandleSFX = this.add
            .sprite(sliderMinX, sliderY + 50, "sliderHandle")
            .setInteractive();
        sliderHandleSFX.setInteractive();

        // set the initial position of the slider handles
        const soundVolumeMusic = this.music.volume;
        sliderHandleMusic.x = sliderMinX + soundVolumeMusic * sliderStartX;

        const soundVolumeSFX = this.sfxSounds.get("pop-click-1")?.volume;
        sliderHandleSFX.x = sliderMinX + (soundVolumeSFX || 0) * sliderStartX;

        this.input.setDraggable(sliderHandleMusic);
        this.input.setDraggable(sliderHandleSFX);

        this.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject,
                dragX: number
            ) => {
                if (gameObject === sliderHandleMusic) {
                    if (dragX >= sliderMinX && dragX <= sliderMaxX) {
                        (gameObject as Phaser.GameObjects.Image).x = dragX;

                        // Update the volume
                        const volume = (dragX - sliderMinX) / sliderStartX;
                        this.music.volume = volume;

                        if (volume < 0.01) {
                            this.music.volume = 0;
                        }

                        volumeText.setText(
                            `Music: ${(volume * 100).toFixed(0)}%`
                        );
                        this.volumeSetVisible(musicVolumeSliders, volume);
                    }
                } else if (gameObject === sliderHandleSFX) {
                    if (dragX >= sliderMinX && dragX <= sliderMaxX) {
                        (gameObject as Phaser.GameObjects.Image).x = dragX;

                        // Update the volume
                        const volume = (dragX - sliderMinX) / sliderStartX;
                        this.sfxSounds.forEach((sfx) => {
                            sfx.volume = volume;
                        });

                        if (volume < 0.01) {
                            this.sfxSounds.forEach((sfx) => {
                                sfx.volume = 0;
                            });
                        }

                        SFXText.setText(`SFX: ${(volume * 100).toFixed(0)}%`);
                        this.volumeSetVisible(SFXVolumeSliders, volume);
                        this.sfx.play("pop-click-1");
                    }
                }
            }
        );

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
        new Sketch(this, maxWidth - 150, 120, 120);
        new Sketch(this, maxWidth - 150, maxHeight - 120, 120);
        new Sketch(this, 100, maxHeight - 150, 120);
    }

    // Create the volume sprite
    createVolumeSprites(
        sliderMaxX: number,
        sliderY: number,
        spriteYOffset: number
    ) {
        const spriteNames = [
            "soundMute",
            "soundLow",
            "soundMedium",
            "soundHigh",
        ];
        const volumeSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};

        spriteNames.forEach((volumeName) => {
            volumeSprites[volumeName] = this.add
                .sprite(sliderMaxX + 50, sliderY + spriteYOffset, volumeName)
                .setScale(0.4)
                .setVisible(false);
        });

        return volumeSprites;
    }

    // Set the volume sprites visible based on the volume
    volumeSetVisible(
        volumeSprites: { [key: string]: Phaser.GameObjects.Sprite },
        volume: number
    ) {
        volumeSprites.soundMute.setVisible(volume < 0.01);
        volumeSprites.soundLow.setVisible(volume > 0.01 && volume <= 0.33);
        volumeSprites.soundMedium.setVisible(volume > 0.33 && volume <= 0.66);
        volumeSprites.soundHigh.setVisible(volume > 0.66);
    }
}
