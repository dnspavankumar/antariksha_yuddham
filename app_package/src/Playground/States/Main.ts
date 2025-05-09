import { Nullable } from "@babylonjs/core";
import { Control, Grid, StackPanel, Button, Image, TextBlock } from "@babylonjs/gui";
import { GameDefinition } from "../Game";
import { Parameters } from "../Parameters";
import { BattleSelect } from "./BattleSelect";
import { Diorama } from "./Diorama";
import { State } from "./State";
import { States } from "./States";
import { Assets } from "../Assets";
import { GuiFramework } from "../GuiFramework";

export class Main extends State {

    public static diorama: Nullable<Diorama> = null;
    public static playButton: Nullable<Button> = null;
    public exit() {
        super.exit();
    }

    public enter() {
        super.enter();

        if (!this._adt) {
            return;
        }

        Main.diorama?.setEnable(this._adt);

        if (GuiFramework.isLandscape) {
            GuiFramework.createBottomBar(this._adt);
            var panel = new StackPanel();
            panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);

            // Hide the original logo
            // let logo = new Image("antariksha", "assets/UI/spacePiratesLogo.svg");
            // logo.width = 0.7;
            // logo.fixedRatio = 340 / 1040;
            // logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
            // logo.top = "100px";
            // grid.addControl(logo, 0, 1);

            // Add text for "Antariksha Yuddham" title
            let titleText = new TextBlock("gameTitle", "ANTARIKSHA YUDDHAM");
            titleText.color = "#f7b63b"; // Orange color similar to original logo
            titleText.fontSize = 60;
            titleText.fontWeight = "bold";
            titleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            titleText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            titleText.top = "100px";
            titleText.shadowColor = "#ff4500";
            titleText.shadowBlur = 10;
            titleText.shadowOffsetX = 3;
            titleText.shadowOffsetY = 3;
            grid.addControl(titleText, 0, 1);

            Main.playButton = GuiFramework.addButton("Play", panel);
            Main.playButton.isVisible = Assets.loadingComplete;

            Main.playButton.onPointerDownObservable.add(function(info) {
                const gameDefinition = new GameDefinition();
                gameDefinition.humanAllies = 1;
                gameDefinition.aiEnemies = Parameters.enemyCount;
                gameDefinition.aiAllies = Parameters.allyCount;
                BattleSelect.gameDefinition = gameDefinition;
                State.setCurrent(States.battleSelect);
            });

            if (Parameters.allowSplitScreen) {
                GuiFramework.addButton("Two Player Co-op", panel).onPointerDownObservable.add(function(info) {
                    const gameDefinition = new GameDefinition();
                    gameDefinition.humanAllies = 2;
                    gameDefinition.aiEnemies = Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters.allyCount;
                    BattleSelect.gameDefinition = gameDefinition;
                    State.setCurrent(States.battleSelect);
                });

                GuiFramework.addButton("Two Players Vs", panel).onPointerDownObservable.add(function(info) {
                    const gameDefinition = new GameDefinition();
                    gameDefinition.humanAllies = 1;
                    gameDefinition.humanEnemies = 1;
                    gameDefinition.aiEnemies = Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters.allyCount;
                    BattleSelect.gameDefinition = gameDefinition;
                    State.setCurrent(States.battleSelect);
                });
            }

            GuiFramework.addButton("Options", panel).onPointerDownObservable.add(function(info) {
                States.options.backDestination = States.main;
                State.setCurrent(States.options);
            });

            this._adt.addControl(grid);
        } else {
            var panel = new StackPanel();
            panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            panel.paddingBottom = "100px";

            // Hide the original logo
            // let logo = new Image("antariksha", "assets/UI/spacePiratesLogo.svg");
            // logo.width = 0.8;
            // logo.fixedRatio = 340 / 1040;
            // logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
            // logo.top = "150px";
            // this._adt.addControl(logo);

            // Add text for "Antariksha Yuddham" title
            let titleText = new TextBlock("gameTitle", "ANTARIKSHA YUDDHAM");
            titleText.color = "#f7b63b"; // Orange color similar to original logo
            titleText.fontSize = 45;
            titleText.fontWeight = "bold";
            titleText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            titleText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            titleText.top = "150px";
            titleText.shadowColor = "#ff4500";
            titleText.shadowBlur = 10;
            titleText.shadowOffsetX = 3;
            titleText.shadowOffsetY = 3;
            this._adt.addControl(titleText);

            Main.playButton = GuiFramework.addButton("Play", panel);
            Main.playButton.isVisible = Assets.loadingComplete;

            Main.playButton.onPointerDownObservable.add(function(info) {
                const gameDefinition = new GameDefinition();
                gameDefinition.humanAllies = 1;
                gameDefinition.aiEnemies = Parameters.enemyCount;
                gameDefinition.aiAllies = Parameters.allyCount;
                BattleSelect.gameDefinition = gameDefinition;
                State.setCurrent(States.battleSelect);
            });

            if (Parameters.allowSplitScreen) {
                GuiFramework.addButton("Two Player Co-op", panel).onPointerDownObservable.add(function(info) {
                    const gameDefinition = new GameDefinition();
                    gameDefinition.humanAllies = 2;
                    gameDefinition.aiEnemies = Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters.allyCount;
                    BattleSelect.gameDefinition = gameDefinition;
                    State.setCurrent(States.battleSelect);
                });

                GuiFramework.addButton("Two Players Vs", panel).onPointerDownObservable.add(function(info) {
                    const gameDefinition = new GameDefinition();
                    gameDefinition.humanAllies = 1;
                    gameDefinition.humanEnemies = 1;
                    gameDefinition.aiEnemies = Parameters.enemyCount;
                    gameDefinition.aiAllies = Parameters.allyCount;
                    BattleSelect.gameDefinition = gameDefinition;
                    State.setCurrent(States.battleSelect);
                });
            }

            GuiFramework.addButton("Options", panel).onPointerDownObservable.add(function(info) {
                States.options.backDestination = States.main;
                State.setCurrent(States.options);
            });

            this._adt.addControl(panel);
        }

    }
}