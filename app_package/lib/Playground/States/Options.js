"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
const gui_1 = require("@babylonjs/gui");
const Input_1 = require("../Inputs/Input");
const State_1 = require("./State");
const Settings_1 = require("../../Settings");
const GuiFramework_1 = require("../GuiFramework");
class Options extends State_1.State {
    constructor() {
        super(...arguments);
        this.backDestination = null;
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
            const panel = new gui_1.StackPanel();
            const parametersPanel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            const grid = new gui_1.Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework_1.GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            grid.addControl(parametersPanel, 0, 1);
            const panelGrid = GuiFramework_1.GuiFramework.createTextPanel(grid);
            GuiFramework_1.GuiFramework.createPageTitle("Options", panelGrid);
            const parametersGrid = GuiFramework_1.GuiFramework.createParametersGrid();
            grid.addControl(parametersGrid, 0, 1);
            const volumeSlider = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Volume", GuiFramework_1.GuiFramework.createSlider(0, 1.0), Settings_1.Settings.volume);
            volumeSlider.onValueChangedObservable.add((newValue) => {
                Settings_1.Settings.volume = newValue;
            });
            const sensitivitySlider = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Sensitivity", GuiFramework_1.GuiFramework.createSlider(0.05, 2.0), Settings_1.Settings.sensitivity);
            sensitivitySlider.onValueChangedObservable.add((newValue) => {
                Settings_1.Settings.sensitivity = newValue;
            });
            const showParameters = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Show Parameters", GuiFramework_1.GuiFramework.createCheckbox(), Number(Settings_1.Settings.showParameters));
            showParameters.onIsCheckedChangedObservable.add((checked) => {
                Settings_1.Settings.showParameters = checked;
            });
            const invertY = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Invert Y", GuiFramework_1.GuiFramework.createCheckbox(), Number(Settings_1.Settings.invertY));
            invertY.onIsCheckedChangedObservable.add((checked) => {
                Settings_1.Settings.invertY = checked;
            });
            var _this = this;
            GuiFramework_1.GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function (info) {
                if (_this.backDestination) {
                    State_1.State.setCurrent(_this.backDestination);
                }
            });
            this._adt.addControl(grid);
        }
        else {
            const panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            panel.paddingBottom = "100px";
            const grid = new gui_1.Grid();
            grid.addRowDefinition(0.2, false);
            grid.addRowDefinition(0.6, false);
            grid.addRowDefinition(0.2, false);
            grid.addControl(panel, 2, 0);
            let textBlock = new gui_1.TextBlock("", "OPTIONS");
            GuiFramework_1.GuiFramework.setFont(textBlock, true, true);
            textBlock.fontSize = 35;
            textBlock.color = "#a6fffa";
            textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
            grid.addControl(textBlock, 0, 0);
            const parametersGrid = GuiFramework_1.GuiFramework.createParametersGrid();
            grid.addControl(parametersGrid, 1, 0);
            const volumeSlider = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Volume", GuiFramework_1.GuiFramework.createSlider(0, 1.0), Settings_1.Settings.volume);
            volumeSlider.onValueChangedObservable.add((newValue) => {
                Settings_1.Settings.volume = newValue;
            });
            const sensitivitySlider = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Sensitivity", GuiFramework_1.GuiFramework.createSlider(0.05, 2.0), Settings_1.Settings.sensitivity);
            sensitivitySlider.onValueChangedObservable.add((newValue) => {
                Settings_1.Settings.sensitivity = newValue;
            });
            const showParameters = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Show Parameters", GuiFramework_1.GuiFramework.createCheckbox(), Number(Settings_1.Settings.showParameters));
            showParameters.onIsCheckedChangedObservable.add((checked) => {
                Settings_1.Settings.showParameters = checked;
            });
            const invertY = GuiFramework_1.GuiFramework.createParameter(parametersGrid, "Invert Y", GuiFramework_1.GuiFramework.createCheckbox(), Number(Settings_1.Settings.invertY));
            invertY.onIsCheckedChangedObservable.add((checked) => {
                Settings_1.Settings.invertY = checked;
            });
            parametersGrid.width = 0.8;
            parametersGrid.setColumnDefinition(0, 0.4, false);
            parametersGrid.setColumnDefinition(1, 0.6, false);
            var _this = this;
            GuiFramework_1.GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function (info) {
                if (_this.backDestination) {
                    State_1.State.setCurrent(_this.backDestination);
                }
            });
            this._adt.addControl(grid);
        }
    }
}
exports.Options = Options;
//# sourceMappingURL=Options.js.map