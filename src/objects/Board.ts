import Phaser from "phaser";
import Tile from "./Tile";
import SFX from "./SFX";

enum DirectionType {
    ROW,
    COL,
    NONE,
}

export default class Board {
    private sfx: SFX;

    private scene: Phaser.Scene;
    private tiles: Tile[][];
    private boardSize: number;
    private tileSize: number;
    private tileTypes: string[];

    private selectedTile: Tile | null = null;
    private selectedTiles: Tile[] = [];
    public lastRemovedTileTypes: string[] = [];

    private currentDirection: DirectionType = DirectionType.NONE;

    private isAnimating: boolean = false;
    private name: string;

    constructor(
        scene: Phaser.Scene,
        boardSize: number,
        tileTypes: string[],
        name: string
    ) {
        this.scene = scene;
        this.boardSize = boardSize;
        this.tileTypes = tileTypes;
        this.name = name;
        this.sfx = SFX.getInstance(scene);
        this.tiles = this.generateBoard();
    }

    private generateBoard(): Tile[][] {
        console.log("game name: " + this.name);
        if (this.name === "Tutorial") {
            return this.generateLvlOneBoard();
        }
        const board: Tile[][] = [];

        const screenWidth = this.scene.game.scale.width;
        const screenHeight = this.scene.game.scale.height;
        //const boardWidth = this.boardSize * this.tileSize;
        //const boardHeight = this.boardSize * this.tileSize;
        const boardHeight = screenHeight * 0.8;
        const boardWidth = boardHeight;
        const boardX = (screenWidth - boardWidth) / 2;
        const boardY = (screenHeight - boardHeight) / 2;
        this.tileSize = boardHeight / this.boardSize;

        for (let row = 0; row < this.boardSize; row++) {
            board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const tileX = boardX + col * this.tileSize;
                const tileY = boardY + row * this.tileSize;
                const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
                const tile = new Tile(this.scene, tileX, tileY, tileTypeKey);
                tile.setInteractive();
                tile.on("pointerdown", this.selectTile.bind(this, tile));
                tile.setOrigin(0, 0);
                tile.setScale(this.tileSize / tile.width);
                board[row][col] = tile;
            }
        }

