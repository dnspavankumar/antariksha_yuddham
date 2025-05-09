import { Vector3, Scene, Quaternion, GlowLayer } from "@babylonjs/core";
import { Assets } from "../Assets";
export declare const MAX_EXPLOSIONS = 4;
export declare class Explosion {
    private _explosionMesh;
    private _sparkEffect;
    private _time;
    constructor(scene: Scene, assets: Assets, glowLayer: GlowLayer);
    setTime(timeMs: number): void;
    addDeltaTime(deltaTimeMs: number): void;
    tickEnabled(): void;
    setPositionOrientation(position: Vector3, orientation: Quaternion): void;
    valid(): boolean;
    getTime(): number;
    getPosition(): Vector3;
    getOrientation(): Quaternion;
    dispose(): void;
}
export declare class ExplosionManager {
    private _explosions;
    constructor(scene: Scene, assets: Assets, glowLayer: GlowLayer);
    getExplosions(): Array<Explosion>;
    spawnExplosion(position: Vector3, orientation: Quaternion): void;
    tick(deltaTime: number): void;
    dispose(): void;
}
//# sourceMappingURL=Explosion.d.ts.map