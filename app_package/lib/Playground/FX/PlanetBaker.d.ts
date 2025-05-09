import { Scene, RenderTargetTexture, VolumetricLightScatteringPostProcess, Nullable, Mesh, AbstractMesh, Camera, GlowLayer } from "@babylonjs/core";
import { Assets } from "../Assets";
export declare class PlanetBaker {
    renderTargetPlanet: RenderTargetTexture;
    sunPosition: any;
    planet: Nullable<AbstractMesh>;
    atmosphere: Nullable<AbstractMesh>;
    constructor(scene: Scene, assetsHostUrl: string, renderTargetSize: number);
    createPlanet(scene: Scene, worldSize: number, glowLayer: GlowLayer): Mesh;
    static CreateSunPostProcess(camera: Camera, scene: Scene, assets: Assets): VolumetricLightScatteringPostProcess;
}
//# sourceMappingURL=PlanetBaker.d.ts.map