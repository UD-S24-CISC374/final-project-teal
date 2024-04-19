import Phaser from "phaser";

type ObjectiveCheckFunction = (tileType: string[]) => boolean;

export default class Objective {
    private progressionCount: number;
    private currentProgress: number;
    private objectiveString: string;
    private checkCondition: (tileTypes: string[]) => boolean;
    public objectiveText: Phaser.GameObjects.Text;

    constructor(
        objectiveString: string,
        progressionCount: number,
        checkCondition: ObjectiveCheckFunction = () => false
    ) {
        this.objectiveString = objectiveString;
        this.checkCondition = checkCondition;
        this.progressionCount = progressionCount;
        this.currentProgress = 0;
    }

    createObjectiveText(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        const progress = `${this.currentProgress}/${this.progressionCount}`;
        this.objectiveText = scene.add.text(
            x,
            y,
            `• ${this.objectiveString}: \n(${progress})`,
            {
                fontSize: "25px",
                color: "#000",
            }
        );
    }

    checkObjective(tileTypes: string[], increment: number = 1) {
        if (this.checkCondition(tileTypes)) {
            this.currentProgress += increment;
            this.updateObjectiveText();
        }
    }

    isCompleted() {
        return this.currentProgress >= this.progressionCount;
    }

    private updateObjectiveText() {
        const progress = `${this.currentProgress}/${this.progressionCount}`;
        const completedText = this.isCompleted() ? ` (Completed)` : "";
        this.objectiveText.setText(
            `• ${this.objectiveString}:\n (${progress})${completedText}`
        );

        if (this.isCompleted()) {
            this.objectiveText.setStyle({ color: "green" });
            console.log("Objective complete:", this.objectiveString); //play sound here
        }
    }
}
