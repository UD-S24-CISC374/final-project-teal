import Phaser from "phaser";

export default class ProgressionScene2 extends Phaser.Scene {
    private levels: Phaser.GameObjects.Graphics[] = [];
    private viewport: Phaser.GameObjects.Graphics | null = null;

    constructor() {
        super({ key: "ProgressionScene2" });
    }

    create() {
        const screenWidth = this.game.config.width as number;
        const screenHeight = this.game.config.height as number;

        const stages = [
            { name: "Beginner", levels: 4 },
            { name: "Intermediate", levels: 5 },
            { name: "Advanced", levels: 4 },
        ];

        const levelSpacing = 150;

        // Create a viewport
        this.viewport = this.add.graphics();
        this.viewport.lineStyle(2, 0x000000);
        this.viewport.strokeRect(
            screenWidth * 0.3,
            screenHeight * 0.1,
            screenWidth * 0.4,
            screenHeight * 0.8
        );

        const viewportBounds = {
            x: screenWidth * 0.3,
            y: screenHeight * 0.1,
            width: screenWidth * 0.4,
            height: screenHeight * 0.8,
        };

        // Create levels and connections
        let currentY = viewportBounds.y + 50;

        stages.forEach((stage, stageIndex) => {
            for (let i = 0; i < stage.levels; i++) {
                const circle = this.add.graphics();
                circle.fillStyle(0x000000);
                circle.fillCircle(
                    viewportBounds.x + viewportBounds.width / 2,
                    currentY,
                    20
                );

                this.levels.push(circle);

                // Draw squiggly line to next level if not last level
                if (i < stage.levels - 1 || stageIndex < stages.length - 1) {
                    const nextY = currentY + levelSpacing;
                    this.drawSquigglyLine(
                        viewportBounds.x + viewportBounds.width / 2,
                        currentY,
                        nextY
                    );
                }

                currentY += levelSpacing;
            }
        });

        // Setup scrolling interaction
        this.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                deltaX: number,
                deltaY: number,
                deltaZ: number
            ) => {
                this.levels.forEach((level) => (level.y -= deltaY));
                this.refreshLines(deltaY);
            }
        );

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const initialY = pointer.y;

            this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
                const deltaY = pointer.y - initialY;

                this.levels.forEach((level) => (level.y += deltaY));
                this.refreshLines(deltaY);
            });

            this.input.on("pointerup", () => {
                this.input.off("pointermove");
            });
        });
    }

    drawSquigglyLine(x: number, y1: number, y2: number) {
        const line = this.add.graphics();
        line.lineStyle(1, 0x000000);

        let y = y1;
        let direction = 1;

        line.beginPath();
        line.moveTo(x, y1);

        while (y < y2) {
            y += 10;
            line.lineTo(x + 5 * direction, y);
            direction *= -1;
        }

        line.strokePath();

        this.levels.push(line);
    }

    refreshLines(deltaY: number) {
        this.levels.forEach((level) => {
            if (level instanceof Phaser.GameObjects.Graphics) {
                level.y += deltaY;
            }
        });
    }
}
