"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipCamera = void 0;
const core_1 = require("@babylonjs/core");
class ShipCamera {
    getFreeCamera() {
        return this._camera;
    }
    isOnScreen(position) {
        var spo0 = core_1.Vector4.TransformCoordinates(position, this._camera.getViewMatrix());
        var spo1 = core_1.Vector4.TransformCoordinates(new core_1.Vector3(spo0.x, spo0.y, spo0.z), this._camera.getProjectionMatrix());
        spo1.x /= spo1.w;
        spo1.y /= spo1.w;
        return Math.abs(spo1.x) < 0.5 && Math.abs(spo1.y) < 0.5 && spo1.z > 0;
    }
    _initBurst(scene) {
        while (this.StarPositions.length < this.StarCount) {
            this.StarPositions.push(new core_1.Vector3((Math.random() * 2 - 1) * this.StarSpread * 2, (Math.random() * 2 - 1) * this.StarSpread, (Math.random() * 2 - 1) * this.StarSpread * 10));
        }
        var Star = core_1.MeshBuilder.CreateCylinder("Star", { height: 30, diameterBottom: 0.05, diameterTop: 0.01, tessellation: 16 }, scene);
        Star.position = new core_1.Vector3(100, 100, 100);
        Star.rotation = new core_1.Vector3(Math.PI / 2, 0., 0.0);
        var StarMaterial = new core_1.StandardMaterial("StarMaterial", scene);
        StarMaterial.diffuseColor = core_1.Color3.White();
        StarMaterial.emissiveColor = new core_1.Color3(0.5, 0.9, 1);
        StarMaterial.alpha = 0.25;
        Star.material = StarMaterial;
        for (var i = 0; i < this.StarCount; i++) {
            this.Stars.push(Star.createInstance("star" + i));
            this.Stars[i].position = this.StarPositions[i];
            var s = Math.random();
            this.Stars[i].scaling = new core_1.Vector3(s, s, s);
            this.Stars[i].parent = this._camera;
        }
    }
    _tickBurst(bursting, gameSpeed) {
        const burstStrength = Math.max(bursting - 0.5, 0) * gameSpeed;
        this.Stars.forEach((star) => {
            star.position.z -= 1 / 60 * 200 * burstStrength;
            if (star.position.z < -50)
                star.position.z += 100;
            star.scaling.y = burstStrength + 0.001;
        });
    }
    constructor(ship, scene) {
        this._shakeDelay = 0;
        this._shakeVector = new core_1.Vector3(0, 0, 0);
        // burst effect
        this.StarCount = 250;
        this.StarSpread = 10.0;
        this.StarPositions = Array();
        this.Stars = Array();
        this._ship = ship;
        this._camera = new core_1.FreeCamera("camera1", new core_1.Vector3(0, 5, -10), scene);
        scene.activeCamera = this._camera;
        // burst
        this._initBurst(scene);
        scene.audioListenerPositionProvider = () => {
            if (this._ship && this._ship.transformNode) {
                return this._ship.transformNode.absolutePosition;
            }
            return this._camera.position;
        };
    }
    Tick(ship, shipWorldMatrix, speedRatio, gameSpeed) {
        this._ship = ship;
        if (this._shakeDelay <= 0) {
            this._shakeDelay = 6;
            this._shakeVector.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        }
        this._shakeDelay--;
        const noise = this._shakeVector.clone();
        noise.scaleInPlace(Math.max(ship.bursting, 0) * 0.5 * gameSpeed);
        const localEyePos = new core_1.Vector3(0, 0.8 + Math.min(ship.bursting, 0) * 0.1, -2.5 - Math.max(ship.bursting, 0) * 1).scale(5);
        localEyePos.addInPlace(noise);
        const eyePos = core_1.Vector3.TransformNormal(localEyePos, shipWorldMatrix);
        const localEyeTarget = new core_1.Vector3(0, 0, 100).scale(5);
        localEyeTarget.addInPlace(noise);
        const eyeTarget = core_1.Vector3.TransformNormal(localEyeTarget, shipWorldMatrix);
        const eyeUp = core_1.Vector3.TransformNormal(new core_1.Vector3(0, 1, 0), shipWorldMatrix);
        const shipPos = new core_1.Vector3(shipWorldMatrix.m[12], shipWorldMatrix.m[13], shipWorldMatrix.m[14]);
        //camera.setTarget(Vector3.Lerp(camera.getTarget(), eyeTarget.addInPlace(shipPos), 0.2));
        this._camera.upVector = eyeUp;
        var cameraLerp = 0.1 * gameSpeed; // + speedRatio * 0.3;
        ship.localEye = core_1.Vector3.Lerp(ship.localEye, eyePos, cameraLerp);
        ship.localTarget = core_1.Vector3.Lerp(ship.localTarget, eyeTarget, 0.15 * gameSpeed);
        var tmpTarget = ship.localTarget.clone();
        tmpTarget.addInPlace(shipPos);
        this._camera.fov = 0.8 - ship.bursting * 0.1;
        this._camera.position.set(ship.localEye.x, ship.localEye.y, ship.localEye.z);
        this._camera.position.addInPlace(shipPos);
        this._camera.setTarget(tmpTarget);
        // burst
        this._tickBurst(ship.bursting, gameSpeed);
    }
    dispose() {
        this._camera.dispose();
    }
}
exports.ShipCamera = ShipCamera;
//# sourceMappingURL=ShipCamera.js.map