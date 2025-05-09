import { Scene, Nullable, GlowLayer } from "@babylonjs/core";
import { Game, GameDefinition } from "../Game";
import { Assets } from "../Assets";
export declare class GameSession {
    private _game;
    private _assets;
    private _scene;
    private _canvas;
    private _glowLayer;
    constructor(assets: Assets, scene: Scene, canvas: HTMLCanvasElement, glowLayer: GlowLayer);
    getScene(): Scene;
    getCanvas(): HTMLCanvasElement;
    getGame(): Nullable<Game>;
    start(gameDefinition: Nullable<GameDefinition>): void;
    stop(): void;
    inProgress(): boolean;
    pause(): void;
    resume(): void;
}
//# sourceMappingURL=GameSession.d.ts.map