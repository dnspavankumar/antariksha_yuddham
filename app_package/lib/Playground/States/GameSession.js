"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
const Game_1 = require("../Game");
class GameSession {
    constructor(assets, scene, canvas, glowLayer) {
        this._game = null;
        this._assets = assets;
        this._scene = scene;
        this._canvas = canvas;
        this._glowLayer = glowLayer;
    }
    getScene() {
        return this._scene;
    }
    getCanvas() {
        return this._canvas;
    }
    getGame() {
        return this._game;
    }
    start(gameDefinition) {
        this._game = new Game_1.Game(this._assets, this._scene, this._canvas, gameDefinition, this._glowLayer);
    }
    stop() {
        if (!this._game) {
            return;
        }
        this._game.dispose();
        this._game = null;
    }
    inProgress() {
        return !!this._game;
    }
    pause() {
        var _a, _b, _c;
        (_b = (_a = this._game) === null || _a === void 0 ? void 0 : _a.getRecorder()) === null || _b === void 0 ? void 0 : _b.setRecordActive(false);
        (_c = this._game) === null || _c === void 0 ? void 0 : _c.setTargetSpeed(0);
    }
    resume() {
        var _a, _b, _c;
        (_a = this._game) === null || _a === void 0 ? void 0 : _a.setTargetSpeed(1);
        (_c = (_b = this._game) === null || _b === void 0 ? void 0 : _b.getRecorder()) === null || _c === void 0 ? void 0 : _c.setRecordActive(true);
    }
}
exports.GameSession = GameSession;
//# sourceMappingURL=GameSession.js.map