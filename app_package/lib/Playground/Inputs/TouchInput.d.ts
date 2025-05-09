import { Observable } from "@babylonjs/core";
import { AdvancedDynamicTexture, Container, Ellipse, TextBlock, Vector2WithInfo } from "@babylonjs/gui";
import { ShipManager } from "../Ship";
declare class TouchButton {
    container: Container;
    text: TextBlock;
    circle: Ellipse;
    onPointerDownObservable: Observable<Vector2WithInfo>;
    onPointerUpObservable: Observable<Vector2WithInfo>;
    constructor(name: string, text: string, adt: AdvancedDynamicTexture);
    set color(color: string);
    get color(): string;
    setSize(size: number): void;
}
export declare class TouchInput {
    _adt: AdvancedDynamicTexture;
    _shipManager: ShipManager;
    _fireButton: TouchButton;
    _missileButton: TouchButton;
    _burstButton: TouchButton;
    _brakeButton: TouchButton;
    _flipButton: TouchButton;
    _leftThumbContainer: Ellipse;
    _leftInnerThumbContainer: Ellipse;
    _leftPuck: Ellipse;
    _xAddPos: number;
    _yAddPos: number;
    constructor(adt: AdvancedDynamicTexture, shipManager: ShipManager);
    tick(): void;
}
export {};
//# sourceMappingURL=TouchInput.d.ts.map