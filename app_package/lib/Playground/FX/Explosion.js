"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplosionManager = exports.Explosion = exports.MAX_EXPLOSIONS = void 0;
const core_1 = require("@babylonjs/core");
const SparksEffect_1 = require("./SparksEffect");
exports.MAX_EXPLOSIONS = 4;
const SPARK_COUNT_EXPLOSION = 100;
const EXPLOSION_TIMEOUT = 2000;
class Explosion {
    constructor(scene, assets, glowLayer) {
        var _a;
        this._explosionMesh = null;
        this._time = 9999; // in milliseconds
        this._sparkEffect = new SparksEffect_1.SparksEffect(scene, assets, SPARK_COUNT_EXPLOSION);
        if (assets.explosionMesh && assets.explosionMaterial) {
            this._explosionMesh = (_a = assets.explosionMesh) === null || _a === void 0 ? void 0 : _a.clone("explosionClone", null);
            if (this._explosionMesh) {
                //GLOW LAYER ISSUE
                glowLayer.referenceMeshToUseItsOwnMaterial(this._explosionMesh);
                this._explosionMesh.material = assets.explosionMaterial.clone("explosionMaterialClone", true);
                if (this._explosionMesh.material) {
                    //this._explosionMesh.material.getBlockByName("noiseTex").texture = material.noiseTexture;
                    this._explosionMesh.material.getBlockByName("rand").value = Math.random();
                    this._explosionMesh.material.getBlockByName("timeout").value = EXPLOSION_TIMEOUT / 1000;
                    this._explosionMesh.material.getBlockByName("startTime").value = 0;
                }
            }
        }
        this.tickEnabled();
    }
    setTime(timeMs) {
        this._time = timeMs;
        const scale = 1.0 + timeMs * 0.04;
        const visibility = 1.0 - timeMs * 0.001;
        if (this._explosionMesh) {
            this._explosionMesh.material.getBlockByName("Time").value = timeMs / 1000;
        }
        this._sparkEffect.setTime(timeMs);
        this.tickEnabled();
    }
    addDeltaTime(deltaTimeMs) {
        this.setTime(this._time + deltaTimeMs);
    }
    tickEnabled() {
        if (this._explosionMesh) {
            this._explosionMesh.setEnabled(this._time < EXPLOSION_TIMEOUT);
        }
        this._sparkEffect.tickEnable();
    }
    setPositionOrientation(position, orientation) {
        var _a;
        if (this._explosionMesh) {
            (_a = this._explosionMesh.rotationQuaternion) === null || _a === void 0 ? void 0 : _a.copyFrom(orientation);
            this._explosionMesh.position.copyFrom(position);
        }
        this._sparkEffect.setPositionOrientation(position, orientation);
    }
    valid() {
        return this._time >= 0 && this._time <= EXPLOSION_TIMEOUT;
    }
    getTime() {
        return this._time;
    }
    getPosition() {
        if (this._explosionMesh) {
            return this._explosionMesh.position;
        }
        else {
            return core_1.Vector3.Zero();
        }
    }
    getOrientation() {
        if (this._explosionMesh) {
            return this._explosionMesh.rotationQuaternion ? this._explosionMesh.rotationQuaternion : core_1.Quaternion.Identity();
        }
        else {
            return core_1.Quaternion.Identity();
        }
    }
    dispose() {
        var _a;
        (_a = this._explosionMesh) === null || _a === void 0 ? void 0 : _a.dispose();
        this._sparkEffect.dispose();
    }
}
exports.Explosion = Explosion;
class ExplosionManager {
    constructor(scene, assets, glowLayer) {
        this._explosions = new Array();
        for (let i = 0; i < exports.MAX_EXPLOSIONS; i++) {
            this._explosions.push(new Explosion(scene, assets, glowLayer));
        }
    }
    getExplosions() {
        return this._explosions;
    }
    spawnExplosion(position, orientation) {
        for (let i = 0; i < this._explosions.length; i++) {
            const explosion = this._explosions[i];
            if (!explosion.valid()) {
                explosion.setPositionOrientation(position, orientation);
                explosion.setTime(0);
                return;
            }
        }
    }
    tick(deltaTime) {
        this._explosions.forEach((explosion) => {
            explosion.addDeltaTime(deltaTime);
            explosion.tickEnabled();
        });
    }
    dispose() {
        this._explosions.forEach((explosion) => {
            explosion.dispose();
        });
    }
}
exports.ExplosionManager = ExplosionManager;
//# sourceMappingURL=Explosion.js.map