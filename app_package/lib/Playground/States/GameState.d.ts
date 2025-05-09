import { Nullable } from "@babylonjs/core";
import { State } from "./State";
import { GameSession } from "./GameSession";
import { GameDefinition } from "../Game";
export declare class GameState extends State {
    static gameSession: Nullable<GameSession>;
    static gameDefinition: Nullable<GameDefinition>;
    exit(): void;
    enter(): void;
}
//# sourceMappingURL=GameState.d.ts.map