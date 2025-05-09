import { Vector3, Mesh, Scene, Nullable, VolumetricLightScatteringPostProcess, Camera, GlowLayer } from "@babylonjs/core";
import { Ship } from "./Ship";
import { Assets } from "./Assets";
import { GameDefinition } from "./Game";
export declare class World {
    private _starfield;
    private _asteroids;
    private _renderObserver;
    private _scene;
    private _planet;
    private _atmosphere;
    private _tmpVec3;
    private _camera;
    ship: Nullable<Ship>;
    sun: VolumetricLightScatteringPostProcess;
    constructor(assets: Assets, scene: Scene, gameDefinition: GameDefinition, camera: Camera, glowLayer: GlowLayer);
    static updateSunPostProcess(referencePosition: Vector3, sunMesh: Mesh): void;
    dispose(): void;
    collideWithAsteroids(position: Vector3, radius: number): boolean;
    shouldAvoid(position: Vector3, radius: number, avoidPos: Vector3): boolean;
    removeAsteroids(position: Vector3, radius: number): void;
}
//# sourceMappingURL=World.d.ts.map