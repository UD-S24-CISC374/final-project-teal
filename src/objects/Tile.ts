import Phaser from "phaser";
export default class Tile extends Phaser.GameObjects.Sprite {
    public tileType: string;

    constructor(scene: Phaser.Scene, x: number, y: number, tileType: string) {
        super(scene, x, y, tileType);
        this.tileType = tileType;
        console.log("new tile added");
        scene.add.existing(this);
    }
}
