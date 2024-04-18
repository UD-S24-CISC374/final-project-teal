import Phaser from "phaser";
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameOverScene" });
    }

    create() {
        this.add
            .text(500, 300, "Game Over", { fontSize: "32px", color: "#000000" })
            .setOrigin(0.5);
        const retryButton = this.add
            .text(400, 350, "retryButton", {
                fontSize: "32px",
                color: "#000000",
            })
            .setInteractive();
        retryButton.on("pointerdown", () => {
            this.scene.start("MainGameScene");
        });

        const menuButton = this.add
            .text(400, 400, "menuButton", {
                fontSize: "32px",
                color: "#000000",
            })
            .setInteractive();
        menuButton.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}
