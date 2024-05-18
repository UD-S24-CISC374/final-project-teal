import Phaser from "phaser";
import Game from "../objects/Game";
import Stage from "../objects/Stages";
import Background from "../objects/Background";
import SFX from "../objects/SFX";
import Button from "../objects/Button";

function createButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    callback: () => void,
    fontSize: string = "24px"
) {
    return new Button(scene, x, y, label, callback, fontSize).setOrigin(0.5);
}

function createNavigationButtons(
    scene: Phaser.Scene,
    screenWidth: number,
    screenHeight: number,
    changeStage: (direction: number) => void
) {
    createButton(
        scene,
        screenWidth * 0.1,
        screenHeight * 0.5,
        "<",
        () => {
            changeStage(-1);
        },
        "48px"
    );
    createButton(
        scene,
        screenWidth * 0.9,
        screenHeight * 0.5,
        ">",
        () => {
            changeStage(1);
        },
        "48px"
    );
}

function createStageTitle(
    scene: Phaser.Scene,
    screenWidth: number,
    screenHeight: number,
    stages: Stage[],
    currentStageIndex: number
): Phaser.GameObjects.Text {
    return createText(
        scene,
        screenWidth * 0.5,
        screenHeight * 0.2,
        stages[currentStageIndex].name,
        {
            fontSize: "48px",
            fontFamily: "Arial",
            color: "#000000",
        }
    );
}

function createBackButton(scene: Phaser.Scene) {
    createButton(
        scene,
        70,
        70,
        "Back",
        () => scene.scene.start("MenuScene"),
        "32px"
    );
}

function createFreeplayButton(
    scene: Phaser.Scene,
    screenWidth: number,
    screenHeight: number,
    openFreeplaySettings: () => void
) {
    createButton(
        scene,
        screenWidth * 0.5,
        screenHeight * 0.8,
        "Freeplay",
        openFreeplaySettings,
        "32px"
    );
}

function createGameButtons(
    scene: Phaser.Scene,
    games: Game[],
    startX: number,
    gameListY: number,
    buttonSize: number,
    gameSpacing: number,
    sfx: SFX,
    stageTitleText: Phaser.GameObjects.Text,
    stages: Stage[],
    currentStageIndex: number
) {
    const gameButtonsShown: Phaser.GameObjects.Container[] = [];

    games.forEach((game, index) => {
        const isLocked = game.isLocked;

        const gameContainer = scene.add.container(
            startX + index * (buttonSize + gameSpacing),
            gameListY
        );

        const gameButton = scene.add.text(
            0,
            -buttonSize / 3,
            game.name + `\n` + (isLocked ? " (Locked)" : ""),
            {
                fontSize: "24px",
                fontFamily: "Arial",
                color: isLocked ? "#888888" : "#ffffff",
                backgroundColor: "#4e342e",
                padding: { x: 10, y: 10 },
                fixedWidth: buttonSize,
                fixedHeight: buttonSize + 30,
                align: "center",
            }
        );
        gameButton.setOrigin(0.5);

        const boardSizeText = scene.add.text(
            0,
            -60,
            `Board: ${game.boardSize}x${game.boardSize}`,
            {
                fontSize: "18px",
                fontFamily: "Arial",
                color: "#ffffff",
                align: "center",
            }
        );
        boardSizeText.setOrigin(0.5);

        const tilesContainer = scene.add.container(0, buttonSize / 6);
        const tileSprites = game.tileTypes;
        const maxTilesPerRow = 4;

        tileSprites.forEach((sprite, i) => {
            const tileButton = scene.add.sprite(
                ((i % maxTilesPerRow) - (maxTilesPerRow - 1) / 2) * 30,
                Math.floor(i / maxTilesPerRow) * 30 - 45,
                sprite
            );
            tileButton.setScale(0.25);
            tilesContainer.add(tileButton);
        });

        gameContainer.add([gameButton, boardSizeText, tilesContainer]);

        gameContainer.setSize(buttonSize, buttonSize);
        gameContainer.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
            Phaser.Geom.Rectangle.Contains
        );
        gameContainer.setInteractive({ useHandCursor: !isLocked });

        if (!isLocked) {
            gameContainer.on("pointerover", () => {
                gameButton.setStyle({ backgroundColor: "#6e4f3e" });
                gameContainer.setScale(1.1);
            });

            gameContainer.on("pointerout", () => {
                gameButton.setStyle({ backgroundColor: "#4e342e" });
                gameContainer.setScale(1);
            });

            gameContainer.on("pointerdown", () => {
                sfx.play("crumple-paper-1");
                console.log(stages);
                scene.registry.set(
                    "currentStage",
                    stages[currentStageIndex].name
                );
                scene.registry.set("currentGame", game.name);

                if (
                    stageTitleText.text === "Beginner" &&
                    game.name === "Tutorial"
                ) {
                    game.startTutorial(scene);
                } else {
                    game.startGame(scene);
                }
            });
        }

        gameButtonsShown.push(gameContainer);
    });

    return gameButtonsShown;
}

function createText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
) {
    const textObj = scene.add.text(x, y, text, style);
    textObj.setOrigin(0.5);
    return textObj;
}

