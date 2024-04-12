import Phaser from "phaser";

export default class Background {
    private static backgroundInstance: Background;
    private scene: Phaser.Scene;
    private imageKey: string;
    private backgroundImage: Phaser.GameObjects.Image;

    private constructor(scene: Phaser.Scene, imageKey: string) {
        this.scene = scene;
        this.imageKey = imageKey;
    }

    create() {
        this.backgroundImage = this.scene.add.image(0, 0, this.imageKey);
        this.backgroundImage.setOrigin(0, 0);

        const scaleX =
            (this.scene.game.config.width as number) /
            this.backgroundImage.width;
        const scaleY =
            (this.scene.game.config.height as number) /
            this.backgroundImage.height;
        const maxScale = Math.max(scaleX, scaleY);
        this.backgroundImage.setScale(maxScale);
    }

    public static getInstance(
        scene: Phaser.Scene,
        imageKey: string
    ): Background {
        return new Background(scene, imageKey);
    }
}
