"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const core_1 = require("@babylonjs/core");
class Settings {
    static set volume(volume) {
        var _a;
        this._volume = volume;
        (_a = core_1.Engine.audioEngine) === null || _a === void 0 ? void 0 : _a.setGlobalVolume(this._volume);
    }
    static get volume() {
        return this._volume;
    }
}
exports.Settings = Settings;
Settings._volume = 1.0;
Settings.sensitivity = 1.0;
Settings.showParameters = false;
Settings.invertY = false;
//# sourceMappingURL=Settings.js.map