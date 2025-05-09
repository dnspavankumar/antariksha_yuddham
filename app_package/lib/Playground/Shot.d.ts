import { Scene, Matrix, GlowLayer } from "@babylonjs/core";
import { Assets } from "./Assets";
import { Ship } from "./Ship";
import { World } from "./World";
export declare const MAX_SHOTS = 200;
export declare class Shot {
    ttl: number;
    firedBy?: Ship;
}
export declare class ShotManager {
    shots: Shot[];
    private _matricesData;
    private _shotMesh;
    private _tmpVec3;
    constructor(assets: Assets, scene: Scene, glowLayer: GlowLayer);
    getMatrixData(): Float32Array;
    getMatrices(): Float32Array;
    addShot(ship: Ship, worldMatrix: Matrix, isHuman: boolean, cannonIndex: number): void;
    tick(deltaTime: number, world: World): void;
    matricesToInstances(): void;
    dispose(): void;
}
//# sourceMappingURL=Shot.d.ts.map