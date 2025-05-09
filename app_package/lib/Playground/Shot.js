"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShotManager = exports.Shot = exports.MAX_SHOTS = void 0;
const core_1 = require("@babylonjs/core");
/// <reference lib="dom" />
exports.MAX_SHOTS = 200;
class Shot {
    constructor() {
        this.ttl = 0;
    }
}
exports.Shot = Shot;
class ShotManager {
    constructor(assets, scene, glowLayer) {
        var _a;
        this.shots = Array();
        this._matricesData = new Float32Array(16 * exports.MAX_SHOTS);
        this._shotMesh = null;
        this._tmpVec3 = new core_1.Vector3();
        if (!assets.projectile) {
            return;
        }
        var arrayPos = assets.projectile.getVerticesData(core_1.VertexBuffer.PositionKind);
        var arrayIndex = assets.projectile.getIndices();
        var shotMesh = new core_1.Mesh("custom", scene);
        var vertexData = new core_1.VertexData();
        vertexData.positions = arrayPos;
        vertexData.indices = arrayIndex;
        vertexData.applyToMesh(shotMesh);
        var m = core_1.Matrix.Zero();
        var index = 0;
        for (var shot = 0; shot < exports.MAX_SHOTS; shot++) {
            this.shots.push({ ttl: -1 });
            m.copyToArray(this._matricesData, index * 16);
            index++;
        }
        shotMesh.thinInstanceSetBuffer("matrix", this._matricesData, 16, false);
        //GLOW LAYER ISSUE
        glowLayer.referenceMeshToUseItsOwnMaterial(shotMesh);
        var mat = (_a = assets.projectileShader) === null || _a === void 0 ? void 0 : _a.clone("projectiles");
        if (mat) {
            shotMesh.material = mat;
            mat.alphaMode = core_1.Engine.ALPHA_ADD;
        }
        this._shotMesh = shotMesh;
    }
    getMatrixData() {
        return this._matricesData;
    }
    getMatrices() {
        return this._matricesData;
    }
    addShot(ship, worldMatrix, isHuman, cannonIndex) {
        const startIndex = ship.faction ? (exports.MAX_SHOTS / 2) : 0;
        for (var index = startIndex; index < (startIndex + exports.MAX_SHOTS / 2); index++) {
            if (this.shots[index].ttl <= 0) {
                const flIndex = index * 16;
                const clIndex = index * 4;
                if (ship.cannonR && ship.cannonL) {
                    const cannonLocalOffset = (cannonIndex ? ship.cannonR : ship.cannonL).clone();
                    cannonLocalOffset.z += 0.2;
                    const offsetCannon = core_1.Vector3.TransformNormal(cannonLocalOffset.scale(25), worldMatrix);
                    worldMatrix.copyToArray(this._matricesData, index * 16);
                    this._matricesData[flIndex + 12] += offsetCannon.x;
                    this._matricesData[flIndex + 13] += offsetCannon.y;
                    this._matricesData[flIndex + 14] += offsetCannon.z;
                    this.shots[index].ttl = 5000;
                    this.shots[index].firedBy = ship;
                }
                return;
            }
        }
    }
    tick(deltaTime, world) {
        const shootSpeed = 0.5;
        for (var index = 0; index < exports.MAX_SHOTS; index++) {
            const flIndex = index * 16;
            if (this.shots[index].ttl > 0) {
                this._matricesData[flIndex + 12] += this._matricesData[flIndex + 8] * shootSpeed * deltaTime;
                this._matricesData[flIndex + 13] += this._matricesData[flIndex + 9] * shootSpeed * deltaTime;
                this._matricesData[flIndex + 14] += this._matricesData[flIndex + 10] * shootSpeed * deltaTime;
                this.shots[index].ttl -= deltaTime;
                this._tmpVec3.set(this._matricesData[flIndex + 12], this._matricesData[flIndex + 13], this._matricesData[flIndex + 14]);
                if (world.collideWithAsteroids(this._tmpVec3, 6)) {
                    this.shots[index].ttl = -1;
                }
            }
            else {
                for (let i = 0; i < 16; i++) {
                    this._matricesData[flIndex + i] = 0;
                }
            }
        }
        this.matricesToInstances();
    }
    matricesToInstances() {
        if (this._shotMesh) {
            this._shotMesh.thinInstanceBufferUpdated("matrix");
        }
    }
    dispose() {
        if (this._shotMesh) {
            this._shotMesh.dispose();
        }
    }
}
exports.ShotManager = ShotManager;
//# sourceMappingURL=Shot.js.map