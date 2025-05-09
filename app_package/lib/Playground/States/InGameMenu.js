"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InGameMenu = void 0;
const gui_1 = require("@babylonjs/gui");
const Input_1 = require("../Inputs/Input");
const GameState_1 = require("./GameState");
const State_1 = require("./State");
const States_1 = require("./States");
const Parameters_1 = require("../Parameters");
const GuiFramework_1 = require("../GuiFramework");
class InGameMenu extends State_1.State {
    exit() {
        super.exit();
    }
    enter() {
        var _a, _b, _c;
        super.enter();
        if (!this._adt) {
            return;
        }
        (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.pause();
        if (GuiFramework_1.GuiFramework.isLandscape) {
            GuiFramework_1.GuiFramework.createBottomBar(this._adt);
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new gui_1.Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework_1.GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            GuiFramework_1.GuiFramework.addButton("Continue", panel).onPointerDownObservable.add(function (info) {
                Input_1.InputManager.setupPointerLock();
                State_1.State.setCurrent(States_1.States.gameState);
            });
            GuiFramework_1.GuiFramework.addButton("Options", panel).onPointerDownObservable.add(function (info) {
                States_1.States.options.backDestination = States_1.States.inGameMenu;
                State_1.State.setCurrent(States_1.States.options);
            });
            const game = (_b = GameState_1.GameState.gameSession) === null || _b === void 0 ? void 0 : _b.getGame();
            if (game &&
                game.humanPlayerShips.length == 1 &&
                Parameters_1.Parameters.recorderActive) {
                GuiFramework_1.GuiFramework.addButton("Photo mode", panel).onPointerDownObservable.add(function (info) {
                    State_1.State.setCurrent(States_1.States.photoMode);
                });
            }
            GuiFramework_1.GuiFramework.addButton("Back to menu", panel).onPointerDownObservable.add(function (info) {
                var _a;
                (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.stop();
                State_1.State.setCurrent(States_1.States.main);
            });
            this._adt.addControl(grid);
        }
        else {
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            panel.paddingBottom = "100px";
            let grid = new gui_1.Grid();
            grid.addRowDefinition(0.2, false);
            grid.addRowDefinition(0.8, false);
            grid.addControl(panel, 1, 0);
            GuiFramework_1.GuiFramework.addButton("Continue", panel).onPointerDownObservable.add(function (info) {
                Input_1.InputManager.setupPointerLock();
                State_1.State.setCurrent(States_1.States.gameState);
            });
            GuiFramework_1.GuiFramework.addButton("Options", panel).onPointerDownObservable.add(function (info) {
                States_1.States.options.backDestination = States_1.States.inGameMenu;
                State_1.State.setCurrent(States_1.States.options);
            });
            const game = (_c = GameState_1.GameState.gameSession) === null || _c === void 0 ? void 0 : _c.getGame();
            if (game &&
                game.humanPlayerShips.length == 1 &&
                Parameters_1.Parameters.recorderActive &&
                GuiFramework_1.GuiFramework.isLandscape) {
                GuiFramework_1.GuiFramework.addButton("Photo mode", panel).onPointerDownObservable.add(function (info) {
                    State_1.State.setCurrent(States_1.States.photoMode);
                });
            }
            GuiFramework_1.GuiFramework.addButton("Back to menu", panel).onPointerDownObservable.add(function (info) {
                var _a;
                (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.stop();
                State_1.State.setCurrent(States_1.States.main);
            });
            this._adt.addControl(grid);
        }
    }
}
exports.InGameMenu = InGameMenu;
//# sourceMappingURL=InGameMenu.js.map