"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const State_1 = require("./State");
const Main_1 = require("./Main");
class GameState extends State_1.State {
    exit() {
        super.exit();
    }
    enter() {
        var _a, _b, _c, _d;
        super.enter();
        (_a = Main_1.Main.diorama) === null || _a === void 0 ? void 0 : _a.setEnable(null);
        if (!((_b = GameState.gameSession) === null || _b === void 0 ? void 0 : _b.inProgress())) {
            (_c = GameState.gameSession) === null || _c === void 0 ? void 0 : _c.start(GameState.gameDefinition);
        }
        else {
            (_d = GameState.gameSession) === null || _d === void 0 ? void 0 : _d.resume();
        }
    }
}
exports.GameState = GameState;
GameState.gameSession = null;
GameState.gameDefinition = null;
//# sourceMappingURL=GameState.js.map