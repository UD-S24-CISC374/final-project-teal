import Phaser from "phaser";
export default class Tile extends Phaser.GameObjects.Sprite {
    public tileType: string;
    public overlay: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        tileType: string,
        tileSize: number
    ) {
        super(scene, x, y, tileType);
        this.tileType = tileType;
        console.log("new tile added");
        scene.add.existing(this);

        //overlay
        this.overlay = scene.add.sprite(x, y, tileType + "Select");
        this.overlay.setOrigin(0, 0);
        this.overlay.setScale(
            tileSize / this.overlay.width,
            tileSize / this.overlay.height
        );

        this.overlay.setVisible(false);
    }

    public setPosition(x?: number | undefined, y?: number | undefined): this {
        return super.setPosition(x, y);
    }

    public showOverlay() {
        this.overlay.setVisible(true);
    }

    public hideOverlay() {
        this.overlay.setVisible(false);
    }
}
