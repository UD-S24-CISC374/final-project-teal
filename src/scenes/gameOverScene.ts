import Phaser from "phaser";
import Background from "../objects/Background";
import Button from "../objects/Button";
export default class GameOverScene extends Phaser.Scene {
    private lastScene: string;

    private message: string;
    constructor() {
        super({ key: "GameOverScene" });
    }

    init(data: { lastScene: string; message: string }) {
        this.lastScene = data.lastScene;
        this.message = data.message;
    }

    create() {
        const backgroundImage = Background.getInstance(
            this,
            "crumbleBackground"
        );
        backgroundImage.create();
        const width: number = this.game.config.width as number;
        const height: number = this.game.config.height as number;
        this.add.image(width * 0.5, height * 0.3, "gameOver").setOrigin(0.5);

        new Button(this, width * 0.5, height * 0.6, "Retry", () => {
            if (this.lastScene === "MainGameScene") {
                this.scene.start("MainGameScene");
            } else {
                this.scene.start("TutorialScene");
            }
        });

        new Button(this, width * 0.5, height * 0.7, "Menu", () => {
            this.scene.start("MenuScene");
        });

        this.add
            .image(width * 0.8, height * 0.8, "fail")
            .setOrigin(0.5)
            .setScale(2);
    }
}
