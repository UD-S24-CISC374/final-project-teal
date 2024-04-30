import Phaser from "phaser";
export default class GameVictoryScene extends Phaser.Scene {
    private lastScene: string;

    constructor() {
        super({ key: "GameVictoryScene" });
    }

    init() {}

    create() {
        const width: number = this.game.config.width as number;
        const height: number = this.game.config.height as number;
        this.add
            .text(width * 0.5, height * 0.3, "Victory!", {
                fontSize: "40px",
                fontFamily: "Arial",
                color: "#000000",
            })
            .setOrigin(0.5);

        const menuButton = this.add
            .text(width * 0.5, height * 0.55, "Menu", {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: {
                    x: 20,
                    y: 10,
                },
            })
            .setInteractive()
            .setOrigin(0.5);
        menuButton.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}
