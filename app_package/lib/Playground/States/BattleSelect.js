"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleSelect = void 0;
const gui_1 = require("@babylonjs/gui");
const GameState_1 = require("./GameState");
const State_1 = require("./State");
const States_1 = require("./States");
const Assets_1 = require("../Assets");
const GuiFramework_1 = require("../GuiFramework");
const Input_1 = require("../Inputs/Input");
class BattleSelect extends State_1.State {
    exit() {
        super.exit();
    }
    enter() {
        super.enter();
        if (!this._adt) {
            return;
        }
        if (GuiFramework_1.GuiFramework.isLandscape) {
            GuiFramework_1.GuiFramework.createBottomBar(this._adt);
            let instructions = GuiFramework_1.GuiFramework.createRecapGrid();
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new gui_1.Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework_1.GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            const panelGrid = GuiFramework_1.GuiFramework.createTextPanel(grid);
            GuiFramework_1.GuiFramework.createPageTitle("Mission Select", panelGrid);
            grid.addControl(instructions, 0, 1);
            const splashText = GuiFramework_1.GuiFramework.createSplashText("");
            instructions.addControl(splashText, 0, 0);
            const inputControls = GuiFramework_1.GuiFramework.createStatsGrid();
            instructions.addControl(inputControls, 1, 0);
            if (Input_1.InputManager.isTouch) {
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Steer", GuiFramework_1.GuiFramework.createStatText("Virtual Thumbstick"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Fire Cannons", GuiFramework_1.GuiFramework.createStatText("Fire Button"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Fire Missile", GuiFramework_1.GuiFramework.createStatText("Missile Button"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Afterburners", GuiFramework_1.GuiFramework.createStatText("Boost Button"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Brake", GuiFramework_1.GuiFramework.createStatText("Brake Button"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Reverse Course", GuiFramework_1.GuiFramework.createStatText("Flip Button"));
            }
            else {
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Steer", GuiFramework_1.GuiFramework.createStatText("Mouse"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Fire Cannons", GuiFramework_1.GuiFramework.createStatText("Left Mouse Button"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Fire Missile", GuiFramework_1.GuiFramework.createStatText("Right Mouse Button"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Afterburners", GuiFramework_1.GuiFramework.createStatText("W"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Brake", GuiFramework_1.GuiFramework.createStatText("S"));
                GuiFramework_1.GuiFramework.createParameter(inputControls, "Reverse Course", GuiFramework_1.GuiFramework.createStatText("Q"));
            }
            Assets_1.Assets.missions.forEach((scenario) => {
                let button = GuiFramework_1.GuiFramework.addButton(scenario.name, panel);
                button.onPointerMoveObservable.add(() => {
                    splashText.text = scenario.description;
                });
                button.onPointerDownObservable.add(() => {
                    GameState_1.GameState.gameDefinition = scenario.gameDefinition;
                    State_1.State.setCurrent(States_1.States.gameState);
                });
            });
            let button = GuiFramework_1.GuiFramework.addButton("Back", panel);
            button.onPointerMoveObservable.add(function (info) {
                splashText.text = "";
            });
            button.onPointerDownObservable.add(function (info) {
                State_1.State.setCurrent(States_1.States.main);
            });
            this._adt.addControl(grid);
        }
        else {
            let grid = new gui_1.Grid();
            grid.addRowDefinition(0.2, false);
            grid.addRowDefinition(0.8, false);
            grid.addColumnDefinition(1.0, false);
            let textBlock = new gui_1.TextBlock("", "MISSION SELECT");
            GuiFramework_1.GuiFramework.setFont(textBlock, true, true);
            textBlock.fontSize = 35;
            textBlock.color = "#a6fffa";
            textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
            grid.addControl(textBlock, 0, 0);
            const splashText = GuiFramework_1.GuiFramework.createSplashText("");
            splashText.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            grid.addControl(splashText, 1, 0);
            var panel = new gui_1.StackPanel();
            panel.paddingBottom = "100px";
            Assets_1.Assets.missions.forEach((scenario) => {
                let button = GuiFramework_1.GuiFramework.addButton(scenario.name, panel);
                button.onPointerMoveObservable.add(() => {
                    splashText.text = scenario.description;
                });
                button.onPointerDownObservable.add(() => {
                    GameState_1.GameState.gameDefinition = scenario.gameDefinition;
                    State_1.State.setCurrent(States_1.States.gameState);
                });
            });
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            let button = GuiFramework_1.GuiFramework.addButton("Back", panel);
            button.onPointerMoveObservable.add(function (info) {
                splashText.text = "";
            });
            button.onPointerDownObservable.add(function (info) {
                State_1.State.setCurrent(States_1.States.main);
            });
            grid.addControl(panel, 2, 0);
            this._adt.addControl(grid);
        }
    }
}
exports.BattleSelect = BattleSelect;
BattleSelect.gameDefinition = null;
BattleSelect.missions = null;
//# sourceMappingURL=BattleSelect.js.map