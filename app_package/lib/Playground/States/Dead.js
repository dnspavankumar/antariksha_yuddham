"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dead = void 0;
const gui_1 = require("@babylonjs/gui");
const State_1 = require("./State");
const States_1 = require("./States");
const GameState_1 = require("./GameState");
const Ship_1 = require("../Ship");
const Input_1 = require("../Inputs/Input");
const GuiFramework_1 = require("../GuiFramework");
class Dead extends State_1.State {
    constructor() {
        super(...arguments);
        this.ship = null;
    }
    exit() {
        super.exit();
    }
    enter() {
        super.enter();
        if (!this._adt) {
            return;
        }
        Input_1.InputManager.disablePointerLock();
        if (GuiFramework_1.GuiFramework.isLandscape) {
            GuiFramework_1.GuiFramework.createBottomBar(this._adt);
            let stats = GuiFramework_1.GuiFramework.createRecapGrid();
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new gui_1.Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework_1.GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            let panelGrid = GuiFramework_1.GuiFramework.createTextPanel(grid);
            GuiFramework_1.GuiFramework.createPageTitle("Defeat", panelGrid);
            grid.addControl(stats, 0, 1);
            const splashText = GuiFramework_1.GuiFramework.createSplashText("Wasted!!!");
            stats.addControl(splashText, 0, 0);
            const statsGrid = GuiFramework_1.GuiFramework.createStatsGrid();
            stats.addControl(statsGrid, 1, 0);
            if (this.ship && this.ship.statistics) {
                const s = this.ship.statistics;
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Damage dealt", GuiFramework_1.GuiFramework.createStatText(s.damageDealt));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Damage taken", GuiFramework_1.GuiFramework.createStatText(s.damageTaken));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Ships destroyed", GuiFramework_1.GuiFramework.createStatText(s.shipsDestroyed));
                let minutes = Math.floor(Math.round(s.timeOfBattle / 1000) / 60);
                let seconds = Math.floor((Math.round(s.timeOfBattle / 1000) / 60 - minutes) * 60);
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Time of battle", GuiFramework_1.GuiFramework.createStatText(minutes + " min " + seconds + " sec"));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Shots fired", GuiFramework_1.GuiFramework.createStatText(s.shotFired));
                let accuracy = (s.shotFired > 0) ? Math.round((s.shotHitting / s.shotFired) * 100) + "%" : "0%";
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Accuracy", GuiFramework_1.GuiFramework.createStatText(accuracy));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Missiles fired", GuiFramework_1.GuiFramework.createStatText(s.missilesFired));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Allies Asteroid Crash", GuiFramework_1.GuiFramework.createStatText(Ship_1.Statistics.alliesCrash));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Enemies Asteroid Crash", GuiFramework_1.GuiFramework.createStatText(Ship_1.Statistics.enemiesCrash));
            }
            GuiFramework_1.GuiFramework.addButton("Try again", panel).onPointerDownObservable.add(function (info) {
                var _a;
                (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.stop();
                State_1.State.setCurrent(States_1.States.gameState);
            });
            GuiFramework_1.GuiFramework.addButton("Main menu", panel).onPointerDownObservable.add(function (info) {
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
            grid.addRowDefinition(0.5, false);
            grid.addRowDefinition(0.3, false);
            grid.addControl(panel, 2, 0);
            let textBlock = new gui_1.TextBlock("", "DEFEAT");
            GuiFramework_1.GuiFramework.setFont(textBlock, true, true);
            textBlock.fontSize = 35;
            textBlock.color = "#a6fffa";
            textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
            grid.addControl(textBlock, 0, 0);
            const statsGrid = GuiFramework_1.GuiFramework.createStatsGrid();
            grid.addControl(statsGrid, 1, 0);
            if (this.ship && this.ship.statistics) {
                const s = this.ship.statistics;
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Damage dealt", GuiFramework_1.GuiFramework.createStatText(s.damageDealt));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Damage taken", GuiFramework_1.GuiFramework.createStatText(s.damageTaken));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Ships destroyed", GuiFramework_1.GuiFramework.createStatText(s.shipsDestroyed));
                let minutes = Math.floor(Math.round(s.timeOfBattle / 1000) / 60);
                let seconds = Math.floor((Math.round(s.timeOfBattle / 1000) / 60 - minutes) * 60);
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Time of battle", GuiFramework_1.GuiFramework.createStatText(minutes + " min " + seconds + " sec"));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Shots fired", GuiFramework_1.GuiFramework.createStatText(s.shotFired));
                let accuracy = (s.shotFired > 0) ? Math.round((s.shotHitting / s.shotFired) * 100) + "%" : "0%";
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Accuracy", GuiFramework_1.GuiFramework.createStatText(accuracy));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Missiles fired", GuiFramework_1.GuiFramework.createStatText(s.missilesFired));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Allies Asteroid Crash", GuiFramework_1.GuiFramework.createStatText(Ship_1.Statistics.alliesCrash));
                GuiFramework_1.GuiFramework.createParameter(statsGrid, "Enemies Asteroid Crash", GuiFramework_1.GuiFramework.createStatText(Ship_1.Statistics.enemiesCrash));
            }
            GuiFramework_1.GuiFramework.addButton("Try again", panel).onPointerDownObservable.add(function (info) {
                var _a;
                (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.stop();
                State_1.State.setCurrent(States_1.States.gameState);
            });
            GuiFramework_1.GuiFramework.addButton("Main menu", panel).onPointerDownObservable.add(function (info) {
                var _a;
                (_a = GameState_1.GameState.gameSession) === null || _a === void 0 ? void 0 : _a.stop();
                State_1.State.setCurrent(States_1.States.main);
            });
            this._adt.addControl(grid);
        }
    }
}
exports.Dead = Dead;
//# sourceMappingURL=Dead.js.map