"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailManager = exports.Trail = exports.TRAIL_LENGTH = exports.MAX_TRAILS = void 0;
const core_1 = require("@babylonjs/core");
exports.MAX_TRAILS = 60;
exports.TRAIL_LENGTH = 256;
class Trail {
    constructor(scene, trailMaterial, trailIndex, maxTrails, data, texture) {
        this._color = new core_1.Color3(0, 0, 0);
        this._visible = false;
        this._side = 0;
        this._data = data;
        this._mesh = core_1.MeshBuilder.CreateGround("trail", { width: 0.1, height: 0.010, subdivisionsY: 64 }, scene);
        this._mesh.setBoundingInfo(new core_1.BoundingInfo(new core_1.Vector3(-1000, -1000, -1000), new core_1.Vector3(1000, 1000, 1000)));
        this._trailMaterial = trailMaterial.clone("trailMaterial", true);
        this._trailMaterial.backFaceCulling = false;
        this._mesh.material = this._trailMaterial;
        this._trackSampler0Block = this._trailMaterial.getBlockByPredicate((b) => b.name === "tailSampler0");
        this._trackSampler1Block = this._trailMaterial.getBlockByPredicate((b) => b.name === "tailSampler1");
        this._globalAlphaBlock = this._trailMaterial.getBlockByPredicate((b) => b.name === "GlobalAlpha");
        this._colorBlock = this._trailMaterial.getInputBlockByPredicate((b) => b.name === "color");
        let trailV = this._trailMaterial.getBlockByPredicate((b) => b.name === "TrailV");
        this._trailU = this._trailMaterial.getBlockByPredicate((b) => b.name === "TrailU");
        trailV.value = (trailIndex + 0.5) / maxTrails;
        this._trailIndex = trailIndex;
        if (this._trackSampler0Block && this._trackSampler1Block) {
            this._trackSampler0Block.texture = texture;
            this._trackSampler1Block.texture = texture;
        }
        this._valid = false;
        this._alpha = 0;
        this._currentIndex = 0;
    }
    getColor() {
        return this._color;
    }
    getSide() {
        return this._side;
    }
    getAlpha() {
        return this._alpha;
    }
    spawn(position, side) {
        const offset = exports.TRAIL_LENGTH * 4 * this._trailIndex;
        for (let i = 0; i < exports.TRAIL_LENGTH; i++) {
            const localIndex = offset + i * 4;
            this._data[localIndex + 0] = position.x;
            this._data[localIndex + 1] = position.y;
            this._data[localIndex + 2] = position.z + (i - exports.TRAIL_LENGTH) * 0.00001;
            this._data[localIndex + 3] = 0;
        }
        this.update();
        this._valid = true;
        this._alpha = 1;
        this._side = side;
    }
    _appendPosition(position) {
        const offset = exports.TRAIL_LENGTH * 4 * this._trailIndex;
        const localIndex = offset + this._currentIndex * 4;
        this._data[localIndex + 0] = position.x;
        this._data[localIndex + 1] = position.y;
        this._data[localIndex + 2] = position.z;
    }
    _getPositionToRef(position) {
        const offset = exports.TRAIL_LENGTH * 4 * this._trailIndex;
        const localIndex = offset + this._currentIndex * 4;
        position.set(this._data[localIndex + 0], this._data[localIndex + 1], this._data[localIndex + 2]);
    }
    append(position) {
        this._appendPosition(position);
        this.update();
    }
    setCurrentIndex(currentIndex) {
        this._currentIndex = currentIndex;
    }
    update() {
        if (this._globalAlphaBlock) {
            this._globalAlphaBlock.value = this._alpha;
        }
        if (this._trailU) {
            this._trailU.value = (((this._currentIndex + 1) % exports.TRAIL_LENGTH) + 2.5) / exports.TRAIL_LENGTH;
        }
    }
    setParameters(color, alpha) {
        this._colorBlock.value = color;
        this._color = color;
        this._alpha = alpha;
    }
    setVisible(visible) {
        this._visible = visible;
        this.tickEnabled();
    }
    invalidate() {
        this._valid = false;
    }
    isValid() {
        return this._valid || this._alpha > 0.001;
    }
    tickEnabled() {
        this._mesh.setEnabled(this.isValid() && this._visible);
    }
    tick(deltaTime, currentIndex) {
        this._getPositionToRef(Trail._tempVec3);
        this._currentIndex = currentIndex;
        this._appendPosition(Trail._tempVec3);
        if (!this._valid) {
            this._alpha = Math.max(this._alpha - deltaTime * 0.0003, 0);
            this._globalAlphaBlock.value = this._alpha;
            this.update();
        }
        this.tickEnabled();
    }
    dispose() {
        this._mesh.dispose();
    }
}
exports.Trail = Trail;
Trail._tempVec3 = new core_1.Vector3();
class TrailManager {
    constructor(scene, trailMaterial, maxTrails) {
        this._trails = new Array();
        this._currentIndex = exports.TRAIL_LENGTH - 1;
        this._data = new Float32Array(maxTrails * exports.TRAIL_LENGTH * 4);
        this._texture = core_1.RawTexture.CreateRGBATexture(this._data, exports.TRAIL_LENGTH, maxTrails, scene, false, false, core_1.Texture.NEAREST_NEAREST, core_1.Engine.TEXTURETYPE_FLOAT);
        this._texture.wrapU = core_1.Texture.WRAP_ADDRESSMODE;
        this._texture.wrapV = core_1.Texture.WRAP_ADDRESSMODE;
        for (let i = 0; i < maxTrails; i++) {
            this._trails.push(new Trail(scene, trailMaterial, i, maxTrails, this._data, this._texture));
        }
    }
    tick(deltaTime) {
        this._trails.forEach((trail) => {
            trail.tick(deltaTime, this._currentIndex);
        });
        this._currentIndex++;
        this._currentIndex %= exports.TRAIL_LENGTH;
        this.update();
    }
    spawnTrail(position, side) {
        for (let i = 0; i < this._trails.length; i++) {
            if (!this._trails[i].isValid()) {
                this._trails[i].spawn(position, side);
                return this._trails[i];
            }
        }
        return null;
    }
    getCurrentIndex() {
        return this._currentIndex;
    }
    setCurrentIndex(currentIndex) {
        this._currentIndex = currentIndex;
        this._trails.forEach((trail) => {
            trail.setCurrentIndex(currentIndex);
        });
    }
    getData() {
        return this._data;
    }
    update() {
        this._texture.update(this._data);
    }
    getTrails() {
        return this._trails;
    }
    dispose() {
        this._trails.forEach((trail) => {
            trail.dispose();
        });
        this._texture.dispose();
    }
}
exports.TrailManager = TrailManager;
//# sourceMappingURL=Trail.js.map