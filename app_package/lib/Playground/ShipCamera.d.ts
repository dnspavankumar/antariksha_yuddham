import { Vector3, Scene, FreeCamera, Matrix } from "@babylonjs/core";
import { Ship } from "./Ship";
export declare class ShipCamera {
    private _camera;
    private _ship;
    private _shakeDelay;
    private _shakeVector;
    private StarCount;
    private StarSpread;
    private StarPositions;
    private Stars;
    getFreeCamera(): FreeCamera;
    isOnScreen(position: Vector3): boolean;
    private _initBurst;
    private _tickBurst;
    constructor(ship: Ship, scene: Scene);
    Tick(ship: Ship, shipWorldMatrix: Matrix, speedRatio: number, gameSpeed: number): void;
    dispose(): void;
}
//# sourceMappingURL=ShipCamera.d.ts.map