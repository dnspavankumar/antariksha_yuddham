"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissileManager = exports.Missile = exports.MISSILE_MAX_LIFE = exports.MAX_MISSILES = void 0;
const core_1 = require("@babylonjs/core");
const Agent_1 = require("./Agent");
exports.MAX_MISSILES = 10;
exports.MISSILE_MAX_LIFE = 10000; // in milliseconds
class Missile extends Agent_1.Agent {
    constructor(scene) {
        super();
        this._trail = null;
        this.shipToChase = null;
        this.time = 99999;
        this.firedBy = null;
    }
    launch(shipToChase, firedBy, worldPosition, worldOrientation, missileTransform, trailManager) {
        var _a, _b;
        this.transformNode = missileTransform;
        this.input.dx = 0;
        this.input.dy = 0;
        this.shipToChase = shipToChase;
        this.firedBy = firedBy;
        this.time = 0;
        this.setPositionOrientation(worldPosition, worldOrientation);
        this._trail = trailManager.spawnTrail(worldPosition, 3);
        (_a = this._trail) === null || _a === void 0 ? void 0 : _a.setParameters(core_1.Color3.White(), 1);
        (_b = this._trail) === null || _b === void 0 ? void 0 : _b.setVisible(true);
    }
    dispose() {
        var _a;
        (_a = this.transformNode) === null || _a === void 0 ? void 0 : _a.dispose();
        //this._trail.dispose();
    }
    // return true if still valid
    tick(rx, ry, deltaTimeMs) {
        var _a;
        if (this.setTime(this.time + deltaTimeMs)) {
            this.quat = this.quat.multiply(rx).multiply(ry);
            this.quat.normalize();
            if (this.transformNode) {
                if (this.transformNode.rotationQuaternion) {
                    this.transformNode.rotationQuaternion = core_1.Quaternion.Slerp(this.transformNode.rotationQuaternion, this.quat, 1.);
                }
                this.transformNode.position.addInPlace(this.forward.scale(0.15 * deltaTimeMs));
                if (deltaTimeMs > 0.001) {
                    (_a = this._trail) === null || _a === void 0 ? void 0 : _a.append(this.transformNode.position);
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    getWorldMatrix() {
        if (this.transformNode) {
            return this.transformNode.getWorldMatrix();
        }
        else {
            return core_1.Matrix.Identity();
        }
    }
    getPosition() {
        if (this.transformNode) {
            return this.transformNode.position;
        }
        else {
            return core_1.Vector3.Zero();
        }
    }
    getOrientation() {
        if (this.transformNode && this.transformNode.rotationQuaternion) {
            return this.transformNode.rotationQuaternion;
        }
        else {
            return core_1.Quaternion.Identity();
        }
    }
    // return true if still valid
    setTime(timeMs) {
        var _a, _b, _c;
        this.time = timeMs;
        if (timeMs > exports.MISSILE_MAX_LIFE) {
            (_a = this.transformNode) === null || _a === void 0 ? void 0 : _a.setEnabled(false);
            (_b = this._trail) === null || _b === void 0 ? void 0 : _b.invalidate();
            return false;
        }
        (_c = this.transformNode) === null || _c === void 0 ? void 0 : _c.setEnabled(true);
        return true;
    }
    tickEnabled() {
        var _a, _b;
        (_a = this.transformNode) === null || _a === void 0 ? void 0 : _a.setEnabled(this.time < exports.MISSILE_MAX_LIFE);
        (_b = this._trail) === null || _b === void 0 ? void 0 : _b.tickEnabled();
    }
    getTime() {
        return this.time;
    }
    isValid() {
        return this.time >= 0 && this.time <= exports.MISSILE_MAX_LIFE;
    }
    setPositionOrientation(position, orientation) {
        var _a;
        if (this.transformNode) {
            this.transformNode.position.copyFrom(position);
            (_a = this.transformNode.rotationQuaternion) === null || _a === void 0 ? void 0 : _a.copyFrom(orientation);
            this.quat.copyFrom(orientation);
            this.position.copyFrom(position);
        }
    }
}
exports.Missile = Missile;
class MissileManager {
    constructor(scene, trailManager) {
        this.missiles = Array();
        this._tmpMatrix = new core_1.Matrix();
        this._trailManager = trailManager;
        for (let i = 0; i < exports.MAX_MISSILES; i++) {
            this.missiles.push(new Missile(scene));
        }
    }
    getMissiles() {
        return this.missiles;
    }
    fireMissile(position, quaternion, shipToChase, firedBy, missileTransform) {
        for (let i = 0; i < exports.MAX_MISSILES; i++) {
            if (!this.missiles[i].isValid()) {
                this.missiles[i].launch(shipToChase, firedBy, position, quaternion, missileTransform, this._trailManager);
                return this.missiles[i];
            }
        }
        return null;
    }
    tick(deltaTime, explosionManager, world) {
        for (let i = 0; i < this.missiles.length; i++) {
            const missile = this.missiles[i];
            missile.tickEnabled();
            if (!missile.isValid()) {
                continue;
            }
            var wmat = missile.getWorldMatrix();
            if (!wmat || !missile.transformNode || !missile.isValid()) {
                continue;
            }
            const forward = new core_1.Vector3(wmat.m[8], wmat.m[9], wmat.m[10]);
            const right = new core_1.Vector3(wmat.m[0], wmat.m[1], wmat.m[2]);
            const up = new core_1.Vector3(wmat.m[4], wmat.m[5], wmat.m[6]);
            missile.forward = forward;
            missile.up = up;
            missile.right = right;
            let keepMissile = missile.shipToChase && missile.shipToChase.isValid();
            if (world.collideWithAsteroids(missile.transformNode.position, 0.5)) {
                keepMissile = false;
                missile.setTime(exports.MISSILE_MAX_LIFE + 1);
            }
            if (keepMissile && missile.shipToChase) {
                const aimPos = missile.shipToChase.root.position;
                const turnRatio = Math.min(missile.time / 100000, 0.05);
                const dotTgt = missile.goToward(aimPos, missile.transformNode.position, turnRatio);
                const rx = core_1.Quaternion.RotationAxis(new core_1.Vector3(0, 1, 0), missile.input.dx);
                rx.toRotationMatrix(this._tmpMatrix);
                const ry = core_1.Quaternion.RotationAxis(new core_1.Vector3(this._tmpMatrix.m[0], this._tmpMatrix.m[1], this._tmpMatrix.m[2]), missile.input.dy);
                keepMissile = missile.tick(rx, ry, deltaTime);
            }
            if (!keepMissile) {
                explosionManager.spawnExplosion(missile.getPosition(), missile.getOrientation());
            }
        }
    }
    invalidateMissileChasing(shipToChase) {
        for (let i = 0; i < this.missiles.length; i++) {
            const missile = this.missiles[i];
            if (missile.isValid() && missile.shipToChase == shipToChase) {
                missile.setTime(exports.MISSILE_MAX_LIFE + 1);
                return;
            }
        }
    }
    dispose() {
        this.missiles.forEach(missile => {
            missile.dispose();
        });
    }
}
exports.MissileManager = MissileManager;
//# sourceMappingURL=Missile.js.map