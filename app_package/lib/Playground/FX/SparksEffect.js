"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparksEffects = exports.SparksEffect = void 0;
const core_1 = require("@babylonjs/core");
const SPARK_COUNT_SHOT = 10;
const MAX_SHOTS = 30;
class SparksEffect {
    constructor(scene, assets, sparkCount) {
        this._renderObserver = null;
        this._scene = scene;
        this._SPS = new core_1.SolidParticleSystem("SPS", scene);
        const plane = core_1.MeshBuilder.CreatePlane("", { size: 0.000001 });
        this._SPS.addShape(plane, sparkCount);
        plane.dispose();
        this._time = 9999;
        const mesh = this._SPS.buildMesh();
        mesh.visibility = 0.99;
        mesh.rotationQuaternion = new core_1.Quaternion(0, 0, 0, 1);
        // initiate particles function
        this._SPS.initParticles = () => {
            for (let p = 0; p < this._SPS.nbParticles; p++) {
                const particle = this._SPS.particles[p];
                const nga = core_1.Scalar.RandomRange(-Math.PI, Math.PI);
                const ngb = core_1.Scalar.RandomRange(0, Math.PI);
                const strength = core_1.Scalar.RandomRange(0.05, 0.2) * 10;
                particle.position.x = 0;
                particle.position.y = 0;
                particle.position.z = 0;
                particle.velocity.x = Math.cos(nga) * Math.cos(ngb) * strength;
                particle.velocity.y = Math.sin(ngb) * strength;
                particle.velocity.z = Math.sin(nga) * Math.cos(ngb) * strength;
                particle.color = new core_1.Color4(0, 0, 0, 0);
                const pp = particle;
                pp.ttl = core_1.Scalar.RandomRange(300, 1000);
            }
        };
        //Update SPS mesh
        this._SPS.initParticles();
        this._SPS.setParticles();
        this._SPS.updateParticle = (particle) => {
            if (particle.ttl - this._time > 0) {
                const velocityFactor = Math.pow(0.99, this._time * 0.001);
                (particle.position).copyFrom(particle.velocity.scale(this._time * 0.01)); // update particle new position
                particle.color.r = particle.velocity.x * 0.03; // * velocityFactor;
                particle.color.g = particle.velocity.y * 0.03; // * velocityFactor;
                particle.color.b = particle.velocity.z * 0.03; // * velocityFactor;
                particle.color.a = Math.max((particle.ttl - this._time) / particle.ttl, 0.);
            }
            return particle;
        };
        if (assets.sparksEffect) {
            mesh.material = assets.sparksEffect.clone("sparkles", true);
            mesh.material.backFaceCulling = false;
            mesh.material.alphaMode = core_1.Engine.ALPHA_ADD;
            var _this = this;
            this._renderObserver = scene.onBeforeRenderObservable.add(function () {
                if (_this.valid()) {
                    _this._SPS.setParticles();
                }
            });
        }
    }
    valid() {
        return this._time >= 0 && this._time < 1000;
    }
    setPositionOrientation(position, orientation) {
        var _a;
        this._SPS.mesh.position.copyFrom(position);
        (_a = this._SPS.mesh.rotationQuaternion) === null || _a === void 0 ? void 0 : _a.copyFrom(orientation);
    }
    setTime(timeMs) {
        this._time = timeMs;
    }
    addDeltaTime(deltaTimeMs) {
        this._time += deltaTimeMs;
    }
    tickEnable() {
        this._SPS.mesh.setEnabled(this._time < 1000);
    }
    getTime() {
        return this._time;
    }
    getPosition() {
        return this._SPS.mesh.position;
    }
    getOrientation() {
        return this._SPS.mesh.rotationQuaternion ? this._SPS.mesh.rotationQuaternion : core_1.Quaternion.Identity();
    }
    dispose() {
        this._scene.onBeforeRenderObservable.remove(this._renderObserver);
        this._SPS.dispose();
    }
}
exports.SparksEffect = SparksEffect;
class SparksEffects {
    constructor(scene, assets) {
        this._shots = new Array();
        for (let i = 0; i < MAX_SHOTS; i++) {
            this._shots.push(new SparksEffect(scene, assets, SPARK_COUNT_SHOT));
        }
    }
    tick(deltaTime) {
        this._shots.forEach((effect) => {
            effect.addDeltaTime(deltaTime);
            effect.tickEnable();
        });
    }
    getSparksEffects() {
        return this._shots;
    }
    addShot(position, orientation) {
        for (let i = 0; i < this._shots.length; i++) {
            const shot = this._shots[i];
            if (!shot.valid()) {
                shot.setPositionOrientation(position, orientation);
                shot.setTime(0);
                return;
            }
        }
    }
    dispose() {
        this._shots.forEach((value) => {
            value.dispose();
        });
    }
}
exports.SparksEffects = SparksEffects;
//# sourceMappingURL=SparksEffect.js.map