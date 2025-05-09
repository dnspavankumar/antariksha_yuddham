"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Credits = void 0;
const gui_1 = require("@babylonjs/gui");
const State_1 = require("./State");
const States_1 = require("./States");
const GuiFramework_1 = require("../GuiFramework");
class Credits extends State_1.State {
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
            let creditBlock = GuiFramework_1.GuiFramework.createRecapGrid();
            var panel = new gui_1.StackPanel();
            panel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            let grid = new gui_1.Grid();
            grid.paddingBottom = "100px";
            grid.paddingLeft = "100px";
            GuiFramework_1.GuiFramework.formatButtonGrid(grid);
            grid.addControl(panel, 0, 0);
            let panelGrid = GuiFramework_1.GuiFramework.createTextPanel(grid);
            GuiFramework_1.GuiFramework.createPageTitle("Credits", panelGrid);
            grid.addControl(creditBlock, 0, 1);
            var textBlock = new gui_1.TextBlock();
            textBlock.text = "This demo was made by some members of the Babylon.js core team, @PatrickCRyan, @skaven_, and @DarraghBurke_, " +
                "to celebrate the release of Babylon.js 5.0.\n\n" +
                "The mission of our Babylon.js team is to create one of the most powerful, beautiful, " +
                "and simple web rendering engines in the world. Our passion is to make it completely open and free for everyone. As you may have guessed, " +
                "Babylon.js was named with a deep love and admiration of one of the greatest sci-fi shows of all time.\n\n" +
                "To get  the code of this demo on: https://github.com/BabylonJS/SpacePirates \n" +
                "To learn about Babylon.js: https://doc.babylonjs.com \n" +
                "To connect with the community: https://forum.babylonjs.com";
            textBlock.textWrapping = true;
            textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            textBlock.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            textBlock.shadowOffsetX = 2;
            textBlock.shadowOffsetY = 2;
            textBlock.shadowColor = "black";
            textBlock.shadowBlur = 0;
            textBlock.width = 0.7;
            textBlock.height = 1.0;
            textBlock.color = "white";
            textBlock.fontSize = 24;
            GuiFramework_1.GuiFramework.setFont(textBlock, false, true);
            creditBlock.addControl(textBlock, 1, 0);
            GuiFramework_1.GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function (info) {
                State_1.State.setCurrent(States_1.States.main);
            });
            this._adt.addControl(grid);
        }
        else {
            var grid = new gui_1.Grid();
            grid.addRowDefinition(0.2, false);
            grid.addRowDefinition(0.6, false);
            grid.addRowDefinition(0.2, false);
            grid.addColumnDefinition(1.0, false);
            let textBlock = new gui_1.TextBlock("", "CREDITS");
            GuiFramework_1.GuiFramework.setFont(textBlock, true, true);
            textBlock.fontSize = 35;
            textBlock.color = "#a6fffa";
            textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
            grid.addControl(textBlock, 0, 0);
            var creditText = new gui_1.TextBlock();
            creditText.text = "This demo was made by some members of the Babylon.js core team, @PatrickCRyan, @skaven_, and @DarraghBurke_, " +
                "to celebrate the release of Babylon.js 5.0.\n\n" +
                "The mission of our Babylon.js team is to create one of the most powerful, beautiful, " +
                "and simple web rendering engines in the world. Our passion is to make it completely open and free for everyone. As you may have guessed, " +
                "Babylon.js was named with a deep love and admiration of one of the greatest sci-fi shows of all time.\n\n" +
                "To get  the code of this demo on: https://github.com/BabylonJS/SpacePirates \n" +
                "To learn about Babylon.js: https://doc.babylonjs.com \n" +
                "To connect with the community: https://forum.babylonjs.com";
            creditText.textWrapping = true;
            creditText.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            creditText.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            creditText.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
            creditText.shadowOffsetX = 2;
            creditText.shadowOffsetY = 2;
            creditText.shadowColor = "black";
            creditText.shadowBlur = 0;
            creditText.width = 0.7;
            creditText.height = 1.0;
            creditText.color = "white";
            creditText.fontSize = 24;
            GuiFramework_1.GuiFramework.setFont(creditText, false, true);
            grid.addControl(creditText, 1, 0);
            let panel = new gui_1.StackPanel();
            GuiFramework_1.GuiFramework.addButton("Back", panel).onPointerDownObservable.add(function (info) {
                State_1.State.setCurrent(States_1.States.main);
            });
            grid.addControl(panel, 2, 0);
            this._adt.addControl(grid);
        }
    }
}
exports.Credits = Credits;
//# sourceMappingURL=Credits.js.map