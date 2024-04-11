import Phaser from "phaser";
import Game from "./Game";
export default class Stage {
    name: string;
    games: Game[];

    constructor(name: string, games: Game[]) {
        this.name = name;
        this.games = games;
    }
}
