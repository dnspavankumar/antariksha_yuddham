"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const gui_1 = require("@babylonjs/gui");
const Game_1 = require("../Game");
const Parameters_1 = require("../Parameters");
const BattleSelect_1 = require("./BattleSelect");
const State_1 = require("./State");
const States_1 = require("./States");
const Assets_1 = require("../Assets");
const GuiFramework_1 = require("../GuiFramework");
class Main extends State_1.State {
    exit() {
        super.exit();
    }
    enter() {
        var _a;
        super.enter();
        if (!this._adt) {
            return;
        }
        (_a = Main.diorama) === null || _a === void 0 ? void 0 : _a.setEnable(this._adt);
        if (GuiFramework_1.GuiFramework.isLandscape) {
            GuiFramework_1.GuiFramework.createBottomBar(this._adt);
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new gui_1.Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework_1.GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            // Hide the original logo
            // let logo = new Image("antariksha", "assets/UI/spacePiratesLogo.svg");
            // logo.width = 0.7;
            // logo.fixedRatio = 340 / 1040;
            // logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
            // logo.top = "100px";
            // grid.addControl(logo, 0, 1);
            // Add text for "Antariksha Yuddham" title
            let titleText = new gui_1.TextBlock("gameTitle", "ANTARIKSHA YUDDHAM");
            titleText.color = "#f7b63b"; // Orange color similar to original logo
            titleText.fontSize = 60;
            titleText.fontWeight = "bold";
            titleText.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            titleText.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            titleText.top = "100px";
            titleText.shadowColor = "#ff4500";
            titleText.shadowBlur = 10;
            titleText.shadowOffsetX = 3;
            titleText.shadowOffsetY = 3;
            grid.addControl(titleText, 0, 1);
            Main.playButton = GuiFramework_1.GuiFramework.addButton("Play", panel);
            Main.playButton.isVisible = Assets_1.Assets.loadingComplete;
            Main.playButton.onPointerDownObservable.add(function (info) {
                const gameDefinition = new Game_1.GameDefinition();
                gameDefinition.humanAllies = 1;
                gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
                gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
                BattleSelect_1.BattleSelect.gameDefinition = gameDefinition;
                State_1.State.setCurrent(States_1.States.battleSelect);
            });
            if (Parameters_1.Parameters.allowSplitScreen) {
                GuiFramework_1.GuiFramework.addButton("Two Player Co-op", panel).onPointerDownObservable.add(function (info) {
                    const gameDefinition = new Game_1.GameDefinition();
                    gameDefinition.humanAllies = 2;
                    gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
                    BattleSelect_1.BattleSelect.gameDefinition = gameDefinition;
                    State_1.State.setCurrent(States_1.States.battleSelect);
                });
                GuiFramework_1.GuiFramework.addButton("Two Players Vs", panel).onPointerDownObservable.add(function (info) {
                    const gameDefinition = new Game_1.GameDefinition();
                    gameDefinition.humanAllies = 1;
                    gameDefinition.humanEnemies = 1;
                    gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
                    BattleSelect_1.BattleSelect.gameDefinition = gameDefinition;
                    State_1.State.setCurrent(States_1.States.battleSelect);
                });
            }
            GuiFramework_1.GuiFramework.addButton("Options", panel).onPointerDownObservable.add(function (info) {
                States_1.States.options.backDestination = States_1.States.main;
                State_1.State.setCurrent(States_1.States.options);
            });
            this._adt.addControl(grid);
        }
        else {
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            panel.paddingBottom = "100px";
            // Hide the original logo
            // let logo = new Image("antariksha", "assets/UI/spacePiratesLogo.svg");
            // logo.width = 0.8;
            // logo.fixedRatio = 340 / 1040;
            // logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
            // logo.top = "150px";
            // this._adt.addControl(logo);
            // Add text for "Antariksha Yuddham" title
            let titleText = new gui_1.TextBlock("gameTitle", "ANTARIKSHA YUDDHAM");
            titleText.color = "#f7b63b"; // Orange color similar to original logo
            titleText.fontSize = 45;
            titleText.fontWeight = "bold";
            titleText.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            titleText.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            titleText.top = "150px";
            titleText.shadowColor = "#ff4500";
            titleText.shadowBlur = 10;
            titleText.shadowOffsetX = 3;
            titleText.shadowOffsetY = 3;
            this._adt.addControl(titleText);
            Main.playButton = GuiFramework_1.GuiFramework.addButton("Play", panel);
            Main.playButton.isVisible = Assets_1.Assets.loadingComplete;
            Main.playButton.onPointerDownObservable.add(function (info) {
                const gameDefinition = new Game_1.GameDefinition();
                gameDefinition.humanAllies = 1;
                gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
                gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
                BattleSelect_1.BattleSelect.gameDefinition = gameDefinition;
                State_1.State.setCurrent(States_1.States.battleSelect);
            });
            if (Parameters_1.Parameters.allowSplitScreen) {
                GuiFramework_1.GuiFramework.addButton("Two Player Co-op", panel).onPointerDownObservable.add(function (info) {
                    const gameDefinition = new Game_1.GameDefinition();
                    gameDefinition.humanAllies = 2;
                    gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
                    BattleSelect_1.BattleSelect.gameDefinition = gameDefinition;
                    State_1.State.setCurrent(States_1.States.battleSelect);
                });
                GuiFramework_1.GuiFramework.addButton("Two Players Vs", panel).onPointerDownObservable.add(function (info) {
                    const gameDefinition = new Game_1.GameDefinition();
                    gameDefinition.humanAllies = 1;
                    gameDefinition.humanEnemies = 1;
                    gameDefinition.aiEnemies = Parameters_1.Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters_1.Parameters.allyCount;
                    BattleSelect_1.BattleSelect.gameDefinition = gameDefinition;
                    State_1.State.setCurrent(States_1.States.battleSelect);
                });
            }
            GuiFramework_1.GuiFramework.addButton("Options", panel).onPointerDownObservable.add(function (info) {
                States_1.States.options.backDestination = States_1.States.main;
                State_1.State.setCurrent(States_1.States.options);
            });
            this._adt.addControl(panel);
        }
    }
}
exports.Main = Main;
Main.diorama = null;
Main.playButton = null;
//# sourceMappingURL=Main.js.map