"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const core_1 = require("@babylonjs/core");
const __1 = require("..");
const PlanetBaker_1 = require("./FX/PlanetBaker");
const Parameters_1 = require("./Parameters");
class Assets {
    constructor(scene, assetsHostUrl, whenReady, whenLoadingComplete) {
        this.raider = null;
        this.valkyrie = null;
        this.trailMaterial = null;
        this.starfieldMaterial = null;
        this.sunTexture = null;
        this.starfieldTextureBlock = null;
        this.planetMaterial = null;
        this.sparksEffect = null;
        this.asteroidsTriPlanar = null;
        this.explosionMaterial = null;
        this.explosionMesh = null;
        this.thrusterMesh = null;
        this.vortexMesh = null;
        this.noisyRockMaterial = null;
        this.projectileShader = null;
        this.thrusterShader = null;
        this.vortexShader = null;
        this.asteroidMeshes = null;
        this.asteroidLocation = null;
        this.starfield = null;
        this.raidercannonL = null;
        this.raidercannonR = null;
        this.valkyriecannonL = null;
        this.valkyriecannonR = null;
        this.audio = null;
        this.shieldEffectMaterial = null;
        this.projectile = null;
        var _this = this;
        this.assetsHostUrl = assetsHostUrl;
        // add in IBL with linked environment
        this.envCube = core_1.CubeTexture.CreateFromPrefilteredData(assetsHostUrl + "/assets/env/environment.env", scene);
        this.envCube.name = "environment";
        this.envCube.gammaSpace = false;
        this.envCube.rotationY = 1.977;
        this.planetBaker = new PlanetBaker_1.PlanetBaker(scene, assetsHostUrl, 512);
        scene.environmentTexture = this.envCube;
        scene.environmentIntensity = 1.25;
        // MINIMAL loading
        var assetsManagerMinimal = new core_1.AssetsManager(scene);
        var valkyrieTask = assetsManagerMinimal.addMeshTask("valkyrieTask", "", assetsHostUrl + "/assets/gltf/", "valkyrie_mesh.glb");
        valkyrieTask.onSuccess = function (task) {
            _this.valkyrie = task.loadedMeshes[0];
            _this.valkyrie.getChildTransformNodes().forEach((m) => {
                if (m.name == "valkyrie_cannon_L")
                    _this.valkyriecannonL = m.absolutePosition.clone();
                else if (m.name == "valkyrie_cannon_R")
                    _this.valkyriecannonR = m.absolutePosition.clone();
            });
        };
        var starsGeoTask = assetsManagerMinimal.addMeshTask("starsGeoTask", "", assetsHostUrl + "/assets/gltf/", "starsGeo.glb");
        starsGeoTask.onSuccess = function (task) {
            _this.starfield = task.loadedMeshes[1];
            if (_this.starfield) {
                _this.starfield.scaling = new core_1.Vector3(4500, 4500, 4500);
                _this.starfield.visibility = 0;
            }
        };
        var thrusterTask = assetsManagerMinimal.addMeshTask("thrusterTask", "", assetsHostUrl + "/assets/gltf/", "thrusterFlame_mesh.glb");
        thrusterTask.onSuccess = function (task) {
            _this.thrusterMesh = task.loadedMeshes[1];
        };
        var vortexTask = assetsManagerMinimal.addMeshTask("vortexTask", "", assetsHostUrl + "/assets/gltf/", "vortex_mesh.glb");
        vortexTask.onSuccess = function (task) {
            _this.vortexMesh = task.loadedMeshes[1];
        };
        assetsManagerMinimal.onTasksDoneObservable.add(() => {
            core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/thrusterFlame.json", scene).then((nodeMaterial) => {
                _this.thrusterShader = nodeMaterial.clone("thrusterMaterial", true);
                _this.thrusterShader.backFaceCulling = false;
                _this.thrusterShader.alphaMode = 1;
                core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/vortex.json", scene).then((nodeMaterial) => {
                    _this.vortexShader = nodeMaterial.clone("vortexMaterial", true);
                    _this.vortexShader.backFaceCulling = false;
                    _this.vortexShader.alphaMode = 1;
                    const starfieldShaderName = Parameters_1.Parameters.starfieldHeavyShader ? "/assets/shaders/starfieldShaderHeavy.json" : "/assets/shaders/starfieldShader.json";
                    core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + starfieldShaderName, scene).then((nodeMaterial) => {
                        //nodeMaterial.build(false);
                        if (_this.starfield) {
                            const starfieldTexture = new core_1.Texture(assetsHostUrl + "/assets/textures/starfield_panorama_texture_mini.jpg", scene, false, false);
                            if (nodeMaterial.getBlockByName("emissiveTex")) {
                                _this.starfieldTextureBlock = nodeMaterial.getBlockByName("emissiveTex");
                                _this.starfieldTextureBlock.texture = starfieldTexture;
                            }
                            _this.starfield.material = nodeMaterial;
                        }
                        _this.starfieldMaterial = nodeMaterial;
                        console.log("Minimal asset loading done");
                        if (__1.useNative) {
                            core_1.Tools.LoadFileAsync("https://raw.githubusercontent.com/CedricGuillemet/dump/master/droidsans.ttf", true).then((data) => {
                                _native.Canvas.loadTTFAsync("Arial", data);
                                whenReady(_this);
                            });
                        }
                        else {
                            whenReady(_this);
                        }
                        // minimal done
                        this._completeLoading(scene, assetsHostUrl, whenLoadingComplete);
                    });
                });
            });
        });
        assetsManagerMinimal.load();
    }
    _completeLoading(scene, assetsHostUrl, whenLoadingComplete) {
        // COMPLETE loading
        var _this = this;
        var assetsManager = new core_1.AssetsManager(scene);
        var raiderTask = assetsManager.addMeshTask("raiderTask", "", assetsHostUrl + "/assets/gltf/", "raider_mesh.glb");
        raiderTask.onSuccess = function (task) {
            _this.raider = task.loadedMeshes[0];
            _this.raider.getChildTransformNodes().forEach((m) => {
                if (m.name == "raider_cannon_L")
                    _this.raidercannonL = m.absolutePosition.clone();
                else if (m.name == "raider_cannon_R")
                    _this.raidercannonR = m.absolutePosition.clone();
            });
        };
        var explosionMeshTask = assetsManager.addMeshTask("explosionMeshTask", "", assetsHostUrl + "/assets/gltf/", "explosionSpheres_mesh.glb");
        explosionMeshTask.onSuccess = function (task) {
            var _a;
            _this.explosionMesh = task.loadedMeshes[1];
            _this.explosionMesh.parent = null;
            (_a = _this.explosionMesh.material) === null || _a === void 0 ? void 0 : _a.dispose();
        };
        var asteroidsTask = assetsManager.addContainerTask("asteroidsTask", "", assetsHostUrl + "/assets/gltf/", "asteroids_meshes.glb");
        asteroidsTask.onSuccess = function (task) {
            _this.asteroidMeshes = task.loadedContainer;
        };
        var asteroidsTask = assetsManager.addContainerTask("asteroidsTask", "", assetsHostUrl + "/assets/gltf/", "asteroid_V1.glb");
        asteroidsTask.onSuccess = function (task) {
            _this.asteroidLocation = task.loadedContainer;
        };
        var projectileTask = assetsManager.addMeshTask("projectileTask", "", assetsHostUrl + "/assets/gltf/", "projectile_mesh.glb");
        projectileTask.onSuccess = function (task) {
            _this.projectile = task.loadedMeshes[1];
            _this.projectile.scaling = new core_1.Vector3(100, 100, 100);
            _this.projectile.bakeTransformIntoVertices(_this.projectile.computeWorldMatrix(true));
            _this.projectile.setEnabled(false);
        };
        var missionsTask = assetsManager.addTextFileTask("missionsTask", assetsHostUrl + "/assets/missions.json");
        missionsTask.onSuccess = function (task) {
            Assets.missions = JSON.parse(task.text);
        };
        this.sunTexture = new core_1.Texture(assetsHostUrl + "/assets/textures/sun.png", scene, true, false, core_1.Texture.BILINEAR_SAMPLINGMODE);
        assetsManager.onTasksDoneObservable.add(() => {
            core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/shields.json", scene).then((nodeMaterial) => {
                _this.shieldEffectMaterial = nodeMaterial;
                core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/projectileUVShader.json", scene).then((nodeMaterial) => {
                    //NodeMaterial.ParseFromSnippetAsync("19ALD5#7", scene).then((nodeMaterial:any) => {
                    _this.projectileShader = nodeMaterial.clone("projectileMaterial", true);
                    core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/TrailShader.json", scene).then((nodeMaterial) => {
                        //NodeMaterial.ParseFromSnippetAsync("NLDUNC#8", scene).then((nodeMaterial:any) => {
                        _this.trailMaterial = nodeMaterial.clone("trailMaterial", true);
                        core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/explosionLayeredShader.json", scene).then((nodeMaterial) => {
                            _this.explosionMaterial = nodeMaterial.clone("explosionMaterial", true);
                            //nodeMaterial.getBlockByName("startTime").value = nodeMaterial.getBlockByName("Time").value;
                            _this.explosionMaterial.getBlockByName("noiseTex").texture = new core_1.Texture(assetsHostUrl + "/assets/textures/noise_squareMask.png", scene, false, false);
                            _this.explosionMaterial.backFaceCulling = false;
                            _this.explosionMaterial.alphaMode = 1;
                            core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/planetShaderGreybox.json", scene).then((nodeMaterial) => {
                                _this.planetMaterial = nodeMaterial;
                                core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/SparksShader.json", scene).then((nodeMaterial) => {
                                    _this.sparksEffect = nodeMaterial;
                                    core_1.NodeMaterial.ParseFromFileAsync("", assetsHostUrl + "/assets/shaders/asteroidsTriplanarShader.json", scene).then((nodeMaterial) => {
                                        _this.asteroidsTriPlanar = nodeMaterial;
                                        if (Parameters_1.Parameters.enableAudio) {
                                            this.audio = new AudioAssets(assetsHostUrl, scene);
                                        }
                                        const starfieldTexture = new core_1.Texture(assetsHostUrl + "/assets/textures/starfield_panorama_texture.jpg", scene, false, false);
                                        if (_this.starfieldTextureBlock) {
                                            _this.starfieldTextureBlock.texture = starfieldTexture;
                                        }
                                        Assets.loadingComplete = true;
                                        whenLoadingComplete(this);
                                        console.log("Complete asset loading done");
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        assetsManager.load();
    }
    loadAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
            });
        });
    }
    dispose() {
    }
}
exports.Assets = Assets;
Assets.loadingComplete = false;
class AudioAssets {
    constructor(assetsHostUrl, scene) {
        this.ready = false;
        this._sounds = 0;
        this._soundCount = 6;
        this.explosionSounds = [new core_1.Sound("explosion", assetsHostUrl + "/assets/sounds/explosions/explosion1.mp3", scene, this.soundReady, {
                spatialSound: true,
                distanceModel: "exponential",
                rolloffFactor: 0.2,
                volume: 2
            }),
            new core_1.Sound("explosion", assetsHostUrl + "/assets/sounds/explosions/explosion2.mp3", scene, this.soundReady, {
                spatialSound: true,
                distanceModel: "exponential",
                rolloffFactor: 0.2,
                volume: 2
            })];
        this.heroLaserSounds = [new core_1.Sound("laser", assetsHostUrl + "/assets/sounds/heroShip/heroLaser1.mp3", scene, this.soundReady, {
                spatialSound: false,
                distanceModel: "exponential",
                rolloffFactor: 1,
                volume: 1
            }),
            new core_1.Sound("laser", assetsHostUrl + "/assets/sounds/heroShip/heroLaser2.mp3", scene, this.soundReady, {
                spatialSound: false,
                distanceModel: "exponential",
                rolloffFactor: 1,
                volume: 1
            }),
            new core_1.Sound("laser", assetsHostUrl + "/assets/sounds/heroShip/heroLaser3.mp3", scene, this.soundReady, {
                spatialSound: false,
                distanceModel: "exponential",
                rolloffFactor: 1,
                volume: 1
            })];
        this.raiderLaserSounds = [new core_1.Sound("laser", assetsHostUrl + "/assets/sounds/raider/raiderLaser1.mp3", scene, this.soundReady, {
                spatialSound: true,
                distanceModel: "exponential",
                rolloffFactor: 1,
                volume: 1
            }),
            new core_1.Sound("laser", assetsHostUrl + "/assets/sounds/raider/raiderLaser2.mp3", scene, this.soundReady, {
                spatialSound: true,
                distanceModel: "exponential",
                rolloffFactor: 1,
                volume: 1
            }),
            new core_1.Sound("laser", assetsHostUrl + "/assets/sounds/raider/raiderLaser3.mp3", scene, this.soundReady, {
                spatialSound: true,
                distanceModel: "exponential",
                rolloffFactor: 1,
                volume: 1
            })];
        this.thrusterSound = new core_1.Sound("thruster", assetsHostUrl + "/assets/sounds/heroShip/thrusterFire_000.ogg", scene, this.soundReady, {
            autoplay: true,
            loop: true,
            volume: 0
        });
        this.heroEngineSound = new core_1.Sound("engine", assetsHostUrl + "/assets/sounds/heroShip/heroShipFlying.mp3", scene, this.soundReady, {
            autoplay: true,
            loop: true,
            volume: 1
        });
        /*this.raiderEngineSound = new Sound("engine", assetsHostUrl + "/assets/sounds/raider/raiderFlying.mp3", scene, this.soundReady, {
            autoplay: true,
            loop: true,
            volume: 0.1
        });*/
        this.laserHitSound = new core_1.Sound("laserHit", assetsHostUrl + "/assets/sounds/raider/raiderHitByLaser", scene, this.soundReady, {
            spatialSound: true,
            distanceModel: "exponential",
            rolloffFactor: 0.7,
            volume: 3
        });
        this.missileFireSound = new core_1.Sound("missileFire", assetsHostUrl + "/assets/sounds/heroShip/rocketLaunch.mp3", scene, this.soundReady, {
            spatialSound: true,
            distanceModel: "exponential",
            rolloffFactor: 1,
            volume: 8
        });
    }
    soundReady() {
        this._sounds++;
        if (this._sounds == this._soundCount) {
            this.ready = true;
        }
    }
}
//# sourceMappingURL=Assets.js.map