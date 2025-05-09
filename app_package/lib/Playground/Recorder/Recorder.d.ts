import { ShipManager } from "../Ship";
import { ExplosionManager } from "../FX/Explosion";
import { SparksEffects } from "../FX/SparksEffect";
import { ShotManager } from "../Shot";
import { MissileManager } from "../Missile";
import { TrailManager } from "../FX/Trail";
export declare class Recorder {
    private _recordActive;
    private _shipManager;
    private _explosionManager;
    private _sparksEffects;
    private _missileManager;
    private _trailManager;
    private _shotManager;
    private _availableFrames;
    private _maxFrames;
    private _head;
    private _recordFrames;
    private _playbackFrame;
    private _playbackSpeed;
    private _playingBack;
    private _whenDone;
    _trailVisibilityMask: number;
    private _lastFrame;
    constructor(shipManager: ShipManager, explosionManager: ExplosionManager, sparksEffects: SparksEffects, shotManager: ShotManager, missileManager: MissileManager, trailManager: TrailManager, maxFrames: number);
    setRecordActive(recordActive: boolean): void;
    getAvailableFrames(): number;
    tick(): void;
    applyFrame(frameIndex: number): void;
    refreshFrame(): void;
    playback(speed: number, whenDone: () => void): void;
    stop(): void;
    dispose(): void;
    private _getEffectiveIndex;
    private _increaseStore;
}
//# sourceMappingURL=Recorder.d.ts.map