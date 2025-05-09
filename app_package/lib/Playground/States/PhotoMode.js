"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoMode = void 0;
const gui_1 = require("@babylonjs/gui");
const State_1 = require("./State");
const States_1 = require("./States");
const core_1 = require("@babylonjs/core");
const Input_1 = require("../Inputs/Input");
const GameState_1 = require("./GameState");
const PlanetBaker_1 = require("../FX/PlanetBaker");
const World_1 = require("../World");
const GuiFramework_1 = require("../GuiFramework");
class PhotoMode extends State_1.State {
    constructor() {
        super(...arguments);
        this.ship = null;
        this._gameCamera = null;
        this._zeroCamera = null;
        this._photoCamera = null;
        this._photoArcRotateCamera = null;
        this._photoFreeCamera = null;
        this._scene = null;
        this._recorder = null;
        this._canvas = null;
        this._hotkeyObservable = null;
        this.assets = null;
        this.sunCamera = null;
        this._renderObserver = null;
    }
    exit() {
        var _a, _b, _c;
        super.exit();
        this._clearPP();
        if (this._scene && this._canvas) {
            (_a = this._photoCamera) === null || _a === void 0 ? void 0 : _a.detachControl();
            this._scene.activeCamera = this._gameCamera;
            if (((_b = this._scene.activeCameras) === null || _b === void 0 ? void 0 : _b.length) && this._zeroCamera) {
                this._scene.activeCameras[0] = this._zeroCamera;
            }
        }
        if (this._scene && this._hotkeyObservable) {
            this._scene.onKeyboardObservable.remove(this._hotkeyObservable);
        }
        const scene = (_c = GameState_1.GameState.gameSession) === null || _c === void 0 ? void 0 : _c.getScene();
        if (scene) {
            scene.onBeforeRenderObservable.remove(this._renderObserver);
        }
    }
    _clearPP() {
        if (this._photoCamera && this.sunCamera) {
            this.sunCamera.mesh.dispose();
            this.sunCamera.dispose(this._photoCamera);
        }
    }
    enter() {
        var _a, _b, _c, _d, _e, _f, _g;
        super.enter();
        if (!this._adt) {
            return;
        }
        const scene = (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.getScene();
        if (!scene) {
            return;
        }
        const game = (_b = GameState_1.GameState.gameSession) === null || _b === void 0 ? void 0 : _b.getGame();
        if (!game) {
            return;
        }
        this._scene = scene;
        this._gameCamera = (((_c = scene.activeCameras) === null || _c === void 0 ? void 0 : _c.length) && scene.activeCameras[0]) ? scene.activeCameras[0] : scene.activeCamera;
        this._canvas = (_d = GameState_1.GameState.gameSession) === null || _d === void 0 ? void 0 : _d.getCanvas();
        this._recorder = (_f = (_e = GameState_1.GameState.gameSession) === null || _e === void 0 ? void 0 : _e.getGame()) === null || _f === void 0 ? void 0 : _f.getRecorder();
        if (!this._recorder) {
            return;
        }
        if (scene.activeCameras) {
            this._zeroCamera = scene.activeCameras[0];
        }
        Input_1.InputManager.disablePointerLock();
        var panel = new gui_1.StackPanel();
        panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        const grid = new gui_1.Grid();
        grid.paddingBottom = "100px";
        grid.paddingLeft = "100px";
        GuiFramework_1.GuiFramework.formatButtonGrid(grid);
        grid.addControl(panel, 0, 0);
        const controlsGrid = GuiFramework_1.GuiFramework.createScreenshotGrid();
        grid.addControl(controlsGrid, 0, 0);
        var _this = this;
        this._hotkeyObservable = scene.onKeyboardObservable.add((kbInfo) => {
            var _a;
            switch (kbInfo.type) {
                case core_1.KeyboardEventTypes.KEYDOWN:
                    if (kbInfo.event.key == 'h') {
                        panel.alpha = (panel.alpha === 0) ? 1 : 0;
                        controlsGrid.alpha = (controlsGrid.alpha === 0) ? 1 : 0;
                    }
                    else if (kbInfo.event.key == ' ') {
                        (_a = _this._recorder) === null || _a === void 0 ? void 0 : _a.stop();
                        panel.alpha = 1;
                        controlsGrid.alpha = 1;
                    }
                    else if (kbInfo.event.key == '-') {
                        _this._photoCamera.radius *= 0.99;
                    }
                    else if (kbInfo.event.key == '+') {
                        _this._photoCamera.radius *= 1.01;
                    }
                    break;
            }
        });
        this._renderObserver = scene.onBeforeRenderObservable.add(() => {
            if (this.sunCamera && this._photoCamera) {
                World_1.World.updateSunPostProcess(this._photoCamera.position, this.sunCamera.mesh);
            }
        });
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(0, 1), "'h' to toggle UI", true);
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(1, 1), "Space to stop playback", true);
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(2, 0), "Ally Trails");
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(3, 0), "Enemy Trails");
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(4, 0), "Rotate Camera");
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(5, 0), "Free Camera");
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(6, 0), "Distance");
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(7, 0), "Roll");
        GuiFramework_1.GuiFramework.createScreenshotText(controlsGrid, new core_1.Vector2(8, 0), "Frame");
        const rotateCam = GuiFramework_1.GuiFramework.createRadioButton(true);
        rotateCam.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        rotateCam.onIsCheckedChangedObservable.add(function (state) {
            if (state) {
                _this._bindArcRotateCamera();
            }
        });
        controlsGrid.addControl(rotateCam, 4, 1);
        const freeCam = GuiFramework_1.GuiFramework.createRadioButton();
        freeCam.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        freeCam.onIsCheckedChangedObservable.add(function (state) {
            if (state) {
                _this._bindFreeCamera();
            }
        });
        controlsGrid.addControl(freeCam, 5, 1);
        const frameSlider = GuiFramework_1.GuiFramework.createSlider(2, 50, 10);
        frameSlider.width = 0.9;
        controlsGrid.addControl(frameSlider, 8, 1);
        let framesAvailable = this._recorder.getAvailableFrames();
        framesAvailable = framesAvailable ? framesAvailable : 0;
        frameSlider.maximum = framesAvailable - 1;
        frameSlider.value = framesAvailable - 1;
        frameSlider.step = 1;
        frameSlider.onValueChangedObservable.add(function (value) {
            var _a;
            (_a = _this._recorder) === null || _a === void 0 ? void 0 : _a.applyFrame(value);
        });
        const distanceSlider = GuiFramework_1.GuiFramework.createSlider(2, 50, 10);
        distanceSlider.width = 0.9;
        controlsGrid.addControl(distanceSlider, 6, 1);
        distanceSlider.onValueChangedObservable.add(function (value) {
            _this._photoCamera.radius = value;
        });
        const rollSlider = GuiFramework_1.GuiFramework.createSlider(0, Math.PI * 2);
        rollSlider.width = 0.9;
        controlsGrid.addControl(rollSlider, 7, 1);
        rollSlider.onValueChangedObservable.add(function (value) {
            _this._photoCamera.upVector = new core_1.Vector3(Math.cos(value), Math.sin(value), 0);
        });
        const allyTrailsCheck = GuiFramework_1.GuiFramework.createCheckbox();
        allyTrailsCheck.isChecked = true;
        allyTrailsCheck.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        allyTrailsCheck.onIsCheckedChangedObservable.add(function (value) {
            if (_this._recorder) {
                _this._recorder._trailVisibilityMask ^= 1;
                _this._recorder.refreshFrame();
            }
        });
        controlsGrid.addControl(allyTrailsCheck, 2, 1);
        const enemyTrailsCheck = GuiFramework_1.GuiFramework.createCheckbox();
        enemyTrailsCheck.isChecked = true;
        enemyTrailsCheck.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        enemyTrailsCheck.onIsCheckedChangedObservable.add(function (value) {
            if (_this._recorder) {
                _this._recorder._trailVisibilityMask ^= 2;
                _this._recorder.refreshFrame();
            }
        });
        controlsGrid.addControl(enemyTrailsCheck, 3, 1);
        this._addPlaybackButton(1, panel, controlsGrid);
        this._addPlaybackButton(0.5, panel, controlsGrid);
        this._addPlaybackButton(0.25, panel, controlsGrid);
        this._addPlaybackButton(0.125, panel, controlsGrid);
        GuiFramework_1.GuiFramework.addButton("Stop", panel).onPointerDownObservable.add(function (info) {
            var _a;
            (_a = _this._recorder) === null || _a === void 0 ? void 0 : _a.stop();
        });
        GuiFramework_1.GuiFramework.addButton("Screen shot", panel).onPointerDownObservable.add(function (info) {
            panel.alpha = 0;
            controlsGrid.alpha = 0;
            if (_this._scene && _this._photoCamera) {
                (0, core_1.CreateScreenshot)(_this._scene.getEngine(), _this._photoCamera, 1920, () => {
                    panel.alpha = 1;
                    controlsGrid.alpha = 1;
                }, "image/png", true);
            }
        });
        GuiFramework_1.GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function (info) {
            State_1.State.setCurrent(States_1.States.inGameMenu);
        });
        this._adt.addControl(grid);
        // arc rotate camera
        const position = (game.humanPlayerShips.length && game.humanPlayerShips[0]) ? game.humanPlayerShips[0].root.position : new core_1.Vector3(0, 0, 0);
        this._photoArcRotateCamera = new core_1.ArcRotateCamera("cam", 0.5, 0.5, 10, position, scene);
        this._photoFreeCamera = new core_1.FreeCamera("cam", position.clone(), scene);
        this._bindArcRotateCamera();
        (_g = this._recorder) === null || _g === void 0 ? void 0 : _g.applyFrame(framesAvailable - 1);
    }
    _addPlaybackButton(speed, panel, controlsGrid) {
        var _this = this;
        var button = GuiFramework_1.GuiFramework.addButton("Play " + speed, panel);
        button.onPointerDownObservable.add(function (info) {
            var _a;
            panel.alpha = 0;
            controlsGrid.alpha = 0;
            (_a = _this._recorder) === null || _a === void 0 ? void 0 : _a.playback(speed, () => {
                panel.alpha = 1;
                controlsGrid.alpha = 1;
            });
        });
        return button;
    }
    _bindArcRotateCamera() {
        var _a;
        this._clearPP();
        this._photoCamera = this._photoArcRotateCamera;
        if (this._scene) {
            this._scene.activeCamera = this._photoCamera;
            if (((_a = this._scene.activeCameras) === null || _a === void 0 ? void 0 : _a.length) && this._photoCamera) {
                this._scene.activeCameras[0] = this._photoCamera;
            }
            this._photoCamera.attachControl(this._canvas, true);
            if (this._photoCamera && this.assets) {
                this.sunCamera = PlanetBaker_1.PlanetBaker.CreateSunPostProcess(this._photoCamera, this._scene, this.assets);
            }
        }
    }
    _bindFreeCamera() {
        var _a;
        this._clearPP();
        this._photoCamera = this._photoFreeCamera;
        if (this._scene) {
            this._scene.activeCamera = this._photoCamera;
            if (((_a = this._scene.activeCameras) === null || _a === void 0 ? void 0 : _a.length) && this._photoCamera) {
                this._scene.activeCameras[0] = this._photoCamera;
            }
            this._photoCamera.attachControl(this._canvas, true);
            if (this._photoCamera && this.assets) {
                this.sunCamera = PlanetBaker_1.PlanetBaker.CreateSunPostProcess(this._photoCamera, this._scene, this.assets);
            }
        }
    }
}
exports.PhotoMode = PhotoMode;
//# sourceMappingURL=PhotoMode.js.map