import { Scene } from "@babylonjs/core";
export declare class Input {
    dx: number;
    dy: number;
    shooting: boolean;
    launchMissile: boolean;
    burst: boolean;
    breaking: boolean;
    immelmann: boolean;
    constrainInput(): void;
}
export declare class InputManager {
    private static _scene;
    private static _keyboardObserver;
    static input: Input;
    private static _canvas;
    static deltaTime: number;
    static isTouch: boolean;
    constructor(scene: Scene, canvas: HTMLCanvasElement);
    static mouseMove(e: any): void;
    static changeCallback(e: any): void;
    static disablePointerLock(): void;
    static setupPointerLock(): void;
    dispose(): void;
}
//# sourceMappingURL=Input.d.ts.map