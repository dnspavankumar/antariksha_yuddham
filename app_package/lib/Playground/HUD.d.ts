import { Engine, Scene } from "@babylonjs/core";
import { ShipManager, Ship } from './Ship';
import { Assets } from "./Assets";
export declare class HUD {
    private _adt;
    private _enemiesRemaining;
    private _enemiesRemainingLabel;
    private _alliesRemaining;
    private _alliesRemainingLabel;
    private _shipManager;
    private _hudPanels;
    private _parameters;
    private _touchInput;
    private _aiCounter;
    private _aiCounterGrid;
    constructor(shipManager: ShipManager, assets: Assets, scene: Scene, players: Array<Ship>);
    private _resizeListener;
    tick(engine: Engine, gameSpeed: number, players: Array<Ship>): void;
    private makeParametersPanel;
    dispose(): void;
}
//# sourceMappingURL=HUD.d.ts.map