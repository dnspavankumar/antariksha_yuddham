"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const core_1 = require("@babylonjs/core");
const Shot_1 = require("../Shot");
const Trail_1 = require("../FX/Trail");
class PositionOrientationFrame {
    constructor() {
        this.position = new core_1.Vector3();
        this.orientation = new core_1.Quaternion();
        this.enabled = false;
    }
}
class TimedEffect {
    constructor() {
        this.position = new core_1.Vector3();
        this.orientation = new core_1.Quaternion();
        this.time = 0;
    }
}
class Shots {
    constructor() {
        this.shots = Array();
        this.matricesData = new Float32Array(16 * Shot_1.MAX_SHOTS);
    }
}
class TrailData {
    constructor() {
        this.color = new core_1.Color3();
        this.alpha = 1;
        this.side = 3;
    }
}
class RecordFrame {
    // [X] ships
    // [X] shots
    // [X] explosion
    // [X] particles
    // [ ] missiles
    // [ ] trails
    storeFrame(shipManager, explosionManager, sparksEffects, shotManager, missileManager, trailManager) {
        var _a;
        for (let i = 0; i < shipManager.ships.length; i++) {
            const ship = shipManager.ships[i];
            this.ships[i].position.copyFrom(ship.root.position);
            this.ships[i].orientation.copyFrom(ship.root.rotationQuaternion ? ship.root.rotationQuaternion : core_1.Quaternion.Identity());
            this.ships[i].enabled = !!((_a = ship.shipMesh) === null || _a === void 0 ? void 0 : _a.isEnabled());
        }
        const explosionArray = explosionManager.getExplosions();
        for (let i = 0; i < explosionArray.length; i++) {
            const exp = explosionArray[i];
            this.explosions[i].position.copyFrom(exp.getPosition());
            this.explosions[i].orientation.copyFrom(exp.getOrientation());
            this.explosions[i].time = exp.getTime();
        }
        const sparksArray = sparksEffects.getSparksEffects();
        for (let i = 0; i < sparksArray.length; i++) {
            const spa = sparksArray[i];
            this.sparks[i].position.copyFrom(spa.getPosition());
            this.sparks[i].orientation.copyFrom(spa.getOrientation());
            this.sparks[i].time = spa.getTime();
        }
        const missileArray = missileManager.getMissiles();
        for (let i = 0; i < missileArray.length; i++) {
            const mis = missileArray[i];
            this.missiles[i].position.copyFrom(mis.getPosition());
            this.missiles[i].orientation.copyFrom(mis.getOrientation());
            this.missiles[i].time = mis.getTime();
        }
        const trailArray = trailManager.getTrails();
        this.trailData = new Float32Array(Trail_1.TRAIL_LENGTH * 4 * trailArray.length);
        this.trailData.set(trailManager.getData());
        this.trailCurrentIndex = trailManager.getCurrentIndex();
        for (let i = 0; i < trailArray.length; i++) {
            const trail = trailArray[i];
            this.trails[i].color.copyFrom(trail.getColor());
            this.trails[i].alpha = trail.getAlpha();
            this.trails[i].side = trail.getSide();
        }
        this.shots.matricesData.set(shotManager.getMatrixData());
        this.shots.shots = shotManager.shots.slice(0);
    }
    restoreFrame(shipManager, explosionManager, sparksEffects, shotManager, missileManager, trailManager, trailVisibilityMask) {
        var _a;
        for (let i = 0; i < shipManager.ships.length; i++) {
            const ship = shipManager.ships[i];
            ship.root.position.copyFrom(this.ships[i].position);
            if (ship.root.rotationQuaternion) {
                ship.root.rotationQuaternion.copyFrom(this.ships[i].orientation);
            }
            (_a = ship.shipMesh) === null || _a === void 0 ? void 0 : _a.setEnabled(this.ships[i].enabled);
            if (ship.lastDecal) {
                ship.lastDecal.dispose();
                ship.lastDecal = null;
            }
        }
        const explosionArray = explosionManager.getExplosions();
        for (let i = 0; i < explosionArray.length; i++) {
            const exp = explosionArray[i];
            exp.setPositionOrientation(this.explosions[i].position, this.explosions[i].orientation);
            exp.setTime(this.explosions[i].time);
        }
        const sparksArray = sparksEffects.getSparksEffects();
        for (let i = 0; i < sparksArray.length; i++) {
            const spa = sparksArray[i];
            spa.setPositionOrientation(this.sparks[i].position, this.sparks[i].orientation);
            spa.setTime(this.sparks[i].time);
        }
        const missileArray = missileManager.getMissiles();
        for (let i = 0; i < missileArray.length; i++) {
            const mis = missileArray[i];
            mis.setPositionOrientation(this.missiles[i].position, this.missiles[i].orientation);
            mis.setTime(this.missiles[i].time);
        }
        const trailArray = trailManager.getTrails();
        if (this.trailData) {
            trailManager.getData().set(this.trailData);
        }
        trailManager.setCurrentIndex(this.trailCurrentIndex);
        for (let i = 0; i < trailArray.length; i++) {
            const trail = trailArray[i];
            trail.setParameters(this.trails[i].color, this.trails[i].alpha);
            trail.setVisible((this.trails[i].side & trailVisibilityMask) ? true : false);
            trail.update();
        }
        trailManager.update();
        shotManager.getMatrixData().set(this.shots.matricesData);
        shotManager.shots = this.shots.shots.slice(0);
        shotManager.matricesToInstances();
    }
    restoreFrameBlend(shipManager, explosionManager, sparksEffects, shotManager, missileManager, trailManager, nextFrame, trailVisibilityMask, t) {
        var _a;
        for (let i = 0; i < shipManager.ships.length; i++) {
            const ship = shipManager.ships[i];
            core_1.Vector3.LerpToRef(this.ships[i].position, nextFrame.ships[i].position, t, ship.root.position);
            if (ship.root.rotationQuaternion) {
                core_1.Quaternion.SlerpToRef(this.ships[i].orientation, nextFrame.ships[i].orientation, t, ship.root.rotationQuaternion);
            }
            (_a = ship.shipMesh) === null || _a === void 0 ? void 0 : _a.setEnabled(this.ships[i].enabled);
            if (ship.lastDecal) {
                ship.lastDecal.dispose();
                ship.lastDecal = null;
            }
        }
        const explosionArray = explosionManager.getExplosions();
        for (let i = 0; i < explosionArray.length; i++) {
            const exp = explosionArray[i];
            core_1.Vector3.LerpToRef(this.explosions[i].position, nextFrame.explosions[i].position, t, RecordFrame._tmpVec3);
            core_1.Quaternion.SlerpToRef(this.explosions[i].orientation, nextFrame.explosions[i].orientation, t, RecordFrame._tmpQuaternion);
            exp.setPositionOrientation(RecordFrame._tmpVec3, RecordFrame._tmpQuaternion);
            exp.setTime(this.explosions[i].time + (nextFrame.explosions[i].time - this.explosions[i].time) * t);
        }
        const sparksArray = sparksEffects.getSparksEffects();
        for (let i = 0; i < sparksArray.length; i++) {
            const spa = sparksArray[i];
            core_1.Vector3.LerpToRef(this.sparks[i].position, nextFrame.sparks[i].position, t, RecordFrame._tmpVec3);
            core_1.Quaternion.SlerpToRef(this.sparks[i].orientation, nextFrame.sparks[i].orientation, t, RecordFrame._tmpQuaternion);
            spa.setPositionOrientation(RecordFrame._tmpVec3, RecordFrame._tmpQuaternion);
            spa.setTime(this.sparks[i].time + (nextFrame.sparks[i].time - this.sparks[i].time) * t);
        }
        const missileArray = missileManager.getMissiles();
        for (let i = 0; i < missileArray.length; i++) {
            const mis = missileArray[i];
            core_1.Vector3.LerpToRef(this.missiles[i].position, nextFrame.missiles[i].position, t, RecordFrame._tmpVec3);
            core_1.Quaternion.SlerpToRef(this.missiles[i].orientation, nextFrame.missiles[i].orientation, t, RecordFrame._tmpQuaternion);
            mis.setPositionOrientation(RecordFrame._tmpVec3, RecordFrame._tmpQuaternion);
            mis.setTime(this.missiles[i].time + (nextFrame.missiles[i].time - this.missiles[i].time) * t);
        }
        const trailArray = trailManager.getTrails();
        if (this.trailData) {
            trailManager.getData().set(this.trailData);
        }
        trailManager.setCurrentIndex(this.trailCurrentIndex);
        for (let i = 0; i < trailArray.length; i++) {
            const trail = trailArray[i];
            trail.setParameters(this.trails[i].color, this.trails[i].alpha);
            trail.setVisible((this.trails[i].side & trailVisibilityMask) ? true : false);
            trail.update();
        }
        trailManager.update();
        const dest = shotManager.getMatrixData();
        const A = this.shots.matricesData;
        const B = nextFrame.shots.matricesData;
        for (let i = 0; i < 16 * Shot_1.MAX_SHOTS; i++) {
            dest[i] = A[i] + (B[i] - A[i]) * t;
        }
        shotManager.shots = this.shots.shots.slice(0);
        shotManager.matricesToInstances();
    }
    constructor(shipManager, explosionManager, sparksEffects, shotManager, missileManager, trailManager) {
        this.ships = new Array();
        this.explosions = new Array();
        this.sparks = new Array();
        this.missiles = new Array();
        this.shots = new Shots();
        this.trails = new Array();
        this.trailData = null;
        this.trailCurrentIndex = 0;
        for (let i = 0; i < shipManager.ships.length; i++) {
            this.ships.push(new PositionOrientationFrame());
        }
        for (let i = 0; i < explosionManager.getExplosions().length; i++) {
            this.explosions.push(new TimedEffect());
        }
        for (let i = 0; i < sparksEffects.getSparksEffects().length; i++) {
            this.sparks.push(new TimedEffect());
        }
        for (let i = 0; i < missileManager.getMissiles().length; i++) {
            this.missiles.push(new TimedEffect());
        }
        for (let i = 0; i < trailManager.getTrails().length; i++) {
            this.trails.push(new TrailData());
        }
        this.storeFrame(shipManager, explosionManager, sparksEffects, shotManager, missileManager, trailManager);
    }
}
RecordFrame._tmpQuaternion = new core_1.Quaternion();
RecordFrame._tmpVec3 = new core_1.Vector3();
class Recorder {
    constructor(shipManager, explosionManager, sparksEffects, shotManager, missileManager, trailManager, maxFrames) {
        this._recordActive = false;
        this._availableFrames = 0;
        this._head = 0;
        this._recordFrames = new Array();
        this._playbackFrame = 0;
        this._playbackSpeed = 0;
        this._playingBack = false;
        this._trailVisibilityMask = 3;
        this._lastFrame = -1;
        this._shipManager = shipManager;
        this._maxFrames = maxFrames;
        this._explosionManager = explosionManager;
        this._sparksEffects = sparksEffects;
        this._shotManager = shotManager;
        this._missileManager = missileManager;
        this._trailManager = trailManager;
        this._whenDone = () => { };
    }
    setRecordActive(recordActive) {
        this._recordActive = recordActive;
    }
    getAvailableFrames() {
        return this._availableFrames;
    }
    tick() {
        if (!this._recordActive) {
            if (this._playingBack) {
                this._playbackFrame += this._playbackSpeed;
                if (this._playbackFrame >= this._availableFrames) {
                    this._playingBack = false;
                    this._whenDone();
                }
                else {
                    const effective = this._getEffectiveIndex(Math.floor(this._playbackFrame));
                    if (this._playbackSpeed === 1) {
                        this._recordFrames[effective].restoreFrame(this._shipManager, this._explosionManager, this._sparksEffects, this._shotManager, this._missileManager, this._trailManager, this._trailVisibilityMask);
                    }
                    else {
                        const effectiveN = this._getEffectiveIndex(Math.floor(this._playbackFrame) + 1);
                        const t = this._playbackFrame - Math.floor(this._playbackFrame);
                        this._recordFrames[effective].restoreFrameBlend(this._shipManager, this._explosionManager, this._sparksEffects, this._shotManager, this._missileManager, this._trailManager, this._recordFrames[effectiveN], this._trailVisibilityMask, t);
                    }
                }
            }
            return;
        }
        if (this._recordFrames.length < this._maxFrames) {
            this._recordFrames.push(new RecordFrame(this._shipManager, this._explosionManager, this._sparksEffects, this._shotManager, this._missileManager, this._trailManager));
        }
        else {
            const frameIndex = this._head % this._maxFrames;
            this._recordFrames[frameIndex].storeFrame(this._shipManager, this._explosionManager, this._sparksEffects, this._shotManager, this._missileManager, this._trailManager);
        }
        this._increaseStore();
    }
    applyFrame(frameIndex) {
        if (this._recordActive) {
            // issue here
            return;
        }
        this._lastFrame = frameIndex;
        const effective = this._getEffectiveIndex(frameIndex);
        this._recordFrames[effective].restoreFrame(this._shipManager, this._explosionManager, this._sparksEffects, this._shotManager, this._missileManager, this._trailManager, this._trailVisibilityMask);
    }
    refreshFrame() {
        if (this._lastFrame >= 0) {
            this.applyFrame(this._lastFrame);
        }
    }
    playback(speed, whenDone) {
        this._playbackFrame = 0;
        this._playbackSpeed = speed;
        this._playingBack = true;
        this._whenDone = whenDone;
    }
    stop() {
        this._playingBack = false;
    }
    dispose() {
    }
    _getEffectiveIndex(frameIndex) {
        const tail = Math.max(this._head - this._maxFrames, 0) % this._maxFrames;
        const effective = (tail + frameIndex) % this._availableFrames;
        return effective;
    }
    _increaseStore() {
        this._head++;
        this._availableFrames = Math.min(this._head, this._maxFrames);
    }
}
exports.Recorder = Recorder;
//# sourceMappingURL=Recorder.js.map