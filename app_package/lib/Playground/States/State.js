"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const gui_1 = require("@babylonjs/gui");
const GameState_1 = require("./GameState");
const Parameters_1 = require("../Parameters");
class State {
    constructor() {
        this._adt = null;
        this._resizeListener = this._resizeListener.bind(this);
    }
    static setCurrent(newState) {
        if (this.currentState === newState) {
            return;
        }
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        if (this.currentState) {
            this.currentState.enter();
        }
    }
    exit() {
        if (this._adt) {
            this._adt.dispose();
            window.removeEventListener("resize", this._resizeListener);
        }
    }
    enter() {
        var _a;
        const scene = (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.getScene();
        this._adt = gui_1.AdvancedDynamicTexture.CreateFullscreenUI("Main", true, scene);
        this._adt.layer.layerMask = 0x10000000;
        this._adt.idealHeight = 1440;
        window.addEventListener("resize", this._resizeListener);
    }
    // helpers
    _addText(text, panel) {
        var textBlock = new gui_1.TextBlock();
        textBlock.text = text.toUpperCase();
        textBlock.width = 0.6;
        textBlock.height = "20px";
        textBlock.color = "white";
        Parameters_1.Parameters.setFont(textBlock, true);
        panel.addControl(textBlock);
    }
    _resizeListener() {
        if (this._adt && this._adt.getScene()) {
            this._adt.scaleTo(this._adt.getScene().getEngine().getRenderWidth(), this._adt.getScene().getEngine().getRenderHeight());
        }
    }
}
exports.State = State;
State.currentState = null;
//# sourceMappingURL=State.js.map