export default class Sketch extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        size: number,
        minScale = 0.8,
        maxScale = 1.2,
        minTilt = -45,
        maxTilt = 45
    ) {
        // Generate a random sketch number between 1 and 12
        const sketchNum = Phaser.Math.Between(1, 12);
        const sketchKey = `sketch-${sketchNum}`;

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

        // Add the sketch to the scene
        scene.add.existing(this);
    }

    static preload(scene: Phaser.Scene) {
        // Preload all the sketch images
        for (let i = 1; i <= 12; i++) {
            const sketchKey = `sketch-${i}`;
            scene.load.image(sketchKey, `assets/sketches/${sketchKey}.png`);
        }
    }
}
