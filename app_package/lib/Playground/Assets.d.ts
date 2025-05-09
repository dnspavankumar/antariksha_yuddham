import { AbstractMesh, Scene, Nullable, NodeMaterial, Texture, NodeMaterialBlock, Vector3, CubeTexture, Sound, AssetContainer } from "@babylonjs/core";
import { PlanetBaker } from "./FX/PlanetBaker";
export declare class Assets {
    raider: Nullable<AbstractMesh>;
    valkyrie: Nullable<AbstractMesh>;
    trailMaterial: Nullable<NodeMaterial>;
    starfieldMaterial: Nullable<NodeMaterial>;
    sunTexture: Nullable<Texture>;
    starfieldTextureBlock: Nullable<NodeMaterialBlock>;
    planetMaterial: Nullable<NodeMaterial>;
    sparksEffect: Nullable<NodeMaterial>;
    asteroidsTriPlanar: Nullable<NodeMaterial>;
    explosionMaterial: Nullable<NodeMaterial>;
    explosionMesh: Nullable<AbstractMesh>;
    thrusterMesh: Nullable<AbstractMesh>;
    vortexMesh: Nullable<AbstractMesh>;
    noisyRockMaterial: Nullable<NodeMaterial>;
    projectileShader: Nullable<NodeMaterial>;
    thrusterShader: Nullable<NodeMaterial>;
    vortexShader: Nullable<NodeMaterial>;
    asteroidMeshes: Nullable<AssetContainer>;
    asteroidLocation: Nullable<AssetContainer>;
    starfield: Nullable<AbstractMesh>;
    raidercannonL: Nullable<Vector3>;
    raidercannonR: Nullable<Vector3>;
    valkyriecannonL: Nullable<Vector3>;
    valkyriecannonR: Nullable<Vector3>;
    audio: Nullable<AudioAssets>;
    assetsHostUrl: string;
    static missions: any;
    envCube: CubeTexture;
    planetBaker: PlanetBaker;
    shieldEffectMaterial: Nullable<NodeMaterial>;
    projectile: Nullable<AbstractMesh>;
    static loadingComplete: boolean;
    constructor(scene: Scene, assetsHostUrl: string, whenReady: (assets: Assets) => void, whenLoadingComplete: (assets: Assets) => void);
    private _completeLoading;
    loadAssets(): Promise<unknown>;
    dispose(): void;
}
declare class AudioAssets {
    ready: boolean;
    explosionSounds: Sound[];
    heroLaserSounds: Sound[];
    raiderLaserSounds: Sound[];
    thrusterSound: Sound;
    heroEngineSound: Sound;
    laserHitSound: Sound;
    missileFireSound: Sound;
    private _sounds;
    private _soundCount;
    constructor(assetsHostUrl: string, scene: Scene);
    soundReady(): void;
}
export {};
//# sourceMappingURL=Assets.d.ts.map