"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameDefinition = void 0;
const core_1 = require("@babylonjs/core");
const ShipCamera_1 = require("./ShipCamera");
const Input_1 = require("./Inputs/Input");
const Missile_1 = require("./Missile");
const Ship_1 = require("./Ship");
const Shot_1 = require("./Shot");
const HUD_1 = require("./HUD");
const States_1 = require("./States/States");
const State_1 = require("./States/State");
const Parameters_1 = require("./Parameters");
const Recorder_1 = require("./Recorder/Recorder");
const Explosion_1 = require("./FX/Explosion");
const SparksEffect_1 = require("./FX/SparksEffect");
const GamepadInput_1 = require("./Inputs/GamepadInput");
const Trail_1 = require("./FX/Trail");
const World_1 = require("./World");
class GameDefinition {
    constructor() {
        this.humanAllies = 0;
        this.humanEnemies = 0;
        this.aiAllies = 0;
        this.aiEnemies = 0;
        this.seed = 2022;
        this.asteroidCount = 20;
        this.asteroidRadius = 1000;
        this.humanAlliesLife = 100;
        this.humanEnemiesLife = 100;
        this.aiAlliesLife = 50;
        this.aiEnemiesLife = 10;
        this.shotDamage = 1;
        this.missileDamage = 20;
        this.delayedEnd = 0;
        this.enemyBoundaryRadius = 400;
        this.humanBoundaryRadius = 800;
    }
}
exports.GameDefinition = GameDefinition;
class Game {
    //private _glowLayer: GlowLayer;
    constructor(assets, scene, canvas, gameDefinition, glowLayer) {
        this._renderObserver = null;
        this._speed = 1;
        this._targetSpeed = 1;
        this._recorder = null;
        this._hotkeyObservable = null;
        this.humanPlayerShips = new Array();
        this.activeCameras = new Array();
        this._scene = scene;
        var shootFrame = 0;
        if (!gameDefinition) {
            gameDefinition = new GameDefinition();
            gameDefinition.humanAllies = 1;
            gameDefinition.humanEnemies = 0;
            gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
            gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
            console.log("Using default game definition");
        }
        const MaxShips = gameDefinition.humanAllies + gameDefinition.humanEnemies + gameDefinition.aiEnemies + gameDefinition.aiAllies;
        this._shotManager = new Shot_1.ShotManager(assets, scene, glowLayer);
        this._trailManager = new Trail_1.TrailManager(scene, assets.trailMaterial ? assets.trailMaterial : new core_1.NodeMaterial("empty", scene), MaxShips + Missile_1.MAX_MISSILES);
        this._missileManager = new Missile_1.MissileManager(scene, this._trailManager);
        this._shipManager = new Ship_1.ShipManager(this._missileManager, this._shotManager, assets, this._trailManager, scene, MaxShips, gameDefinition, glowLayer);
        this._inputManager = new Input_1.InputManager(scene, canvas);
        this._explosions = new Explosion_1.ExplosionManager(scene, assets, glowLayer);
        this._sparksEffects = new SparksEffect_1.SparksEffects(scene, assets);
        if (Parameters_1.Parameters.recorderActive) {
            this._recorder = new Recorder_1.Recorder(this._shipManager, this._explosions, this._sparksEffects, this._shotManager, this._missileManager, this._trailManager, Parameters_1.Parameters.recordFrameCount);
            this._recorder.setRecordActive(true);
        }
        this.activeCameras = [];
        for (let i = 0; i < gameDefinition.humanAllies; i++) {
            const ship = this._shipManager.spawnShip(new core_1.Vector3(i * 50, 0, -500), core_1.Quaternion.Identity(), true, 0);
            if (ship) {
                const camera = new ShipCamera_1.ShipCamera(ship, scene);
                ship.shipCamera = camera;
                this.humanPlayerShips.push(ship);
                this.activeCameras.push(camera.getFreeCamera());
            }
        }
        this._world = new World_1.World(assets, scene, gameDefinition, this.activeCameras[0], glowLayer);
        for (let i = 0; i < gameDefinition.humanEnemies; i++) {
            const ship = this._shipManager.spawnShip(new core_1.Vector3(i * 50, 0, 500), core_1.Quaternion.FromEulerAngles(0, Math.PI, 0), true, 1);
            if (ship) {
                const camera = new ShipCamera_1.ShipCamera(ship, scene);
                ship.shipCamera = camera;
                this.humanPlayerShips.push(ship);
                this.activeCameras.push(camera.getFreeCamera());
            }
        }
        this._cameraDummy = new core_1.FreeCamera("camera1", new core_1.Vector3(0, 0, 0), scene);
        this._cameraDummy.layerMask = 0x10000000;
        this.activeCameras.push(this._cameraDummy);
        // Cameras
        const divCamera = 1 / (this.activeCameras.length - 1);
        for (let i = 0; i < (this.activeCameras.length - 1); i++) {
            const camera = this.activeCameras[i];
            camera.viewport.x = i * divCamera;
            camera.viewport.width = divCamera;
        }
        scene.activeCameras = this.activeCameras;
        if (this.humanPlayerShips.length) {
            this._world.ship = this.humanPlayerShips[0];
        }
        for (let i = 1; i <= gameDefinition.aiAllies; i++) {
            this._shipManager.spawnShip(new core_1.Vector3(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50 - 500), core_1.Quaternion.FromEulerAngles(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2), false, 0);
        }
        for (let i = 1; i <= gameDefinition.aiEnemies; i++) {
            this._shipManager.spawnShip(new core_1.Vector3(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50 + 500), core_1.Quaternion.FromEulerAngles(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2), false, 1);
        }
        // remove asteroids too close to ships
        this._world.removeAsteroids(new core_1.Vector3(0, 0, -500), 50);
        this._world.removeAsteroids(new core_1.Vector3(0, 0, 500), 50);
        this._HUD = new HUD_1.HUD(this._shipManager, assets, scene, this.humanPlayerShips);
        scene.customLODSelector = (mesh, camera) => { return mesh; };
        scene.freezeMaterials();
        //AbstractMesh.isInFrustum = function() { return true; };
        this._renderObserver = scene.onBeforeRenderObservable.add(() => {
            this._speed += (this._targetSpeed - this._speed) * 0.1;
            const deltaTime = scene.getEngine().getDeltaTime() * this._speed;
            Input_1.InputManager.deltaTime = deltaTime;
            GamepadInput_1.GamepadInput.gamepads.forEach(gp => gp.tick());
            shootFrame -= deltaTime;
            let canShoot = false;
            if (shootFrame <= 0) {
                canShoot = true;
                shootFrame = 130; // can shoot only every 130 ms
            }
            this._shipManager.tick(canShoot, Input_1.InputManager.input, deltaTime, this._speed, this._sparksEffects, this._explosions, this._world, this._targetSpeed);
            this.humanPlayerShips.forEach((ship) => {
                if (ship && ship.shipCamera) {
                    var wmat = ship.root.getWorldMatrix();
                    ship.shipCamera.Tick(ship, wmat, ship.speedRatio, this._speed);
                }
            });
            this._shotManager.tick(deltaTime, this._world);
            this._missileManager.tick(deltaTime, this._explosions, this._world);
            if (this._HUD) {
                this._HUD.tick(scene.getEngine(), this._speed, this.humanPlayerShips);
            }
            if (this._recorder) {
                this._recorder.tick();
            }
            this._sparksEffects.tick(deltaTime);
            this._explosions.tick(deltaTime);
            if (this._targetSpeed === 1) {
                this._trailManager.tick(deltaTime);
            }
            // victory check
            this._checkVictory(scene.getEngine().getDeltaTime() / 1000);
        });
        /* inspector
        this._hotkeyObservable = scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
              case KeyboardEventTypes.KEYDOWN:
                if (kbInfo.event.key == 'i') {
                    if (this._scene.debugLayer.isVisible()) {
                        this._scene.debugLayer.hide();
                    } else {
                        this._scene.debugLayer.show();
                    }
                }
                break;
            }
        });
        */
        this._delayedEnd = gameDefinition.delayedEnd;
    }
    getShipManager() {
        return this._shipManager;
    }
    setTargetSpeed(speed) {
        this._targetSpeed = speed;
    }
    /*
        public getCamera(): Camera {
            return this._camera;
        }
    */
    getRecorder() {
        return this._recorder;
    }
    _checkVictory(deltaTime) {
        var enemyCount = 0;
        var player = null;
        this._shipManager.ships.forEach((ship, shipIndex) => {
            if (ship.isValid()) {
                if (ship.faction == 1) {
                    enemyCount++;
                }
                if (ship.isHuman) {
                    player = ship;
                }
            }
        });
        if (!player) {
            if (this._delayedEnd <= 0) {
                if (this._HUD) {
                    this._HUD.dispose();
                    this._HUD = null;
                }
                State_1.State.setCurrent(States_1.States.dead);
            }
            this._delayedEnd -= deltaTime;
        }
        else if (!enemyCount) {
            if (this._delayedEnd <= 0) {
                States_1.States.victory.ship = player;
                if (this._HUD) {
                    this._HUD.dispose();
                    this._HUD = null;
                }
                State_1.State.setCurrent(States_1.States.victory);
            }
            this._delayedEnd -= deltaTime;
        }
    }
    dispose() {
        this._shipManager.dispose();
        this._missileManager.dispose();
        this._shotManager.dispose();
        if (this._HUD) {
            this._HUD.dispose();
            this._HUD = null;
        }
        this._inputManager.dispose();
        if (this._recorder) {
            this._recorder.dispose();
        }
        this._explosions.dispose();
        this._sparksEffects.dispose();
        this._trailManager.dispose();
        this._world.dispose();
        this._scene.onBeforeRenderObservable.remove(this._renderObserver);
        this._cameraDummy.dispose();
        if (this._scene && this._hotkeyObservable) {
            this._scene.onKeyboardObservable.remove(this._hotkeyObservable);
        }
        //this._glowLayer.dispose();
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map