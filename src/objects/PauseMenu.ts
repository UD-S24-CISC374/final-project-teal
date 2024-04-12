import Phaser from "phaser";
import SFX from "./SFX";

export default class PauseMenu extends Phaser.GameObjects.Container {
    public scene: Phaser.Scene;
    private mainMenuButton: Phaser.GameObjects.Text;
    private restartButton: Phaser.GameObjects.Text;
    private resumeButton: Phaser.GameObjects.Text;
    private sfx: SFX;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.scene.add.existing(this);

        this.sfx = SFX.getInstance(scene);

        // Add pause menu background
        const pauseMenuBackground = this.scene.add.rectangle(
            (this.scene.game.config.width as number) * 0.5,
            (this.scene.game.config.height as number) * 0.5,
            (this.scene.game.config.width as number) * 0.6,
            (this.scene.game.config.height as number) * 0.6,
            0x000000,
            0.8
        );
        this.add(pauseMenuBackground);

        // Add pause menu text
        const pauseMenuText = this.scene.add.text(
            (this.scene.game.config.width as number) * 0.5,
            (this.scene.game.config.height as number) * 0.4,
            "Paused",
            { fontSize: "48px", color: "#ffffff" }
        );
        pauseMenuText.setOrigin(0.5);
        this.add(pauseMenuText);

        // Add Resume button
        this.resumeButton = this.scene.add.text(
            (this.scene.game.config.width as number) * 0.5,
            (this.scene.game.config.height as number) * 0.5,
            "Resume",
            {
                fontSize: "32px",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 20, y: 10 },
            }
        );
        this.resumeButton.setOrigin(0.5);
        this.resumeButton.setInteractive();
        this.resumeButton.on("pointerdown", () => {
            this.sfx.play("pop-click-1");
            this.togglePauseMenu();
        });
        this.add(this.resumeButton);

        // Add Main Menu button
        this.mainMenuButton = this.scene.add.text(
            (this.scene.game.config.width as number) * 0.5,
            (this.scene.game.config.height as number) * 0.6,
            "Main Menu",
            {
                fontSize: "32px",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 20, y: 10 },
            }
        );
        this.mainMenuButton.setOrigin(0.5);
        this.mainMenuButton.setInteractive();
        this.mainMenuButton.on("pointerdown", () => {
            this.sfx.play("pop-click-1");
            this.scene.scene.start("MenuScene");
        });
        this.add(this.mainMenuButton);

        // Add Restart button
        this.restartButton = this.scene.add.text(
            (this.scene.game.config.width as number) * 0.5,
            (this.scene.game.config.height as number) * 0.7,
            "Restart",
            {
                fontSize: "32px",
                color: "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 20, y: 10 },
            }
        );
        this.restartButton.setOrigin(0.5);
        this.restartButton.setInteractive();
        this.restartButton.on("pointerdown", () => {
            this.sfx.play("crumple-paper-1");
            this.scene.scene.restart();
        });
        this.add(this.restartButton);

        this.setDepth(1000); // Ensure the pause menu is on top
    }

    public togglePauseMenu() {
        this.setVisible(!this.visible);
    }
}
