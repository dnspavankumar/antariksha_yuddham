import { Gamepad } from "@babylonjs/core";
import { Input } from './Input';
export declare class GamepadInput {
    static gamepads: GamepadInput[];
    _gamepad: Gamepad;
    _input: Input;
    static initialize(): void;
    constructor(gamepad: Gamepad, input: Input);
    tick(): void;
    dispose(): void;
}
//# sourceMappingURL=GamepadInput.d.ts.map