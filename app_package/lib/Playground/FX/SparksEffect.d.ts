import { Vector3, Scene, Quaternion } from "@babylonjs/core";
import { Assets } from "../Assets";
export declare class SparksEffect {
    private _SPS;
    private _time;
    private _renderObserver;
    private _scene;
    constructor(scene: Scene, assets: Assets, sparkCount: number);
    valid(): boolean;
    setPositionOrientation(position: Vector3, orientation: Quaternion): void;
    setTime(timeMs: number): void;
    addDeltaTime(deltaTimeMs: number): void;
    tickEnable(): void;
    getTime(): number;
    getPosition(): Vector3;
    getOrientation(): Quaternion;
    dispose(): void;
}
export declare class SparksEffects {
    private _shots;
    constructor(scene: Scene, assets: Assets);
    tick(deltaTime: number): void;
    getSparksEffects(): Array<SparksEffect>;
    addShot(position: Vector3, orientation: Quaternion): void;
    dispose(): void;
}
//# sourceMappingURL=SparksEffect.d.ts.map