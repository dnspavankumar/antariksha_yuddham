import { Nullable, Vector3, Quaternion, AbstractMesh, Mesh, Scene, Sound, TransformNode, NodeMaterial, InputBlock, GlowLayer } from "@babylonjs/core";
import { Agent } from "./Agent";
import { Input } from "./Inputs/Input";
import { MissileManager } from "./Missile";
import { ShotManager } from "./Shot";
import { Assets } from "./Assets";
import { Trail, TrailManager } from "./FX/Trail";
import { SparksEffects } from "./FX/SparksEffect";
import { ShipCamera } from "./ShipCamera";
import { TextBlock } from "@babylonjs/gui";
import { ExplosionManager } from "./FX/Explosion";
import { World } from "./World";
import { GameDefinition } from "./Game";
declare enum AIState {
    WANDER = "wander",
    CHASE = "chase",
    EVADE = "evade",
    RETURN = "return",
    AVOID = "Avoid Asteroid"
}
declare enum ShipManeuver {
    NONE = -1,
    IMMELMANN = 0
}
export declare class Statistics {
    damageDealt: number;
    damageTaken: number;
    shipsDestroyed: number;
    timeOfBattle: number;
    shotFired: number;
    shotHitting: number;
    missilesFired: number;
    static alliesCrash: number;
    static enemiesCrash: number;
    addDamageDealt(): void;
    addDamageTaken(): void;
    addShipDestroyed(): void;
    addTimeOfBattle(time: number): void;
    addShotFired(): void;
    addShotHitting(): void;
    addMissilesFired(): void;
    static addCrashAlly(): void;
    static addCrashEnemy(): void;
}
export declare class Ship extends Agent {
    missileCooldown: number;
    roll: number;
    root: TransformNode;
    velocity: number;
    speedRatio: number;
    trail: Nullable<Trail>;
    isHuman: boolean;
    faction: number;
    cannonIndex: number;
    localEye: Vector3;
    localTarget: Vector3;
    shipMesh: Nullable<AbstractMesh>;
    cannonR: Nullable<Vector3>;
    cannonL: Nullable<Vector3>;
    life: number;
    bursting: number;
    bestPrey: number;
    bestPreyTime: number;
    targetSphere: Nullable<Mesh>;
    evadeTimer: number;
    state: AIState;
    dotToEnemy: number;
    dotToAlly: number;
    currentThusterPower: number;
    debugLabel: Nullable<TextBlock>;
    evadeTo: Vector3;
    maneuver: ShipManeuver;
    maneuverTimer: number;
    statistics: Nullable<Statistics>;
    shipCamera: Nullable<ShipCamera>;
    laserHit: Nullable<Sound>;
    laser: Nullable<Sound[]>;
    missileSfx: Nullable<Sound>;
    explosionSfx: Nullable<Sound[]>;
    shieldMain: Nullable<Mesh>;
    private _assets;
    shieldEffectMaterial: Nullable<NodeMaterial>;
    availableMissiles: number;
    lastDecal: Nullable<Mesh>;
    lastDecalTime: number;
    vortexPowerBlocks: InputBlock[];
    thrusterPowerBlocks: InputBlock[];
    private _glowLayer;
    constructor(assets: Assets, scene: Scene, glowLayer: GlowLayer);
    setThrusterPower(power: number): void;
    spawn(position: Vector3, quat: Quaternion, isHuman: boolean, faction: number, trailManager: TrailManager, life: number): void;
    static HandleThrustersShield(assets: Assets, ship: Nullable<Ship>, shipMesh: AbstractMesh, isValkyrie: boolean, defaultThrusterValue: number, glowLayer: GlowLayer): void;
    isValid(): boolean;
    tickEnabled(): void;
    fireMissile(missileManager: MissileManager, bestPrey: Ship): Nullable<TransformNode>;
    dispose(): void;
}
export declare class ShipManager {
    ships: Ship[];
    private _gameDefinition;
    shipIndexToFollow: number;
    _missileManager: MissileManager;
    _shotManager: ShotManager;
    private _trailManager;
    time: number;
    _scene: Scene;
    private _tmpVec3;
    private _assets;
    private _tempMatrix;
    private _avoidPos;
    private static _tmpMatrix;
    constructor(missileManager: MissileManager, shotManager: ShotManager, assets: Assets, trailManager: TrailManager, scene: Scene, maxShips: number, gameDefinition: GameDefinition, glowLayer: GlowLayer);
    spawnShip(position: Vector3, quat: Quaternion, isHuman: boolean, faction: number): Nullable<Ship>;
    destroyShip(shipIndex: number): void;
    findBestPreyFor(index: number): number;
    static dotToTarget(ship: Ship, position: Vector3): number;
    howManyTargeting(targetIndex: number): number;
    tick(canShoot: boolean, humanInputs: Input, deltaTime: number, gameSpeed: number, sparksEffects: SparksEffects, explosionManager: ExplosionManager, world: World, targetGameSpeed: number): void;
    private _tickAsteroids;
    private _tickEndOfLife;
    private _tickGeneric;
    private _tickShipVsMissile;
    private _tickShipVsShots;
    private _tickHuman;
    private _tickAI;
    dispose(): void;
}
export {};
//# sourceMappingURL=Ship.d.ts.map