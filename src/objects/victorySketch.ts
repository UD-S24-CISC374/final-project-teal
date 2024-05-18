import Phaser from "phaser";
export default class victorySketch extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        size: number,
        minScale = 0.8,
        maxScale = 2,
        minTilt = -45,
        maxTilt = 45
    ) {
        // Generate a random sketch number between 1 and 25
        const sketchNum = Phaser.Math.Between(1, 25);
        const sketchKey = `victorySketch${sketchNum}`;

        // Generate a random scale and rotation
        super(scene, x, y, sketchKey, 0);
        const initialScale = size / this.width;
        this.setScale(initialScale);

        const scale = Phaser.Math.FloatBetween(minScale, maxScale);
        const tilt = Phaser.Math.FloatBetween(minTilt, maxTilt);

        // Call the parent constructor with the random sketch key and scale

        // Set the random rotation
        this.setAngle(tilt);
        this.setScale(scale * initialScale);

        while (this.displayHeight > 500) {
            let scale = this.scaleX;
            this.setScale(scale * 0.9);
        }
        while (this.displayHeight < 250) {
            let scale = this.scaleX;
            this.setScale(scale * 1.1);
        }
        console.log(this.displayHeight);
        // Add the sketch to the scene
        scene.add.existing(this);
    }

    static preload(scene: Phaser.Scene) {
        // Preload all the sketch images
        for (let i = 1; i <= 25; i++) {
            const sketchKey = `victorySketch${i}`;
            scene.load.image(
                sketchKey,
                `assets/victorySketches/${sketchKey}.png`
            );
        }
    }
}
