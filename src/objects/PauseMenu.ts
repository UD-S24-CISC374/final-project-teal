import Phaser from "phaser";
import SFX from "./SFX";
import Button from "./Button";

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

        const centerWidth = (this.scene.game.config.width as number) * 0.5;
        const centerHeight = (this.scene.game.config.height as number) * 0.5;
        const spacing = (this.scene.game.config.height as number) * 0.1;
        let index = -1;
        // Add pause menu text
        const pauseMenuText = this.scene.add.text(
            centerWidth,
            centerHeight + spacing * index,
            "Paused",
            { fontSize: "48px", color: "#ffffff" }
        );
        pauseMenuText.setOrigin(0.5);
        this.add(pauseMenuText);

        index++;
        this.resumeButton = new Button(
            this.scene,
            centerWidth,
            centerHeight + spacing * index,
            "Resume",
            () => {
                this.togglePauseMenu();
            }
        );
        this.add(this.resumeButton);

        // Add Main Menu button
        index++;
        this.mainMenuButton = new Button(
            this.scene,
            centerWidth,
            centerHeight + spacing * index,
            "Main Menu",
            () => {
                this.scene.scene.start("MenuScene");
            }
        );
        this.add(this.mainMenuButton);

        index++;
        this.restartButton = new Button(
            this.scene,
            centerWidth,
            centerHeight + spacing * index,
            "Restart",
            () => {
                this.sfx.play("crumple-paper-1");
                this.scene.scene.restart();
            }
        );
        this.add(this.restartButton);

        this.setDepth(1000); // Ensure the pause menu is on top
    }

    public togglePauseMenu() {
        this.setVisible(!this.visible);
    }
}