        return board;
    }

    public regenerateBoard() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.tiles[i][j].destroy();
            }
        }
        this.tiles = this.generateBoard();
    }

    private selectTile(tile: Tile) {
        this.sfx.play("click-1");
        this.unselectTiles();
        if (this.selectedTile) {
            this.selectedTile.setTint(0xffffff); // Reset tint of previously selected tile
        }
        this.selectedTile = tile;
        tile.setTint(0x555555); // Tint the selected tile red
    }

    // callback : function to call after the swap is done
    public swapTiles(
        row1: number,
        col1: number,
        row2: number,
        col2: number,
        callback: () => void
    ) {
        if (this.isAnimating) {
            return;
        }
        this.sfx.play("slide-1");
        this.isAnimating = true;
        this.unselectTiles();
        const tile1 = this.tiles[row1][col1];
        const tile2 = this.tiles[row2][col2];
        const tweenDuration = 300;

        this.tiles[row2][col2] = tile1;
        this.tiles[row1][col1] = tile2;

        this.selectTile(tile1);

        //create tile1 tween
        this.scene.tweens.add({
            targets: tile1,
            x: tile2.x,
            y: tile2.y,
            duration: tweenDuration,
            onComplete: () => {
                this.isAnimating = false;

                //this.selectedTile?.setTint(0xffffff);
                //this.selectedTile = null; // Deselect the tile after swapping
            },
        });
        //create tile2 tween
        this.scene.tweens.add({
            targets: tile2,
            x: tile1.x,
            y: tile1.y,
            duration: tweenDuration,
        });
        callback();
    }

    public selectTiles(directionIndex: number, direction: DirectionType) {
        this.sfx.play("sweep-1");
        this.unselectTiles();
        this.currentDirection = direction;
        if (direction == DirectionType.ROW) {
            for (let tileIndex = 0; tileIndex < this.boardSize; tileIndex++) {
                const tile = this.tiles[directionIndex][tileIndex];
                this.selectedTiles.push(tile);
                tile.setTint(0x555555);
            }
        } else if (direction == DirectionType.COL) {
            for (let tileIndex = 0; tileIndex < this.boardSize; tileIndex++) {
                const tile = this.tiles[tileIndex][directionIndex];
                this.selectedTiles.push(tile);
                tile.setTint(0x555555);
            }
        }
    }
    private unselectTiles() {
        while (this.selectedTiles.length > 0) {
            const tile = this.selectedTiles.shift();
            tile?.setTint(0xffffff);
        }
        this.currentDirection = DirectionType.NONE;
    }

    private checkRow(currentRow: number): boolean {
        let row = this.tileToString(this.tiles[currentRow]);
        try {
            if (eval(row)) {
                this.removeTilesRow(currentRow);
                this.sfx.play("pop-1");
                return true;
            }
        } catch (e) {
            console.log(e);
        }

        this.shakeTiles();
        return false;
    }

    // convert the tiles to string format ex: [true, and, true] => "true && true"
    private tileToString(tiles: Tile[]): string {
        return tiles
            .map((tile) => {
                switch (tile.tileType) {
                    case "trueTile":
                        return "true";
                    case "falseTile":
                        return "false";
                    case "andTile":
                        return " && ";
                    case "orTile":
                        return " || ";
                    case "leftParenTile":
                        return "(";
                    case "rightParenTile":
                        return ")";
                    case "xorTile":
                        return " ^ ";
                    case "notTile":
                        return "!";
                    default:
                        return "Invalid tile type";
                }
            })
            .join("");
    }

    private removeTilesRow(currentRow: number) {
        this.lastRemovedTileTypes = [];
        // remove all the tiles in the current row
        for (let col = 0; col < this.boardSize; col++) {
            const tile = this.tiles[currentRow][col];
            this.lastRemovedTileTypes.push(tile.tileType);
            tile.destroy();
        }

        // move all the tiles above the current row down
        for (let row = currentRow; row > 0; row--) {
            for (let col = 0; col < this.boardSize; col++) {
                const tile = this.tiles[row - 1][col];
                this.tiles[row][col] = tile;
                this.scene.tweens.add({
                    targets: tile,
                    y: tile.y + this.tileSize,
                    duration: 300,
                });
            }
        }
        this.addTilesRow();
    }

    private addTilesRow() {
        for (let col = 0; col < this.boardSize; col++) {
            const tileX = this.tiles[0][col].x;
            const tileY = this.tiles[0][col].y;
            const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
            const tile = new Tile(
                this.scene,
                tileX,
                tileY - this.tileSize,
                tileTypeKey
            );

            tile.setInteractive();
            tile.on("pointerdown", this.selectTile.bind(this, tile));
            tile.setOrigin(0, 0);
            tile.setScale(this.tileSize / tile.width);
            this.tiles[0][col] = tile;

            this.scene.tweens.add({
                targets: tile,
                y: tile.y + this.tileSize,
                duration: 300,
            });
        }
    }

    private checkCol(currentCol: number): boolean {
        let column = this.tiles.map((row) => row[currentCol]);
        let col = this.tileToString(column);
        try {
            if (eval(col)) {
                this.removeTilesCol(currentCol);
                this.sfx.play("pop-1");
                return true;
            }
        } catch (e) {
            console.log(e);
        }

        this.shakeTiles();
        return false;
    }

    private removeTilesCol(currentCol: number) {
        this.lastRemovedTileTypes = [];
        for (let row = 0; row < this.boardSize; row++) {
            const tile = this.tiles[row][currentCol];
            this.lastRemovedTileTypes.push(tile.tileType);
            tile.destroy();
        }
        //this.addScore(10);
        this.addTilesCol(currentCol);
    }

    private addTilesCol(currentCol: number) {
        for (let row = 0; row < this.boardSize; row++) {
            const tileX = this.tiles[row][currentCol].x;
            const tileY = this.tiles[row][0].y;
            const tileTypeKey = Phaser.Math.RND.pick(this.tileTypes);
            const tile = new Tile(
                this.scene,
                tileX,
                tileY - this.boardSize * this.tileSize,
                tileTypeKey
            );
            tile.setInteractive();
            tile.on("pointerdown", this.selectTile.bind(this, tile));
            tile.setOrigin(0, 0);
            tile.setScale(this.tileSize / tile.width);
            this.tiles[row][currentCol] = tile;

            this.scene.tweens.add({
                targets: tile,
                y: tile.y + this.tileSize * this.boardSize,
                duration: 450,
            });
        }
    }

    private shakeTiles() {
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        this.sfx.play("incorrect-1");
        this.selectedTiles.forEach((tile) => {
            const originalX = tile.x;
            const originalY = tile.y;

            this.scene.tweens.add({
                targets: tile,
                duration: 100, // Duration of each shake segment
                repeat: 2, // Number of shakes
                yoyo: true, // Go back and forth
                ease: "Sine.easeInOut", // Easing function to make it smooth
                x: {
                    getStart: () => originalX - 5, // Start 5 pixels to the left
                    getEnd: () => originalX + 5, // End 5 pixels to the right
                },
                onComplete: () => {
                    // Optional: Reset sprite position after shaking, in case of rounding errors
                    tile.x = originalX;
                    tile.y = originalY;
                    this.isAnimating = false;
                },
            });
        });
    }

    public isTileSelected(): boolean {
        return this.selectedTile !== null;
    }

    public findSelectedTile(): number[] {
        if (!this.selectedTile) {
            return [-1, 1];
        }

        let currentRow = -1;
        let currentCol = -1;

        // Find the row and column of the selected tile
        for (let row = 0; row < this.boardSize; row++) {
            const col = this.tiles[row].indexOf(this.selectedTile);
            if (col !== -1) {
                currentCol = col;
                currentRow = row;
                break;
            }
        }

        return [currentRow, currentCol];
    }

    public getBoardSize(): number {
        return this.boardSize;
    }

    public handleRowColCheck(
        currentRow: number,
        currentCol: number,
        callback: () => void
    ): boolean {
        if (this.currentDirection == DirectionType.ROW) {
            callback();
            return this.checkRow(currentRow);
        } else if (this.currentDirection == DirectionType.COL) {
            callback();
            return this.checkCol(currentCol);
        }
        this.currentDirection = DirectionType.NONE;
        return false;
    }

    public generateLvlOneBoard(): Tile[][] {
        const tileKeys = [
            ["trueTile", "orTile", "falseTile"],
            ["trueTile", "orTile", "falseTile"],
            ["trueTile", "orTile", "falseTile"],
        ];

        const screenHeight = this.scene.game.scale.height;
        const screenWidth = this.scene.game.scale.width;
        const boardHeight = screenHeight * 0.8;
        const boardWidth = boardHeight;
        const boardX = (screenWidth - boardWidth) / 2;
        const boardY = (screenHeight - boardHeight) / 2;
        this.tileSize = boardHeight / this.boardSize;

        const board: Tile[][] = [];
        for (let row = 0; row < this.boardSize; row++) {
            board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const tileX = boardX + col * this.tileSize;
                const tileY = boardY + row * this.tileSize;
                const tileTypeKey = tileKeys[row][col];
                const tile = new Tile(this.scene, tileX, tileY, tileTypeKey);
                tile.setInteractive();
                tile.on("pointerdown", this.selectTile.bind(this, tile));
                tile.setOrigin(0, 0);
                tile.setScale(this.tileSize / tile.width);
                board[row][col] = tile;
            }
        }
        return board;
    }
    public isPossibleSolution(): boolean | undefined {
        if (!this.tiles) {
            return undefined;
        }

        let size = this.boardSize;
        let tileTypeCount: { [key: string]: number } = {};

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let tileType = this.tiles[i][j].tileType;
                if (tileType) {
                    if (tileTypeCount[tileType]) {
                        tileTypeCount[tileType]++;
                    } else {
                        tileTypeCount[tileType] = 1;
                    }
                }
            }
        }

        const getCount = (key: string): number => tileTypeCount[key] || 0;

        //pattern for calculating "usable NOTs"
        //tileTypeCount["notTile"] = Math.floor(size / 3) + (size % 3) - 1;
        //POSSIBLE EDGE CASE: IF THERE ARE PARENTHESES, THEN THAT WOULD ADJUST THE POTENTIAL "SIZE"
        //I THINK THE ONLY FIX IS TO HAVE DIFFERENT USABLE NOTS DEPENDING ON PARENTHESES

        const sizeReduction =
            2 *
                Math.min(
                    getCount("leftParenTile"),
                    getCount("rightParenTile")
                ) +
            getCount("notTile");
        let maxReduction = false;
        if (sizeReduction >= size - 1) {
            maxReduction = true;
        }
        size -= sizeReduction;

        size -= 1 - (size % 2);

        //need to account for NOTs?
        size = Math.max(size, 3);

        const operatorCount =
            getCount("orTile") + getCount("andTile") + getCount("xorTile");
        const literalCount = getCount("falseTile") + getCount("trueTile");
        const requiredOperatorCount = (size - 1) / 2;
        const requiredLiteralCount = (size + 1) / 2;

        //adjusts literal count based off of usable Nots
        const temp = getCount("falseTile");
        tileTypeCount["falseTile"] =
            getCount("falseTile") +
            Math.min(getCount("notTile"), getCount("trueTile"));
        tileTypeCount["trueTile"] =
            getCount("trueTile") + Math.min(getCount("notTile"), temp);
        console.log(tileTypeCount);

        //Solution 1: 1 or and 1 true, and enough literals and operators can always make a true
        const solution1 = getCount("orTile") >= 1 && getCount("trueTile") >= 1;
        //solution 2: if no ors, then solution is possible with enough ands and enough trues
        const solution2 =
            getCount("andTile") >= requiredOperatorCount &&
            getCount("trueTile") >= requiredLiteralCount;

        //solution 3: with enough parentheses, only the true tile is needed
        const solution3 = getCount("trueTile") >= 1 && maxReduction;

        //solution 4: with 1 xor, you just need one of each literal (problem 3 already checks for at least 1 true tile)
        const solution4 =
            getCount("xorTile") == 1 && getCount("falseTile") >= 1;

        //solution5: with 2 or more xor, you just need enough operators (no false tile is needed)
        const solution5 = getCount("xorTile") >= 2;

        //problem1: with an even board size, a NOT is needed to make a valid expression
        const problem1 = size % 2 == 0 && getCount("notTile") == 0;
        //problem2: you need a certain number of operators and literals to make a valid expression
        const problem2 =
            operatorCount < requiredOperatorCount ||
            literalCount < requiredLiteralCount;
        //problem3: you always need a TRUE to get an expression that evaluates to true
        const problem3 = getCount("trueTile") == 0;

        //problem4: if you only have xor tiles, you need an additional literal tile to create an exprssion that evaluates to true
        const problem4 =
            getCount("xorTiles") == operatorCount &&
            literalCount < requiredLiteralCount + 1;
        const anyValidSolution =
            (solution1 || solution2 || solution3 || solution4 || solution5) &&
            !(problem1 || problem2 || problem3 || problem4);
        console.log(`Any valid solution: ${anyValidSolution}`);
        console.log(
            `Solution chain: ${[
                solution1,
                solution2,
                solution3,
                solution4,
                solution5,
            ]}`
        );
        console.log(
            `Problem chain: ${[problem1, problem2, problem3, problem4]}`
        );

        return anyValidSolution;
    }
}
