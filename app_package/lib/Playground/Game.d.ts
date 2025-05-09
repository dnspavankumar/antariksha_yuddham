import { Scene, Nullable, Camera, GlowLayer } from "@babylonjs/core";
import { Ship, ShipManager } from "./Ship";
import { Assets } from "./Assets";
import { Recorder } from "./Recorder/Recorder";
export declare class GameDefinition {
    humanAllies: number;
    humanEnemies: number;
    aiAllies: number;
    aiEnemies: number;
    seed: number;
    asteroidCount: number;
    asteroidRadius: number;
    humanAlliesLife: number;
    humanEnemiesLife: number;
    aiAlliesLife: number;
    aiEnemiesLife: number;
    shotDamage: number;
    missileDamage: number;
    delayedEnd: number;
    enemyBoundaryRadius: number;
    humanBoundaryRadius: number;
}
export declare class Game {
    private _shipManager;
    private _missileManager;
    private _shotManager;
    private _trailManager;
    private _scene;
    private _inputManager;
    private _renderObserver;
    private _HUD;
    private _speed;
    private _targetSpeed;
    private _recorder;
    private _explosions;
    private _sparksEffects;
    private _world;
    private _hotkeyObservable;
    private _cameraDummy;
    humanPlayerShips: Array<Ship>;
    activeCameras: Array<Camera>;
    private _delayedEnd;
    constructor(assets: Assets, scene: Scene, canvas: HTMLCanvasElement, gameDefinition: Nullable<GameDefinition>, glowLayer: GlowLayer);
    getShipManager(): ShipManager;
    setTargetSpeed(speed: number): void;
    getRecorder(): Nullable<Recorder>;
    private _checkVictory;
    dispose(): void;
}
//# sourceMappingURL=Game.d.ts.map