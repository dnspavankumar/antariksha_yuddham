"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetBaker = void 0;
const core_1 = require("@babylonjs/core");
class PlanetBaker {
    //private _sun: AbstractMesh;
    constructor(scene, assetsHostUrl, renderTargetSize) {
        this.planet = null;
        this.atmosphere = null;
        this.renderTargetPlanet = new core_1.RenderTargetTexture('planetRT', renderTargetSize, scene, false, false); //undefined, undefined, TextureFormat.RGBA8Unorm);
        scene.customRenderTargets.push(this.renderTargetPlanet);
        this.renderTargetPlanet.clearColor = new core_1.Color4(0, 0, 0, 0);
        var camera = new core_1.ArcRotateCamera("planetRTCamera", 0, 0, 2, new core_1.Vector3(0, 0, 0), scene);
        this.renderTargetPlanet.activeCamera = camera;
        // planet
        core_1.SceneLoader.AppendAsync(assetsHostUrl + "/assets/gltf/planet_mesh.glb").then((loadedScene) => {
            this.planet = scene.getMeshByName("planet_mesh");
            this.atmosphere = scene.getMeshByName("atmosphere_mesh");
            if (this.atmosphere && this.planet && this.renderTargetPlanet && this.renderTargetPlanet.renderList) {
                this.renderTargetPlanet.renderList.push(this.planet);
                this.renderTargetPlanet.renderList.push(this.atmosphere);
                scene.removeMesh(this.planet);
                scene.removeMesh(this.atmosphere);
                this.atmosphere.billboardMode = core_1.Mesh.BILLBOARDMODE_ALL;
                this.atmosphere.scaling.x = 4;
                this.atmosphere.scaling.y = 4;
                this.planet.scaling = new core_1.Vector3(3.6, 3.6, 3.6);
                let shadowTexture = new core_1.Texture(assetsHostUrl + "/assets/textures/planet_shadow.jpg", scene, false, false);
                // with alpha #ZI6R7T
                core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/atmosphereShader.json", scene).then((atmosphereMaterial) => {
                    atmosphereMaterial.build(false);
                    atmosphereMaterial.alpha = 0.999;
                    atmosphereMaterial.alphaMode = core_1.Engine.ALPHA_COMBINE;
                    core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/planetLightingShader.json", scene).then((planetLightingMaterial) => {
                        planetLightingMaterial.build(false);
                        let planetBaseColor = planetLightingMaterial.getBlockByName("baseColorTex");
                        let planetRoughness = planetLightingMaterial.getBlockByName("roughnessTex");
                        let planetNormal = planetLightingMaterial.getBlockByName("normalTex");
                        let planetShadow = planetLightingMaterial.getBlockByName("shadowTex");
                        this.sunPosition = planetLightingMaterial.getBlockByName("sunPosition");
                        if (this.planet && this.planet.material) {
                            planetBaseColor.texture = this.planet.material.albedoTexture;
                            planetRoughness.texture = this.planet.material.metallicTexture;
                            planetNormal.texture = this.planet.material.bumpTexture;
                            planetShadow.texture = shadowTexture;
                            this.sunPosition.value = new core_1.Vector3(-2, -10, 20);
                            this.planet.material = planetLightingMaterial;
                        }
                        if (this.atmosphere) {
                            this.atmosphere.material = atmosphereMaterial;
                        }
                    });
                });
            }
        });
    }
    createPlanet(scene, worldSize, glowLayer) {
        var planet = core_1.MeshBuilder.CreatePlane("planetPlane", { size: worldSize }, scene);
        planet.billboardMode = core_1.Mesh.BILLBOARDMODE_ALL | core_1.Mesh.BILLBOARDMODE_USE_POSITION;
        var planetMaterial = new core_1.StandardMaterial("", scene);
        planetMaterial.backFaceCulling = false;
        planetMaterial.disableLighting = true;
        planetMaterial.diffuseTexture = this.renderTargetPlanet;
        planetMaterial.emissiveColor = new core_1.Color3(1, 1, 1);
        planetMaterial.alphaMode = core_1.Engine.ALPHA_COMBINE;
        planetMaterial.diffuseTexture.hasAlpha = true;
        planetMaterial.useAlphaFromDiffuseTexture = true;
        planet.material = planetMaterial;
        planet.alphaIndex = 5;
        glowLayer.addExcludedMesh(planet);
        this.renderTargetPlanet.refreshRate = 0;
        return planet;
    }
    static CreateSunPostProcess(camera, scene, assets) {
        const sun = new core_1.VolumetricLightScatteringPostProcess('volumetric', 1.0, camera, undefined, 100, core_1.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);
        // By default it uses a billboard to render the sun, just apply the desired texture
        if (sun.mesh && sun.mesh.material) {
            sun.mesh.material.diffuseTexture = assets.sunTexture;
            sun.mesh.material.diffuseTexture.hasAlpha = true;
            sun.mesh.scaling = new core_1.Vector3(150, 150, 150);
        }
        return sun;
    }
}
exports.PlanetBaker = PlanetBaker;
//# sourceMappingURL=PlanetBaker.js.map