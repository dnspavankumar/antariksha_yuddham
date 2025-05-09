import { State } from "./State";
import { Nullable } from "@babylonjs/core";
import { Ship } from "../Ship";
import { Assets } from "../Assets";
export declare class PhotoMode extends State {
    ship: Nullable<Ship>;
    private _gameCamera;
    private _zeroCamera;
    private _photoCamera;
    private _photoArcRotateCamera;
    private _photoFreeCamera;
    private _scene;
    private _recorder;
    private _canvas;
    private _hotkeyObservable;
    assets: Nullable<Assets>;
    private sunCamera;
    private _renderObserver;
    exit(): void;
    private _clearPP;
    enter(): void;
    private _addPlaybackButton;
    private _bindArcRotateCamera;
    private _bindFreeCamera;
}
//# sourceMappingURL=PhotoMode.d.ts.map