import Phaser from "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import MenuScene from "./scenes/menuScene";
import ControlScene from "./scenes/controlScene";
import ProgressionScene from "./scenes/progressionScene";
import CreditsScene from "./scenes/creditsScene";
import GameOverScene from "./scenes/gameOverScene";
import TutorialScene from "./scenes/tutorialScene";
import GameVictoryScene from "./scenes/gameVictoryScene";
import ProgressionScene2 from "./scenes/progressionScene2";
import SettingsScene from "./scenes/settingsScene";
import FreeplayScene from "./scenes/freeplayScene";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

export const CONFIG = {
    title: "Boolean Bonanza!",
    version: "0.0.1",
    type: Phaser.AUTO,
    backgroundColor: "#ffffff",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [
        PreloadScene,
        MainScene,
        MenuScene,
        ControlScene,
        ProgressionScene,
        CreditsScene,
        GameOverScene,
        TutorialScene,
        GameVictoryScene,
        ProgressionScene2,
        SettingsScene,
        FreeplayScene,
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 300 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
};
