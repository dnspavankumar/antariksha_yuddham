import { Engine, Vector2 } from "@babylonjs/core";
import { Control, Button, Grid, StackPanel, AdvancedDynamicTexture, TextBlock, Slider, Checkbox, RadioButton } from "@babylonjs/gui";
export declare class GuiFramework {
    static guiFont: {
        family: string;
        book: string;
        bold: string;
        style: string;
    };
    static isLandscape: boolean;
    static screenWidth: number;
    static screenHeight: number;
    static screenRatio: number;
    static ratioBreakPoint: number;
    static currentAdt: AdvancedDynamicTexture;
    static updateGuiBasedOnOrientation(adt: AdvancedDynamicTexture): void;
    static setOrientation(adt?: AdvancedDynamicTexture): void;
    static updateScreenRatio(engine: Engine): void;
    static createBottomBar(adt: AdvancedDynamicTexture): void;
    static createTextPanel(parentGrid: Grid): Grid;
    static createPageTitle(title: string, grid: Grid): void;
    static debugCell(grid: Grid, cell: Vector2): void;
    static createRadioButton(checked?: boolean): RadioButton;
    static createCheckbox(): Checkbox;
    static createSlider(min: number, max: number, startValue?: number): Slider;
    static createStatText(string: string): TextBlock;
    static createSplashText(string: string): TextBlock;
    static createScreenshotText(grid: Grid, cell: Vector2, string: string, leftAlign?: boolean): TextBlock;
    static createScreenshotGrid(): Grid;
    static createRecapGrid(): Grid;
    static createStatsGrid(): Grid;
    static createParametersGrid(): Grid;
    static createParameter(grid: Grid, label: string, controlType: Control, currentValue?: number): Control;
    static setFont(element: any, isBold: boolean, hasShadow: boolean): void;
    static addButton(label: string, panel: StackPanel): Button;
    static formatButtonGrid(grid: Grid): void;
}
//# sourceMappingURL=GuiFramework.d.ts.map