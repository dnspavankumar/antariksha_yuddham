"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diorama = void 0;
const core_1 = require("@babylonjs/core");
const gui_1 = require("@babylonjs/gui");
const Ship_1 = require("../Ship");
class Diorama {
    ;
    constructor(scene, assets, engine, glowLayer) {
        this._localTime = -10000;
        this._start = new core_1.Vector3();
        this._end = new core_1.Vector3();
        this._image = null;
        this._enabled = false;
        this._ship = null;
        this._scene = scene;
        this._camera = new core_1.FreeCamera("camera1", new core_1.Vector3(0, 10, 0), this._scene);
        this._camera.setTarget(new core_1.Vector3(0, 0, 0));
        this._cameraDummy = new core_1.FreeCamera("camera1", new core_1.Vector3(0, 0, 0), scene);
        this._cameraDummy.layerMask = 0x10000000;
        scene.clearColor = new core_1.Color4(0, 0, 0, 1);
        scene.activeCamera = this._camera;
        scene.activeCameras = [this._camera, this._cameraDummy];
        var _this = this;
        if (assets.valkyrie) {
            this._ship = assets.valkyrie.clone("valkyrieDiorana", null);
            if (this._ship) {
                this._ship.scaling.scaleInPlace(100);
                this._ship.getChildTransformNodes(false).forEach((m) => {
                    if (m.name.endsWith("valkyrieShield_mesh")) {
                        m.setEnabled(false);
                    }
                });
                Ship_1.Ship.HandleThrustersShield(assets, null, this._ship, true, 0, glowLayer);
            }
        }
        if (assets.starfield) {
            assets.starfield.visibility = 1;
        }
        this._scene.onBeforeRenderObservable.add(() => {
            if (!this._enabled) {
                return;
            }
            this._localTime += this._scene.getEngine().getDeltaTime();
            if (this._localTime > 4000) {
                const ng = Math.random() * Math.PI * 2;
                this._start.set(Math.cos(ng), Math.random() - 0.5, Math.sin(ng));
                this._start.y = Math.max(Math.abs(this._start.y), 0.2) * Math.sign(this._start.y);
                this._camera.setTarget(new core_1.Vector3(0, 0, 0));
                this._end.copyFrom(this._start);
                this._end.x += Math.random() * 0.1 - 0.05;
                this._end.y += Math.random() * 0.1 - 0.05;
                this._end.z += Math.random() * 0.1 - 0.05;
                this._start.scaleInPlace(14 + Math.random() * 4);
                this._end.scaleInPlace(14 + Math.random() * 4);
                this._localTime = 0;
            }
            const t = this._localTime / 4000;
            if (this._image) {
                if (t < 0.25) {
                    this._image.alpha = 1 - t * 4;
                }
                else if (t > 0.75) {
                    this._image.alpha = (t - 0.75) * 4;
                }
            }
            core_1.Vector3.LerpToRef(this._start, this._end, t, this._camera.position);
            this._camera.setTarget(new core_1.Vector3(0, 0, 0));
        });
    }
    _createGUI(adt) {
        this._image = new gui_1.Rectangle("img");
        this._image.background = "black";
        this._image.color = "transparent";
        this._image.height = 1;
        this._image.width = 1;
        this._image.isVisible = true;
        this._image.alpha = 1;
        adt.addControl(this._image);
        console.log("gui created");
    }
    _destroyGUI() {
        if (this._image) {
            this._image.dispose();
            console.log("gui destroyed");
        }
    }
    setEnable(adt = null) {
        var _a, _b;
        const enabled = adt != null;
        if (this._enabled != enabled) {
            this._enabled = enabled;
            this._localTime = 10000;
            if (enabled) {
                this._scene.activeCamera = this._camera;
                this._scene.activeCameras = [this._camera, this._cameraDummy];
                (_a = this._ship) === null || _a === void 0 ? void 0 : _a.setEnabled(true);
                this._createGUI(adt);
            }
            else {
                this._destroyGUI();
                (_b = this._ship) === null || _b === void 0 ? void 0 : _b.setEnabled(false);
            }
        }
    }
}
exports.Diorama = Diorama;
//# sourceMappingURL=Diorama.js.map