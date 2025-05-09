import { Scene, Engine, Nullable, GlowLayer } from "@babylonjs/core";
import { Assets } from "../Assets";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
export declare class Diorama {
    private _scene;
    private _camera;
    private _cameraDummy;
    private _localTime;
    private _start;
    private _end;
    private _image;
    private _enabled;
    private _ship;
    constructor(scene: Scene, assets: Assets, engine: Engine, glowLayer: GlowLayer);
    private _createGUI;
    private _destroyGUI;
    setEnable(adt?: Nullable<AdvancedDynamicTexture>): void;
}
//# sourceMappingURL=Diorama.d.ts.map