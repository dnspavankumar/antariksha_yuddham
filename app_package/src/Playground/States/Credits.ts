import { Control, Grid, StackPanel, TextBlock } from "@babylonjs/gui";
import { State } from "./State";
import { States } from "./States";
import { GuiFramework } from "../GuiFramework";

export class Credits extends State {

    public exit() {
        super.exit();
    }

    public enter() {
        super.enter();
        if (!this._adt) {
            return;
        }

        if (GuiFramework.isLandscape) {
            GuiFramework.createBottomBar(this._adt);
            let creditBlock = GuiFramework.createRecapGrid();
            var panel = new StackPanel();
            panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            let panelGrid: Grid = GuiFramework.createTextPanel(grid);
            GuiFramework.createPageTitle("Credits", panelGrid);
            grid.addControl(creditBlock, 0, 1);
    
            GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function(info) {
                State.setCurrent(States.main);
            });
    
            this._adt.addControl(grid);
            
        } else {
            var grid = new Grid();
            grid.addRowDefinition(0.2, false);
            grid.addRowDefinition(0.6, false);
            grid.addRowDefinition(0.2, false);
            grid.addColumnDefinition(1.0, false);
            let textBlock = new TextBlock("", "CREDITS");
            GuiFramework.setFont(textBlock, true, true);    
            textBlock.fontSize = 35;
            textBlock.color = "#a6fffa";
            textBlock.horizontalAlignment =  Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
            textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            grid.addControl(textBlock, 0, 0);
    
            let panel = new StackPanel();
            GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function(info) {
                State.setCurrent(States.main);
            });
            grid.addControl(panel, 2,0);
    
            this._adt.addControl(grid);
        }
    }
}