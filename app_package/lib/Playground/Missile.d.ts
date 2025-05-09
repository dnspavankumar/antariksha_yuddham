import { Quaternion, Vector3, Matrix, Scene, TransformNode, Nullable } from "@babylonjs/core";
import { Agent } from "./Agent";
import { Ship } from "./Ship";
import { TrailManager } from "./FX/Trail";
import { ExplosionManager } from "./FX/Explosion";
import { World } from "./World";
export declare const MAX_MISSILES: number;
export declare const MISSILE_MAX_LIFE: number;
export declare class Missile extends Agent {
    private _trail;
    shipToChase: Nullable<Ship>;
    time: number;
    firedBy: Nullable<Ship>;
    constructor(scene: Scene);
    launch(shipToChase: Ship, firedBy: Ship, worldPosition: Vector3, worldOrientation: Quaternion, missileTransform: TransformNode, trailManager: TrailManager): void;
    dispose(): void;
    tick(rx: Quaternion, ry: Quaternion, deltaTimeMs: number): boolean;
    getWorldMatrix(): Matrix;
    getPosition(): Vector3;
    getOrientation(): Quaternion;
    setTime(timeMs: number): boolean;
    tickEnabled(): void;
    getTime(): number;
    isValid(): boolean;
    setPositionOrientation(position: Vector3, orientation: Quaternion): void;
}
export declare class MissileManager {
    missiles: Missile[];
    private _tmpMatrix;
    private _trailManager;
    constructor(scene: Scene, trailManager: TrailManager);
    getMissiles(): Array<Missile>;
    fireMissile(position: Vector3, quaternion: Quaternion, shipToChase: Ship, firedBy: Ship, missileTransform: TransformNode): Nullable<Missile>;
    tick(deltaTime: number, explosionManager: ExplosionManager, world: World): void;
    invalidateMissileChasing(shipToChase: Ship): void;
    dispose(): void;
}
//# sourceMappingURL=Missile.d.ts.map