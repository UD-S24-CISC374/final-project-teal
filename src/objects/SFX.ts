import Phaser from "phaser";

export default class SFX {
    private static SFXInstance: SFX | undefined;
    private backgroundMusic: Phaser.Sound.HTML5AudioSound | undefined;

    private scene: Phaser.Scene;
    private sfxAudioKeys = [
        "click-1",
        "crumple-paper-1",
        "incorrect-1",
        "pop-1",
        "pop-click-1",
        "slide-1",
        "slide-2",
        "sweep-1",
    ];
    private sfxAudioMap: Map<string, Phaser.Sound.HTML5AudioSound>;

    private constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.sfxAudioMap = new Map();
    }

    preload() {
        this.sfxAudioKeys.forEach((key) => {
            this.scene.load.audio(key, `assets/sfx/${key}.wav`);
        });
    }

    create() {
        this.sfxAudioKeys.forEach((key) => {
            this.sfxAudioMap.set(
                key,
                this.scene.sound.add(key) as Phaser.Sound.HTML5AudioSound
            );
        });
        if (!this.backgroundMusic) {
            this.backgroundMusic = this.scene.sound.add("backgroundMusic", {
                loop: true,
                volume: 0.4,
            }) as Phaser.Sound.HTML5AudioSound;
            this.backgroundMusic.play();
        }
    }

    play(key: string) {
        const sound = this.sfxAudioMap.get(key);
        if (sound) {
            sound.play();
        } else {
            console.warn(`Sound effect with key '${key}' not found.`);
        }
    }

    public static getInstance(scene: Phaser.Scene): SFX {
        // This condition ensures a new instance is created only if one doesn't already exist.
        if (!SFX.SFXInstance) {
            SFX.SFXInstance = new SFX(scene);
        }
        return SFX.SFXInstance;
    }

    getMusic(): Phaser.Sound.HTML5AudioSound {
        return this.backgroundMusic as Phaser.Sound.HTML5AudioSound;
    }

    getSFX(): Map<string, Phaser.Sound.HTML5AudioSound> {
        return this.sfxAudioMap;
    }

    setSFXVolume(volume: number) {
        this.sfxAudioMap.forEach((sfx) => {
            sfx.setVolume(volume);
        });
    }
}
