"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiFramework = void 0;
const gui_1 = require("@babylonjs/gui");
class GuiFramework {
    static updateGuiBasedOnOrientation(adt) {
        let controls = adt.getDescendants(false);
        if (this.isLandscape === false) {
            for (let index in controls) {
                controls[index].alpha = 0;
                controls[index].isEnabled = false;
            }
            let warning = adt.getControlByName("portraitWarning");
            if (warning)
                warning.alpha = 1.0;
        }
        else {
            for (let index in controls) {
                controls[index].alpha = 1;
                controls[index].isEnabled = true;
            }
            let warning = adt.getControlByName("portraitWarning");
            if (warning)
                warning.alpha = 0.0;
        }
    }
    static setOrientation(adt) {
        if (adt !== undefined)
            this.currentAdt = adt;
        this.isLandscape = (this.screenRatio > 1.4) ? true : false;
        if (this.currentAdt !== undefined)
            this.updateGuiBasedOnOrientation(this.currentAdt);
    }
    ;
    static updateScreenRatio(engine) {
        this.screenWidth = engine.getRenderWidth(true);
        this.screenHeight = engine.getRenderHeight(true);
        this.screenRatio = this.screenWidth / this.screenHeight;
        this.setOrientation();
    }
    static createBottomBar(adt) {
        let bottomBarLeft = new gui_1.Image("bottomBarLeft", "/assets/UI/bottomBarLeft.svg");
        let bottomBarCenter = new gui_1.Image("bottomBarCenter", "/assets/UI/bottomBarCenter.svg");
        let bottomBarRight = new gui_1.Image("bottomBarRight", "/assets/UI/bottomBarRight.svg");
        let grid = new gui_1.Grid();
        grid.addRowDefinition(270, true);
        grid.addColumnDefinition(645, true);
        grid.addColumnDefinition(1.0, false);
        grid.addColumnDefinition(790, true);
        grid.width = 0.914;
        grid.heightInPixels = 270;
        grid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        grid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        grid.addControl(bottomBarLeft, 0, 0);
        grid.addControl(bottomBarCenter, 0, 1);
        grid.addControl(bottomBarRight, 0, 2);
        adt.addControl(grid);
        // add in portrait warning... to do add portrait mode UI
        // let portraitWarning = new TextBlock ("portraitWarning", "Please play this game in landscape mode".toUpperCase());
        // this.setFont(portraitWarning, true, true);
        // portraitWarning.fontSize = "40px";
        // portraitWarning.color = "white";
        // portraitWarning.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        // portraitWarning.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        // portraitWarning.width = 1.0;
        // portraitWarning.height = 1.0;
        // portraitWarning.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        // portraitWarning.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        // portraitWarning.alpha = 0;
        // adt.addControl(portraitWarning);
    }
    static createTextPanel(parentGrid) {
        let textPanelUL = new gui_1.Image("bottomBarLeft", "/assets/UI/textPanelUL.svg");
        let textPanelUC = new gui_1.Image("bottomBarCenter", "/assets/UI/textPanelUC.svg");
        let textPanelUR = new gui_1.Image("bottomBarRight", "/assets/UI/textPanelUR.svg");
        let textPanelCL = new gui_1.Image("bottomBarLeft", "/assets/UI/textPanelCL.svg");
        let textPanelCC = new gui_1.Image("bottomBarCenter", "/assets/UI/textPanelCC.svg");
        let textPanelCR = new gui_1.Image("bottomBarRight", "/assets/UI/textPanelCR.svg");
        let textPanelLL = new gui_1.Image("bottomBarLeft", "/assets/UI/textPanelLL.svg");
        let textPanelLC = new gui_1.Image("bottomBarCenter", "/assets/UI/textPanelLC.svg");
        let textPanelLR = new gui_1.Image("bottomBarRight", "/assets/UI/textPanelLR.svg");
        let grid = new gui_1.Grid();
        grid.clipChildren = false;
        grid.addRowDefinition(170, true);
        grid.addRowDefinition(1.0, false);
        grid.addRowDefinition(220, true);
        grid.addColumnDefinition(340, true);
        grid.addColumnDefinition(1.0, false);
        grid.addColumnDefinition(440, true);
        grid.topInPixels = 50;
        grid.width = 0.9;
        grid.height = 0.8;
        grid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        grid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        grid.addControl(textPanelUL, 0, 0);
        grid.addControl(textPanelUC, 0, 1);
        grid.addControl(textPanelUR, 0, 2);
        grid.addControl(textPanelCL, 1, 0);
        grid.addControl(textPanelCC, 1, 1);
        grid.addControl(textPanelCR, 1, 2);
        grid.addControl(textPanelLL, 2, 0);
        grid.addControl(textPanelLC, 2, 1);
        grid.addControl(textPanelLR, 2, 2);
        parentGrid.addControl(grid, 0, 1);
        return grid;
    }
    static createPageTitle(title, grid) {
        let textBlock = new gui_1.TextBlock("panelTitle", title.toUpperCase());
        this.setFont(textBlock, true, true);
        textBlock.fontSize = 35;
        textBlock.color = "#a6fffa";
        textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        textBlock.topInPixels = 5;
        grid.addControl(textBlock, 0, 1);
    }
    static debugCell(grid, cell) {
        let rect = new gui_1.Rectangle();
        rect.background = "red";
        rect.color = "orange";
        rect.thickness = 3;
        rect.width = 1.0;
        rect.height = 1.0;
        rect.alpha = 0.3;
        grid.addControl(rect, cell.x, cell.y);
    }
    static createRadioButton(checked) {
        let radio = new gui_1.RadioButton();
        radio.color = "#ffffff";
        radio.background = "#688899";
        radio.thickness = 2;
        radio.shadowOffsetX = 2;
        radio.shadowOffsetY = 2;
        radio.shadowColor = "black";
        radio.height = 0.4;
        radio.checkSizeRatio = 0.5;
        radio.fixedRatio = 1.0;
        radio.leftInPixels = 20;
        radio.isChecked = (checked) ? checked : false;
        return radio;
    }
    static createCheckbox() {
        let checkbox = new gui_1.Checkbox();
        checkbox.color = "#ffffff";
        checkbox.background = "#688899";
        checkbox.thickness = 2;
        checkbox.shadowOffsetX = 2;
        checkbox.shadowOffsetY = 2;
        checkbox.shadowColor = "black";
        checkbox.height = 0.4;
        checkbox.fixedRatio = 1.0;
        checkbox.checkSizeRatio = 0.5;
        checkbox.leftInPixels = 20;
        return checkbox;
    }
    static createSlider(min, max, startValue) {
        let slider = new gui_1.Slider();
        slider.minimum = min;
        slider.maximum = max;
        slider.height = 0.35;
        slider.color = "#269ad4";
        slider.background = "#688899";
        slider.thumbColor = "#a6fffa";
        slider.shadowOffsetX = 2;
        slider.shadowOffsetY = 2;
        slider.shadowColor = "black";
        slider.isThumbCircle = true;
        slider.value = (startValue) ? startValue : min;
        return slider;
    }
    static createStatText(string) {
        let textBlock = new gui_1.TextBlock("", string);
        this.setFont(textBlock, true, true);
        textBlock.color = "#a6fffa";
        textBlock.fontSize = 24;
        textBlock.leftInPixels = 20;
        textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        return textBlock;
    }
    static createSplashText(string) {
        let textBlock = new gui_1.TextBlock("", string.toUpperCase());
        this.setFont(textBlock, true, true);
        textBlock.color = "#a6fffa";
        textBlock.fontSize = 30;
        textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        return textBlock;
    }
    static createScreenshotText(grid, cell, string, leftAlign) {
        let textBlock = new gui_1.TextBlock("", string.toUpperCase());
        this.setFont(textBlock, true, true);
        textBlock.color = "white";
        textBlock.fontSize = 16;
        textBlock.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
        textBlock.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        if (leftAlign) {
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        }
        else {
            textBlock.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        }
        grid.addControl(textBlock, cell.x, cell.y);
        return textBlock;
    }
    static createScreenshotGrid() {
        let grid = new gui_1.Grid();
        for (let i = 0; i < 9; i++) {
            grid.addRowDefinition(0.1, false);
        }
        grid.addColumnDefinition(0.4, false);
        grid.addColumnDefinition(0.6, false);
        grid.height = 0.4;
        grid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        return grid;
    }
    static createRecapGrid() {
        let grid = new gui_1.Grid();
        grid.addRowDefinition(0.1, false);
        grid.addRowDefinition(0.9, false);
        grid.addColumnDefinition(1.0, false);
        grid.topInPixels = 250;
        grid.height = 0.6;
        grid.width = 0.9;
        grid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        grid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        return grid;
    }
    static createStatsGrid() {
        let grid = new gui_1.Grid();
        grid.addColumnDefinition(0.5, false);
        grid.addColumnDefinition(0.5, false);
        grid.width = 1.0;
        grid.topInPixels = 0;
        grid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        grid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        return grid;
    }
    static createParametersGrid() {
        let grid = new gui_1.Grid();
        grid.addColumnDefinition(0.4, false);
        grid.addColumnDefinition(0.6, false);
        grid.width = 0.6;
        grid.topInPixels = -100;
        grid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        return grid;
    }
    static createParameter(grid, label, controlType, currentValue) {
        let rowHeight = 60;
        grid.addRowDefinition(rowHeight, true);
        let totalRows = grid.rowCount;
        grid.heightInPixels = totalRows * rowHeight;
        let parameterLabel = new gui_1.TextBlock("", label.toUpperCase());
        this.setFont(parameterLabel, true, true);
        parameterLabel.color = "white";
        parameterLabel.fontSize = 24;
        parameterLabel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        parameterLabel.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        controlType.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        if (controlType.typeName === "Checkbox") {
            let checkbox = controlType;
            if (currentValue)
                checkbox.isChecked = Boolean(currentValue.valueOf());
            grid.addControl(checkbox, totalRows - 1, 1);
        }
        if (controlType.typeName === "Slider") {
            let sliderGrid = new gui_1.Grid();
            sliderGrid.addRowDefinition(1.0, false);
            sliderGrid.addColumnDefinition(0.1, false);
            sliderGrid.addColumnDefinition(0.9, false);
            let sliderValue = new gui_1.TextBlock();
            this.setFont(sliderValue, true, true);
            sliderValue.color = "white";
            sliderValue.fontSize = 24;
            let slider = controlType;
            slider.onValueChangedObservable.add(() => {
                sliderValue.text = Math.floor(slider.value * 100);
            });
            sliderGrid.addControl(sliderValue, 0, 0);
            sliderGrid.addControl(slider, 0, 1);
            grid.addControl(sliderGrid, totalRows - 1, 1);
            if (currentValue)
                slider.value = currentValue;
        }
        if (controlType.typeName === "TextBlock") {
            grid.addControl(controlType, totalRows - 1, 1);
        }
        grid.addControl(parameterLabel, totalRows - 1, 0);
        return controlType;
    }
    static setFont(element, isBold, hasShadow) {
        element.fontFamily = this.guiFont.family;
        if (isBold) {
            element.fontWeight = this.guiFont.bold;
        }
        else {
            element.fontWeight = this.guiFont.book;
        }
        if (hasShadow) {
            element.shadowOffsetX = 2;
            element.shadowOffsetY = 2;
            element.shadowColor = "black";
        }
        element.fontStyle = this.guiFont.style;
    }
    static addButton(label, panel) {
        var button = gui_1.Button.CreateImageButton("button", label.toUpperCase(), "/assets/UI/menuButton.svg");
        let image = button.image;
        image.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        image.width = "400px";
        image.height = "200px";
        image.topInPixels = 0;
        let text = button.textBlock;
        text.width = "400px";
        text.zIndex = 10;
        text.topInPixels = -5;
        text.paddingRightInPixels = 50;
        text.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        text.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
        button.fontSize = "26px";
        button.width = "400px";
        button.height = "100px";
        button.color = "#a6fffa";
        button.thickness = 0;
        if (this.isLandscape) {
            button.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        }
        else {
            button.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        }
        this.setFont(button, true, false);
        button.onPointerEnterObservable.add(() => {
            image.topInPixels = -100;
            button.color = "#ffffff";
        });
        button.onPointerOutObservable.add(() => {
            image.topInPixels = 0;
            button.color = "#a6fffa";
        });
        panel.addControl(button);
        return button;
    }
    static formatButtonGrid(grid) {
        grid.addRowDefinition(1.0, false);
        grid.addRowDefinition(140, true);
        grid.addColumnDefinition(0.23, false);
        grid.addColumnDefinition(0.77, false);
        grid.width = 0.914;
        grid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
    }
}
exports.GuiFramework = GuiFramework;
GuiFramework.guiFont = {
    family: "magistral, sans-serif",
    book: "300",
    bold: "700",
    style: "normal"
};
GuiFramework.ratioBreakPoint = 1.4;
//# sourceMappingURL=GuiFramework.js.map