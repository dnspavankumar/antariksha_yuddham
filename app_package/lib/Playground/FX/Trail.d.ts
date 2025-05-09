import { Vector3, Scene, NodeMaterial, Nullable, RawTexture, Color3 } from "@babylonjs/core";
export declare const MAX_TRAILS: number;
export declare const TRAIL_LENGTH = 256;
export declare class Trail {
    private _data;
    private _mesh;
    private _trackSampler0Block;
    private _trackSampler1Block;
    private _globalAlphaBlock;
    private _colorBlock;
    private _trailU;
    private _trailMaterial;
    private _color;
    private _alpha;
    private _valid;
    private _visible;
    private _currentIndex;
    private _trailIndex;
    private _side;
    private static _tempVec3;
    constructor(scene: Scene, trailMaterial: NodeMaterial, trailIndex: number, maxTrails: number, data: Float32Array, texture: RawTexture);
    getColor(): Color3;
    getSide(): number;
    getAlpha(): number;
    spawn(position: Vector3, side: number): void;
    private _appendPosition;
    private _getPositionToRef;
    append(position: Vector3): void;
    setCurrentIndex(currentIndex: number): void;
    update(): void;
    setParameters(color: Color3, alpha: number): void;
    setVisible(visible: boolean): void;
    invalidate(): void;
    isValid(): boolean;
    tickEnabled(): void;
    tick(deltaTime: number, currentIndex: number): void;
    dispose(): void;
}
export declare class TrailManager {
    private _trails;
    private _currentIndex;
    private _data;
    private _texture;
    constructor(scene: Scene, trailMaterial: NodeMaterial, maxTrails: number);
    tick(deltaTime: number): void;
    spawnTrail(position: Vector3, side: number): Nullable<Trail>;
    getCurrentIndex(): number;
    setCurrentIndex(currentIndex: number): void;
    getData(): Float32Array;
    update(): void;
    getTrails(): Array<Trail>;
    dispose(): void;
}
//# sourceMappingURL=Trail.d.ts.map