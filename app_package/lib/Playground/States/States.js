"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.States = void 0;
const BattleSelect_1 = require("./BattleSelect");
const Credits_1 = require("./Credits");
const Dead_1 = require("./Dead");
const GameState_1 = require("./GameState");
const InGameMenu_1 = require("./InGameMenu");
const Main_1 = require("./Main");
const Options_1 = require("./Options");
const Victory_1 = require("./Victory");
const PhotoMode_1 = require("./PhotoMode");
class States {
}
exports.States = States;
States.battleSelect = new BattleSelect_1.BattleSelect;
States.credits = new Credits_1.Credits;
States.dead = new Dead_1.Dead;
States.gameState = new GameState_1.GameState;
States.inGameMenu = new InGameMenu_1.InGameMenu;
States.main = new Main_1.Main;
States.options = new Options_1.Options;
States.victory = new Victory_1.Victory;
States.photoMode = new PhotoMode_1.PhotoMode;
//# sourceMappingURL=States.js.map