export default class ProgressionScene extends Phaser.Scene {
    private currentStageIndex: number = 0;
    private stages: Stage[];
    private stageTitleText: Phaser.GameObjects.Text;
    private sfx: SFX;
    private gameButtonsShown: Phaser.GameObjects.Container[] = [];
    private tileButtonsShown: Phaser.GameObjects.Sprite[] = [];

    constructor() {
        super({ key: "ProgressionScene" });
        this.sfx = SFX.getInstance(this);
    }

    create() {
        this.stages = this.createStages();
        const backgroundImage = Background.getInstance(this, "background");
        backgroundImage.create();
        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;
        this.registry.set("stages", this.stages);

        this.stageTitleText = createStageTitle(
            this,
            screenWidth,
            screenHeight,
            this.stages,
            this.currentStageIndex
        );
        createNavigationButtons(
            this,
            screenWidth,
            screenHeight,
            this.changeStage.bind(this)
        );
        this.showGames(this.stages[this.currentStageIndex].games);
        createBackButton(this);
        createFreeplayButton(
            this,
            screenWidth,
            screenHeight,
            this.openFreeplaySettings.bind(this)
        );
    }

    changeStage(direction: number) {
        this.currentStageIndex =
            (this.currentStageIndex + direction + this.stages.length) %
            this.stages.length;
        this.stageTitleText.setText(this.stages[this.currentStageIndex].name);
        this.showGames(this.stages[this.currentStageIndex].games);
        this.sfx.play("pop-click-1");
    }

    openFreeplaySettings() {
        this.hideGames();
        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;
        // The rest of the method remains unchanged
        // Add your existing openFreeplaySettings code here
    }

    hideGames() {
        this.gameButtonsShown.forEach((button) => button.destroy());
        this.gameButtonsShown = [];
        this.tileButtonsShown.forEach((button) => button.destroy());
        this.tileButtonsShown = [];
    }

    showGames(games: Game[]) {
        this.hideGames();

        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;
        const gameListY = screenHeight * 0.55;
        const gameSpacing = 20;
        const buttonSize = Math.min(
            screenWidth / Math.min(games.length, 5),
            165
        );
        const startX =
            (screenWidth - games.length * (buttonSize + gameSpacing)) / 2 + 90;

        this.gameButtonsShown = createGameButtons(
            this,
            games,
            startX,
            gameListY,
            buttonSize,
            gameSpacing,
            this.sfx,
            this.stageTitleText,
            this.stages,
            this.currentStageIndex
        );
    }

    createStages(): Stage[] {
        let currentLevel = this.registry.get("level") || 0;
        console.log("level: ", currentLevel);
        //currentLevel = 0;
        let levelCount = 0;
        return [
            new Stage("Beginner", [
                new Game(
                    levelCount,
                    "Tutorial",
                    ["trueTile", "falseTile", "orTile"],
                    3,
                    180,
                    99,
                    99,
                    1,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 1",
                    ["trueTile", "andTile"],
                    3,
                    100,
                    3,
                    99,
                    1,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 2",
                    ["trueTile", "falseTile", "orTile", "andTile"],
                    3,
                    100,
                    3,
                    99,
                    2,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 3",
                    ["trueTile", "falseTile", "andTile", "orTile", "notTile"],
                    4,
                    100,
                    3,
                    99,
                    2,
                    currentLevel < levelCount++
                ),
            ]),
            new Stage("Intermediate", [
                new Game(
                    levelCount,
                    "Game 1",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    5,
                    120,
                    2,
                    20,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 2",
                    ["trueTile", "falseTile", "andTile", "orTile"],
                    7,
                    120,
                    2,
                    20,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 3",
                    ["trueTile", "falseTile", "orTile", "andTile", "notTile"],
                    6,
                    120,
                    2,
                    20,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 4",
                    ["trueTile", "falseTile", "andTile", "orTile", "xorTile"],
                    5,
                    120,
                    2,
                    20,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 5",
                    [
                        "trueTile",
                        "falseTile",
                        "andTile",
                        "orTile",
                        "xorTile",
                        "notTile",
                    ],
                    6,
                    120,
                    2,
                    20,
                    3,
                    currentLevel < levelCount++
                ),
            ]),
            new Stage("Advanced", [
                new Game(
                    levelCount,
                    "Game 1",
                    ["trueTile", "falseTile", "orTile", "andTile", "xorTile"],
                    7,
                    120,
                    1,
                    30,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 2",
                    [
                        "trueTile",
                        "falseTile",
                        "orTile",
                        "andTile",
                        "xorTile",
                        "notTile",
                    ],
                    8,
                    120,
                    1,
                    30,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 3",
                    [
                        "trueTile",
                        "falseTile",
                        "orTile",
                        "andTile",
                        "notTile",
                        "leftParenTile",
                        "rightParenTile",
                    ],
                    9,
                    120,
                    1,
                    30,
                    3,
                    currentLevel < levelCount++
                ),
                new Game(
                    levelCount,
                    "Game 4",
                    [
                        "trueTile",
                        "falseTile",
                        "orTile",
                        "andTile",
                        "xorTile",
                        "notTile",
                        "leftParenTile",
                        "rightParenTile",
                    ],
                    9,
                    120,
                    1,
                    30,
                    3,
                    currentLevel < levelCount++
                ),
            ]),
        ];
    }
}
