import { AdvancedDynamicTexture, StackPanel } from "@babylonjs/gui";
import { Nullable } from "@babylonjs/core";
export declare class State {
    static currentState: Nullable<State>;
    protected _adt: Nullable<AdvancedDynamicTexture>;
    constructor();
    static setCurrent(newState: State): void;
    exit(): void;
    enter(): void;
    protected _addText(text: string, panel: StackPanel): void;
    private _resizeListener;
}
//# sourceMappingURL=State.d.ts.map