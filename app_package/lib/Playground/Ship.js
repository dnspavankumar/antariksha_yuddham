"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipManager = exports.Ship = exports.Statistics = void 0;
const core_1 = require("@babylonjs/core");
const Agent_1 = require("./Agent");
const Missile_1 = require("./Missile");
const Shot_1 = require("./Shot");
const Parameters_1 = require("./Parameters");
const States_1 = require("./States/States");
var AIState;
(function (AIState) {
    AIState["WANDER"] = "wander";
    AIState["CHASE"] = "chase";
    AIState["EVADE"] = "evade";
    AIState["RETURN"] = "return";
    AIState["AVOID"] = "Avoid Asteroid";
})(AIState || (AIState = {}));
var ShipManeuver;
(function (ShipManeuver) {
    ShipManeuver[ShipManeuver["NONE"] = -1] = "NONE";
    ShipManeuver[ShipManeuver["IMMELMANN"] = 0] = "IMMELMANN";
})(ShipManeuver || (ShipManeuver = {}));
const factions = [
    {
        trail: {
            color: new core_1.Color3(0.64, 0.42, 0.15)
        }
    },
    {
        trail: {
            color: new core_1.Color3(0.12, 0.56, 0.62)
        }
    }
];
class Statistics {
    constructor() {
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.shipsDestroyed = 0;
        this.timeOfBattle = 0;
        this.shotFired = 0;
        this.shotHitting = 0;
        this.missilesFired = 0;
    }
    addDamageDealt() {
        this.damageDealt++;
    }
    addDamageTaken() {
        this.damageTaken++;
    }
    addShipDestroyed() {
        this.shipsDestroyed++;
    }
    addTimeOfBattle(time) {
        this.timeOfBattle += time;
    }
    addShotFired() {
        this.shotFired++;
    }
    addShotHitting() {
        this.shotHitting++;
    }
    addMissilesFired() {
        this.missilesFired++;
    }
    static addCrashAlly() {
        this.alliesCrash++;
    }
    static addCrashEnemy() {
        this.enemiesCrash++;
    }
}
exports.Statistics = Statistics;
Statistics.alliesCrash = 0;
Statistics.enemiesCrash = 0;
class Ship extends Agent_1.Agent {
    constructor(assets, scene, glowLayer) {
        var _a, _b, _c, _d;
        super();
        this.missileCooldown = 0;
        this.roll = 0;
        this.velocity = 0;
        this.speedRatio = 0;
        this.trail = null;
        this.isHuman = false;
        this.faction = 0;
        this.cannonIndex = 0;
        this.localEye = new core_1.Vector3(0, 0, 0);
        this.localTarget = new core_1.Vector3(0, 0, 0);
        this.shipMesh = null;
        this.cannonR = null;
        this.cannonL = null;
        this.life = -1;
        this.bursting = 0;
        this.bestPrey = -1;
        this.bestPreyTime = 0;
        this.evadeTimer = 0;
        this.state = AIState.WANDER;
        this.dotToEnemy = 0;
        this.dotToAlly = 0;
        this.currentThusterPower = 1;
        this.debugLabel = null;
        this.evadeTo = core_1.Vector3.Zero();
        this.maneuver = ShipManeuver.NONE;
        this.maneuverTimer = 0;
        this.statistics = null;
        this.shipCamera = null;
        this.laserHit = null;
        this.laser = null;
        this.missileSfx = null;
        this.explosionSfx = null;
        this.shieldMain = null;
        this.shieldEffectMaterial = null;
        this.availableMissiles = 0;
        this.lastDecal = null;
        this.lastDecalTime = 0;
        this.vortexPowerBlocks = [];
        this.thrusterPowerBlocks = [];
        this._assets = assets;
        this.targetSphere = null;
        this._glowLayer = glowLayer;
        this.root = new core_1.TransformNode("ShipRoot", scene);
        this.root.rotationQuaternion = core_1.Quaternion.Identity();
        this.shieldEffectMaterial = assets.shieldEffectMaterial;
        if (Parameters_1.Parameters.enableAudio) {
            this.laserHit = (_a = this._assets.audio) === null || _a === void 0 ? void 0 : _a.laserHitSound.clone();
            this.missileSfx = (_b = this._assets.audio) === null || _b === void 0 ? void 0 : _b.missileFireSound.clone();
            this.explosionSfx = [(_c = this._assets.audio) === null || _c === void 0 ? void 0 : _c.explosionSounds[0].clone(),
                (_d = this._assets.audio) === null || _d === void 0 ? void 0 : _d.explosionSounds[1].clone()];
        }
        this.tickEnabled();
    }
    setThrusterPower(power) {
        this.currentThusterPower = this.currentThusterPower + (power - this.currentThusterPower) * 0.02;
        this.vortexPowerBlocks.forEach((i) => {
            i.value = this.currentThusterPower;
        });
        this.thrusterPowerBlocks.forEach((i) => {
            i.value = this.currentThusterPower;
        });
    }
    spawn(position, quat, isHuman, faction, trailManager, life) {
        var _a, _b;
        this.root.position = position;
        this.root.rotationQuaternion = quat;
        this.quat = quat.clone();
        this.isHuman = isHuman;
        this.faction = faction;
        this.life = life;
        const isValkyrie = !faction;
        var clone;
        if (this._assets.valkyrie && this._assets.raider) {
            if (isValkyrie) {
                clone = this._assets.valkyrie.clone("valkyrie", null);
            }
            else {
                clone = this._assets.raider.clone("raider", null);
            }
        }
        if (clone) {
            this.shipMesh = clone;
            this.shipMesh.parent = this.root;
            this.shipMesh.scaling = this.shipMesh.scaling.scale(25);
        }
        else {
            this.shipMesh = new core_1.AbstractMesh("null");
        }
        this.cannonR = isValkyrie ? this._assets.valkyriecannonR : this._assets.raidercannonR;
        this.cannonL = isValkyrie ? this._assets.valkyriecannonL : this._assets.raidercannonL;
        if (isHuman) {
            this.statistics = new Statistics;
        }
        this.trail = trailManager.spawnTrail(position, isValkyrie ? 1 : 2);
        if (this.trail) {
            this.trail.setParameters(factions[faction].trail.color, 1);
            this.trail.setVisible(!isHuman);
        }
        if (this.laser && this.laserHit) {
            this.laser.forEach((laser) => laser.attachToMesh(this.shipMesh));
            this.laserHit.attachToMesh(this.root);
        }
        if (Parameters_1.Parameters.enableAudio) {
            const lasers = isHuman ? (_a = this._assets.audio) === null || _a === void 0 ? void 0 : _a.heroLaserSounds : (_b = this._assets.audio) === null || _b === void 0 ? void 0 : _b.raiderLaserSounds;
            if (lasers) {
                this.laser = [lasers[0].clone(),
                    lasers[1].clone(),
                    lasers[2].clone()];
            }
        }
        Ship.HandleThrustersShield(this._assets, this, this.shipMesh, isValkyrie, 0, this._glowLayer);
        this.availableMissiles = isValkyrie ? 8 : 0;
        this.tickEnabled();
    }
    static HandleThrustersShield(assets, ship, shipMesh, isValkyrie, defaultThrusterValue, glowLayer) {
        let thrusters = [];
        shipMesh.getChildTransformNodes(false).forEach((m) => {
            if (m.name.endsWith(isValkyrie ? "valkyrieShield_mesh" : "raiderShield_mesh")) {
                if (ship) {
                    ship.shieldMain = m;
                    ship.shieldMain.parent = null;
                    ship.shieldMain.rotation.set(0, Math.PI, 0);
                    if (isValkyrie) {
                        ship.shieldMain.position.set(0, 0.015 * 25 * 1.85, 0);
                        ship.shieldMain.scaling.set(25 * 1.85, 25 * 1.85, 25 * 1.85);
                    }
                    else {
                        ship.shieldMain.position.set(0, -0.009 * 25, 0.02 * 25 * 3.718);
                        ship.shieldMain.scaling.set(25 * 5.451, 25 * 1, 25 * 3.718);
                    }
                    ship.shieldMain.scaling.multiplyInPlace(new core_1.Vector3(-1, 1, 1));
                    ship.shieldMain.setEnabled(false);
                }
            }
            if (m.name.endsWith("valkyrie_thruster_L1") ||
                m.name.endsWith("valkyrie_thruster_L2") ||
                m.name.endsWith("valkyrie_thruster_R1") ||
                m.name.endsWith("valkyrie_thruster_R2") ||
                m.name.endsWith("raider_thruster_L") ||
                m.name.endsWith("raider_thruster_R")) {
                thrusters.push(m);
            }
        });
        // clone thrusters
        if (ship) {
            ship.vortexPowerBlocks = [];
            ship.thrusterPowerBlocks = [];
        }
        thrusters.forEach((thruster) => {
            var _a, _b, _c;
            let thrusterMesh = (_a = assets.thrusterMesh) === null || _a === void 0 ? void 0 : _a.clone("thruster", thruster);
            if (assets.thrusterShader && assets.vortexShader) {
                const thrusterMat = assets.thrusterShader.clone("thrusterMat_" + thruster.name);
                if (thrusterMat && thrusterMesh) {
                    thrusterMesh.material = thrusterMat;
                    //GLOW LAYER ISSUE
                    //glowLayer.referenceMeshToUseItsOwnMaterial(thrusterMesh);
                    if (thrusterMat) {
                        thrusterMat.getBlockByName("rand").value = new core_1.Vector2(Math.random(), Math.random());
                        const thrusterPowerBlock = thrusterMat.getBlockByName("power");
                        thrusterPowerBlock.value = defaultThrusterValue;
                        if (ship) {
                            ship.thrusterPowerBlocks.push(thrusterPowerBlock);
                        }
                        if (isValkyrie) {
                            thrusterMat.getBlockByName("coreColor").value = core_1.Color3.FromInts(211, 20, 20);
                            thrusterMat.getBlockByName("midColor").value = core_1.Color3.FromInts(211, 100, 20);
                            thrusterMat.getBlockByName("sparkColor").value = core_1.Color3.FromInts(216, 168, 48);
                            thrusterMat.getBlockByName("afterburnerColor").value = core_1.Color3.FromInts(229, 13, 248);
                        }
                        else {
                            thrusterMat.getBlockByName("coreColor").value = core_1.Color3.FromInts(24, 122, 156);
                            thrusterMat.getBlockByName("midColor").value = core_1.Color3.FromInts(49, 225, 230);
                            thrusterMat.getBlockByName("sparkColor").value = core_1.Color3.FromInts(48, 216, 167);
                            thrusterMat.getBlockByName("afterburnerColor").value = core_1.Color3.FromInts(13, 248, 168);
                        }
                    }
                }
                if (isValkyrie) {
                    let vortexMesh = (_b = assets.vortexMesh) === null || _b === void 0 ? void 0 : _b.clone("vortex", thruster);
                    const vortexMat = (_c = assets.vortexShader) === null || _c === void 0 ? void 0 : _c.clone("vortexMat_" + thruster.name);
                    if (vortexMat && vortexMesh) {
                        vortexMesh.material = vortexMat;
                        //GLOW LAYER ISSUE
                        //glowLayer.referenceMeshToUseItsOwnMaterial(vortexMesh);
                        vortexMat.getBlockByName("rand").value = new core_1.Vector2(Math.random(), Math.random());
                        const vortexPowerBlock = vortexMat.getBlockByName("power");
                        vortexPowerBlock.value = defaultThrusterValue;
                        if (ship) {
                            ship.vortexPowerBlocks.push(vortexPowerBlock);
                        }
                        if (thruster.name.endsWith("valkyrie_thruster_L1") || thruster.name.endsWith("valkyrie_thruster_L2")) {
                            vortexMat.getBlockByName("direction").value = 1;
                        }
                        else {
                            vortexMat.getBlockByName("direction").value = -1;
                        }
                    }
                }
            }
        });
    }
    isValid() {
        return this.life > 0;
    }
    tickEnabled() {
        var _a;
        (_a = this.shipMesh) === null || _a === void 0 ? void 0 : _a.setEnabled(this.isValid());
    }
    fireMissile(missileManager, bestPrey) {
        if (!this.shipMesh) {
            return null;
        }
        const missileName = "valkyrie_missileMount" + this.availableMissiles;
        const missileTransform = this.shipMesh.getChildTransformNodes(false, (node) => { return node.name.endsWith(missileName); })[0];
        if (!missileTransform) {
            return null;
        }
        const worldPosition = new core_1.Vector3;
        const worldOrientation = new core_1.Quaternion;
        missileTransform.computeWorldMatrix(true);
        missileTransform.getWorldMatrix().decompose(undefined, worldOrientation, worldPosition);
        missileTransform.parent = null;
        missileTransform.getChildMeshes()[0].position.scaleInPlace(25);
        missileTransform.getChildMeshes()[0].rotationQuaternion = null;
        missileTransform.getChildMeshes()[0].rotation.setAll(0);
        missileTransform.getChildMeshes()[0].scaling = new core_1.Vector3(25, 25, 25);
        missileTransform.position = worldPosition;
        missileTransform.scaling.setAll(1);
        missileTransform.rotation.setAll(0);
        missileTransform.rotationQuaternion = worldOrientation;
        missileManager.fireMissile(worldPosition, worldOrientation, bestPrey, this, missileTransform);
        this.availableMissiles--;
        return missileTransform;
    }
    dispose() {
        var _a, _b, _c, _d, _e;
        this.root.dispose();
        (_a = this.shipMesh) === null || _a === void 0 ? void 0 : _a.dispose();
        if (this.trail) {
            this.trail.dispose();
        }
        if (this.targetSphere) {
            this.targetSphere.dispose();
        }
        if (this.debugLabel) {
            this.debugLabel.dispose();
        }
        if (Parameters_1.Parameters.enableAudio) {
            (_b = this.laserHit) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this.laser) === null || _c === void 0 ? void 0 : _c.forEach((laser) => laser.dispose());
            (_d = this.missileSfx) === null || _d === void 0 ? void 0 : _d.dispose();
            (_e = this.explosionSfx) === null || _e === void 0 ? void 0 : _e.forEach((explosion) => explosion.dispose());
        }
        if (this.shipCamera) {
            this.shipCamera.dispose();
        }
    }
}
exports.Ship = Ship;
class ShipManager {
    //private _glowLayer: GlowLayer;
    constructor(missileManager, shotManager, assets, trailManager, scene, maxShips, gameDefinition, glowLayer) {
        this.ships = new Array();
        this.shipIndexToFollow = 0;
        this.time = 0;
        this._tmpVec3 = new core_1.Vector3(0, 0, 0);
        this._tempMatrix = new core_1.Matrix();
        this._avoidPos = new core_1.Vector3();
        this._gameDefinition = gameDefinition;
        this._missileManager = missileManager;
        this._shotManager = shotManager;
        this._scene = scene;
        this._assets = assets;
        this._trailManager = trailManager;
        //this._glowLayer = glowLayer;
        for (let i = 0; i < maxShips; i++) {
            this.ships.push(new Ship(this._assets, this._scene, glowLayer));
        }
        Statistics.alliesCrash = 0;
        Statistics.enemiesCrash = 0;
    }
    spawnShip(position, quat, isHuman, faction) {
        for (let i = 0; i < this.ships.length; i++) {
            if (!this.ships[i].isValid()) {
                const ship = this.ships[i];
                const life = isHuman ? (faction ? this._gameDefinition.humanEnemiesLife : this._gameDefinition.humanAlliesLife) :
                    (faction ? this._gameDefinition.aiEnemiesLife : this._gameDefinition.aiAlliesLife);
                ship.spawn(position, quat, isHuman, faction, this._trailManager, life);
                return ship;
            }
        }
        // fatal error
        return null;
    }
    destroyShip(shipIndex) {
        var _a, _b;
        console.log(`destroying ${shipIndex}`);
        const ship = this.ships[shipIndex];
        this._shotManager.shots.forEach(shot => {
            if (shot.firedBy === ship) {
                shot.firedBy = undefined;
            }
        });
        (_a = ship.trail) === null || _a === void 0 ? void 0 : _a.invalidate();
        (_b = ship.shipMesh) === null || _b === void 0 ? void 0 : _b.setEnabled(false);
        ship.bursting = 0;
        this.ships.forEach(otherShip => {
            if (otherShip.isValid() && otherShip.bestPrey == shipIndex) {
                otherShip.bestPrey = -1;
                otherShip.bestPreyTime = 0;
            }
        });
    }
    findBestPreyFor(index) {
        const ships = this.ships;
        const ship = ships[index];
        let bestToChase = -1;
        let bestDot = Parameters_1.Parameters.AIPerceptionCone;
        ship.dotToEnemy = Parameters_1.Parameters.AIPerceptionCone;
        ship.dotToAlly = Parameters_1.Parameters.AIPerceptionCone;
        for (let other = 0; other < ships.length; other++) {
            if (!ships[other].isValid()) {
                continue;
            }
            if (ship.shipCamera) {
                const onScreen = ship.shipCamera.isOnScreen(ships[other].root.position);
                if (!onScreen) {
                    continue;
                }
            }
            if (other != index) {
                const dot = ShipManager.dotToTarget(ship, ships[other].root.position);
                if (ship.faction != ships[other].faction && dot > ship.dotToEnemy /*&& chaseDot < 0.997*/) {
                    if ((ship.isHuman || this.howManyTargeting(other) <= Parameters_1.Parameters.AIMaxTargets) && dot > bestDot) {
                        bestDot = dot;
                        bestToChase = other;
                    }
                    bestToChase = other;
                    ship.dotToEnemy = dot;
                }
                else if (ship.faction == ships[other].faction && dot > ship.dotToAlly) {
                    ship.dotToAlly = dot;
                }
            }
        }
        return bestToChase;
    }
    // tells you whether ship is aiming towards position
    // 1.0 = exactly facing shipB
    // -1.0 = facing away from shipB
    // 0.0 = perpendicular
    static dotToTarget(ship, position) {
        const chaseDir = position.subtract(ship.root.position);
        chaseDir.normalize();
        return core_1.Vector3.Dot(ship.forward, chaseDir);
    }
    howManyTargeting(targetIndex) {
        let count = 0;
        this.ships.forEach((ship, index) => {
            if (!ship.isHuman && index != targetIndex && ship.bestPrey == targetIndex)
                count++;
        });
        return count;
    }
    tick(canShoot, humanInputs, deltaTime, gameSpeed, sparksEffects, explosionManager, world, targetGameSpeed) {
        var _a, _b;
        if (gameSpeed <= 0.001) {
            return;
        }
        this.time += deltaTime;
        const ships = this.ships;
        for (var index = 0; index < ships.length; index++) {
            const ship = ships[index];
            ship.lastDecalTime -= deltaTime;
            if (ship.lastDecalTime < 0 && ship.lastDecal) {
                (_a = ship.lastDecal.material) === null || _a === void 0 ? void 0 : _a.dispose();
                ship.lastDecal.dispose();
                ship.lastDecal = null;
            }
            ship.tickEnabled();
            if (!ship.isValid()) {
                continue;
            }
            const input = ship.isHuman ? humanInputs : ship.input;
            (_b = ship.statistics) === null || _b === void 0 ? void 0 : _b.addTimeOfBattle(deltaTime);
            if (!ship.isHuman) {
                this._tickAI(ship, deltaTime, index, world);
            }
            else {
                this._tickHuman(ship, deltaTime, index);
            }
            this._tickGeneric(ship, input, deltaTime, gameSpeed, canShoot, targetGameSpeed);
            this._tickShipVsShots(ship, input, sparksEffects, explosionManager);
            this._tickShipVsMissile(ship, sparksEffects, explosionManager);
            if (ship.isHuman) {
                if (ship.missileCooldown <= 0) {
                    const bestToChase = this.findBestPreyFor(index);
                    if (bestToChase == ship.bestPrey) {
                        ship.bestPreyTime += deltaTime;
                    }
                    else {
                        ship.bestPreyTime = 0;
                    }
                    ship.bestPrey = bestToChase;
                }
                else {
                    ship.bestPrey = -1;
                    ship.bestPreyTime = 0;
                }
            }
            if (ship.isHuman) {
                if (this._assets.audio && this._assets.audio.thrusterSound.isReady()) {
                    this._assets.audio.thrusterSound.setVolume(Math.max(0, ship.bursting / 2));
                }
            }
            this._tickAsteroids(ship, world, explosionManager);
            this._tickEndOfLife(ship, index);
        }
    }
    _tickAsteroids(ship, world, explosionManager) {
        if (world.collideWithAsteroids(ship.root.position, 1.0)) {
            ship.life = -1;
            explosionManager.spawnExplosion(ship.root.position.clone(), ship.root.rotationQuaternion ? ship.root.rotationQuaternion : core_1.Quaternion.Identity());
            if (ship.faction) {
                Statistics.addCrashEnemy();
            }
            else {
                Statistics.addCrashAlly();
            }
        }
    }
    _tickEndOfLife(ship, index) {
        if (ship.life <= 0) {
            this._missileManager.invalidateMissileChasing(ship);
            if (ship.explosionSfx) {
                const rand = Math.floor(Math.random() * ship.explosionSfx.length);
                ship.explosionSfx[rand].setPosition(ship.position);
                ship.explosionSfx[rand].play();
            }
            if (ship.isHuman) {
                States_1.States.dead.ship = ship;
            }
            this.destroyShip(index);
        }
    }
    _tickGeneric(ship, input, deltaTime, gameSpeed, canShoot, targetGameSpeed) {
        var _a, _b;
        var wmat = ship.root.getWorldMatrix();
        const forward = new core_1.Vector3(wmat.m[8], wmat.m[9], wmat.m[10]);
        const right = new core_1.Vector3(wmat.m[0], wmat.m[1], wmat.m[2]);
        const up = new core_1.Vector3(wmat.m[4], wmat.m[5], wmat.m[6]);
        ship.forward = forward;
        ship.up = up;
        ship.right = right;
        if (ship.maneuver == ShipManeuver.NONE) {
            if (input.immelmann) {
                ship.maneuver = ShipManeuver.IMMELMANN;
                ship.maneuverTimer = Parameters_1.Parameters.ImmelmannDuration;
            }
        }
        else {
            if (ship.maneuver == ShipManeuver.IMMELMANN) {
                input.dx = 0;
                if (ship.maneuverTimer >= 600) {
                    input.dy -= 0.12;
                }
                else {
                    input.dy = 0;
                }
            }
            ship.maneuverTimer -= deltaTime;
            if (ship.maneuverTimer <= 0) {
                ship.maneuver = ShipManeuver.NONE;
            }
        }
        // restraint movement when in burst mode
        const constrainFactor = Math.min(1.1 - ship.bursting * 0.5, 1.) * gameSpeed;
        input.dx *= constrainFactor;
        input.dy *= constrainFactor;
        // orientation
        ship.roll = ship.roll + (input.dx - ship.roll) * 0.01 * gameSpeed;
        if (ship.maneuver == ShipManeuver.IMMELMANN) {
            // do a barel roll
            if (ship.maneuverTimer < 600) {
                ship.roll = Math.sin((ship.maneuverTimer / 600) * Math.PI * 0.5) * 0.2;
            }
        }
        const rx = core_1.Quaternion.RotationAxis(new core_1.Vector3(0, 1, 0), input.dx);
        const mat = this._tempMatrix;
        rx.toRotationMatrix(mat);
        const ry = core_1.Quaternion.RotationAxis(new core_1.Vector3(mat.m[0], mat.m[1], mat.m[2]), input.dy);
        ship.quat = ship.quat.multiply(rx).multiply(ry);
        ship.quat.normalize();
        ship.root.rotationQuaternion = core_1.Quaternion.Slerp(ship.root.rotationQuaternion ? ship.root.rotationQuaternion : core_1.Quaternion.Identity(), ship.quat, 0.05);
        //ship.roll *= 0.9;
        if (ship.shipMesh) {
            ship.shipMesh.rotationQuaternion = null;
            ship.shipMesh.rotation.z = ship.roll * 30;
            ship.shipMesh.rotation.y = Math.PI;
        }
        // position
        //ship.velocity = this.maxSpeed; // always moving
        ship.speedRatio = Math.min(ship.velocity / Parameters_1.Parameters.maxSpeed, 1.);
        if (ship.isHuman) {
            ship.setThrusterPower(input.burst ? 2 : (input.breaking ? 0 : 1));
        }
        else {
            ship.setThrusterPower(ship.faction ? 2 : 1);
        }
        //console.log(ship.speedRatio);
        if (true) // TODO humanInputs[1])
         {
            if (input.burst) {
                let currentAccel = Parameters_1.Parameters.maxAccel * (1.0 - ship.speedRatio);
                ship.velocity += currentAccel * 8;
            }
            else if (input.breaking) {
                ship.velocity *= 0.98;
            }
            else {
                let currentAccel = Parameters_1.Parameters.maxAccel * (0.5 - ship.speedRatio);
                ship.velocity += currentAccel * 8;
            }
        }
        ship.root.position.addInPlace(forward.scale(ship.velocity * gameSpeed));
        // damping
        //ship.velocity *= 0.99;
        // trail
        if (ship.trail && targetGameSpeed === 1) {
            ship.trail.append(ship.root.position);
            /*if (ship.isHuman) {
                const dest = ship.box.position.clone();
                dest.addInPlace(new Vector3(0,0,100));
                this._sparksEffect.CreateShot(dest, new Vector3(0,1,0), 1);
            }*/
            ship.trail.setVisible(!ship.isHuman);
        }
        // reset for next frame
        input.dx = 0;
        input.dy = 0;
        if (canShoot && input.shooting && deltaTime > 0.001) {
            this._shotManager.addShot(ship, wmat, ship.isHuman, ship.cannonIndex);
            (_a = ship.statistics) === null || _a === void 0 ? void 0 : _a.addShotFired();
            ship.cannonIndex = (ship.cannonIndex + 1) & 1;
            if (ship.laser) {
                const rand = Math.floor(Math.random() * ship.laser.length);
                ship.laser[rand].play();
            }
        }
        ship.missileCooldown = Math.max(ship.missileCooldown - deltaTime, 0);
        if (ship.bestPrey >= 0 && ship.bestPreyTime > Parameters_1.Parameters.timeToLockMissile && input.launchMissile && ship.missileCooldown <= 0) {
            if (this._assets.trailMaterial && ship.availableMissiles) {
                const missile = ship.fireMissile(this._missileManager, this.ships[ship.bestPrey]);
                (_b = ship.statistics) === null || _b === void 0 ? void 0 : _b.addMissilesFired();
                if (missile && ship.missileSfx) {
                    ship.missileSfx.attachToMesh(missile);
                    ship.missileSfx.play();
                }
            }
            ship.missileCooldown = Parameters_1.Parameters.missileCoolDownTime;
        }
        if (input.breaking) {
            ship.bursting = Math.max(ship.bursting - deltaTime * 0.001, -2.);
        }
        else if (input.burst) {
            ship.bursting = Math.min(ship.bursting + deltaTime * 0.001, 2.);
        }
        else {
            ship.bursting *= 0.98;
        }
    }
    _tickShipVsMissile(ship, sparksEffects, explosionManager) {
        var _a, _b, _c;
        // missile / ship
        for (let p = 0; p < this._missileManager.missiles.length; p++) {
            const missile = this._missileManager.missiles[p];
            if (!missile.isValid()) {
                continue;
            }
            if (missile.shipToChase == ship) {
                const dist = core_1.Vector3.DistanceSquared(missile.getPosition(), ship.root.position);
                if (dist < 200) {
                    ship.life -= this._gameDefinition.missileDamage;
                    (_a = ship.statistics) === null || _a === void 0 ? void 0 : _a.addDamageTaken();
                    missile.setTime(Missile_1.MISSILE_MAX_LIFE + 1);
                    // Ship died to missile
                    if (ship.life <= 0) {
                        explosionManager.spawnExplosion(ship.root.position.clone(), ship.root.rotationQuaternion ? ship.root.rotationQuaternion : core_1.Quaternion.Identity());
                        (_c = (_b = missile.firedBy) === null || _b === void 0 ? void 0 : _b.statistics) === null || _c === void 0 ? void 0 : _c.addShipDestroyed();
                    }
                }
            }
        }
    }
    _tickShipVsShots(ship, input, sparksEffects, explosionManager) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const ships = this.ships;
        // shot / ship
        var tmpPewpewPos = new core_1.Vector3();
        var pewpews = this._shotManager.shots;
        const matrices = this._shotManager.getMatrices();
        for (let p = 0; p < Shot_1.MAX_SHOTS; p++) {
            if (pewpews[p].ttl > 0 && pewpews[p].firedBy != ship) {
                tmpPewpewPos.set(matrices[p * 16 + 12], matrices[p * 16 + 13], matrices[p * 16 + 14]);
                const dist = core_1.Vector3.DistanceSquared(ship.root.position, tmpPewpewPos);
                if (dist <= 36) {
                    sparksEffects.addShot(ship.root.position, ship.root.rotationQuaternion ? ship.root.rotationQuaternion : core_1.Quaternion.Identity());
                    // shield effect
                    if (ship.shieldEffectMaterial && ship.shieldMain) {
                        if (ship.lastDecal) {
                            (_a = ship.lastDecal.material) === null || _a === void 0 ? void 0 : _a.dispose();
                            ship.lastDecal.dispose();
                        }
                        var normal = tmpPewpewPos.subtract(ship.root.position).normalize();
                        ship.root.getWorldMatrix().invertToRef(ShipManager._tmpMatrix);
                        const localNormal = core_1.Vector3.TransformNormal(normal, ShipManager._tmpMatrix);
                        var decalSize = new core_1.Vector3(7, 7, 7);
                        ship.lastDecal = core_1.MeshBuilder.CreateDecal("decal", ship.shieldMain, { position: core_1.Vector3.Zero(), normal: localNormal, size: decalSize });
                        ship.lastDecalTime = 475;
                        ship.lastDecal.parent = ship.root;
                        let nodeMat = ship.shieldEffectMaterial.clone("shieldEffectMat");
                        nodeMat.alphaMode = core_1.Engine.ALPHA_ADD;
                        if (ship.faction) {
                            nodeMat.getBlockByName("hitColor").value = new core_1.Color3(0.42, 3.27, 3.72);
                            nodeMat.getBlockByName("valkyriePattern").value = 0.0;
                        }
                        else {
                            nodeMat.getBlockByName("hitColor").value = new core_1.Color3(3.01, 1.72, 0.30);
                            nodeMat.getBlockByName("valkyriePattern").value = 1.0;
                        }
                        ship.lastDecal.material = nodeMat;
                        nodeMat.getBlockByName("startTime").value = nodeMat.getBlockByName("Time").value;
                    }
                    pewpews[p].ttl = -1;
                    (_c = (_b = pewpews[p].firedBy) === null || _b === void 0 ? void 0 : _b.statistics) === null || _c === void 0 ? void 0 : _c.addDamageDealt();
                    (_e = (_d = pewpews[p].firedBy) === null || _d === void 0 ? void 0 : _d.statistics) === null || _e === void 0 ? void 0 : _e.addShotHitting();
                    (_f = ship.statistics) === null || _f === void 0 ? void 0 : _f.addDamageTaken();
                    ship.life -= this._gameDefinition.shotDamage;
                    if (!ship.isHuman) {
                        ship.evadeTimer = Parameters_1.Parameters.AIEvadeTime;
                        const hitVector = tmpPewpewPos.subtract(ship.root.position);
                        const evadeDirection = hitVector.normalize();
                        ship.evadeTo = ship.root.position.clone().addInPlace(evadeDirection.cross(ship.forward).multiplyByFloats(1000, 1000, 1000));
                        if (pewpews[p].firedBy && pewpews[p].firedBy.faction !== ship.faction) {
                            ship.bestPrey = ships.indexOf(pewpews[p].firedBy);
                        }
                        if (Math.random() < Parameters_1.Parameters.AIImmelmannProbability) {
                            input.immelmann = true;
                        }
                    }
                    // Ship died to lasers
                    if (ship.life <= 0) {
                        explosionManager.spawnExplosion(ship.root.position, ship.root.rotationQuaternion ? ship.root.rotationQuaternion : core_1.Quaternion.Identity());
                        (_h = (_g = pewpews[p].firedBy) === null || _g === void 0 ? void 0 : _g.statistics) === null || _h === void 0 ? void 0 : _h.addShipDestroyed();
                    }
                    else {
                        if (ship.laserHit) {
                            ship.laserHit.play();
                        }
                    }
                }
            }
        }
    }
    _tickHuman(ship, localTime, index) {
        // clamp player inside playable bounding sphere
        const centerToShip = this._tmpVec3;
        centerToShip.copyFrom(ship.root.position);
        const distance = centerToShip.length();
        centerToShip.normalize();
        ship.root.position.copyFrom(centerToShip.scale(Math.min(distance, this._gameDefinition.humanBoundaryRadius)));
    }
    _tickAI(ship, localTime, index, world) {
        const input = ship.input;
        const ships = this.ships;
        // too far from center?
        if (world.shouldAvoid(ship.root.position, 1, this._avoidPos)) {
            ship.state = AIState.AVOID;
        }
        else if (ship.root.position.length() > this._gameDefinition.enemyBoundaryRadius) {
            ship.state = AIState.RETURN;
        }
        else {
            if (ship.evadeTimer > 0) {
                ship.evadeTimer -= localTime;
                ship.state = AIState.EVADE;
            }
            else {
                const bestPreyNow = this.findBestPreyFor(index);
                // if we have a target, and we can see them, stay on them
                if (bestPreyNow != ship.bestPrey) {
                    ship.bestPreyTime = 0;
                    ship.bestPrey = bestPreyNow;
                }
                else {
                    ship.bestPreyTime += localTime;
                }
                if (ship.bestPrey >= 0) {
                    ship.state = AIState.CHASE;
                }
                else {
                    // wander around
                    ship.state = AIState.WANDER;
                }
            }
        }
        // HANDLE BEHAVIOR
        // by default, do nothing
        input.burst = false;
        input.breaking = false;
        input.shooting = false;
        input.immelmann = false;
        switch (ship.state) {
            case AIState.AVOID:
                ship.goToward(this._avoidPos, ship.root.position, 0.02);
                break;
            case AIState.RETURN:
                ship.goToward(core_1.Vector3.Zero(), ship.root.position, 0.02);
                break;
            case AIState.EVADE:
                input.burst = true;
                ship.goToward(ship.evadeTo, ship.root.position, Parameters_1.Parameters.AITurnRate);
                break;
            case AIState.CHASE:
                const enemy = ships[ship.bestPrey].root;
                // position to aim the ship towards
                const gotoPos = enemy.position.add(enemy.forward.normalizeToNew().multiplyByFloats(Parameters_1.Parameters.AIFollowDistance, Parameters_1.Parameters.AIFollowDistance, Parameters_1.Parameters.AIFollowDistance));
                // const aimWmat = enemy.getWorldMatrix();
                // aimPos.addInPlace((new Vector3(aimWmat.m[8], aimWmat.m[9], aimWmat.m[10])).scale(100));
                if (ship.targetSphere) {
                    ship.targetSphere.position = gotoPos;
                }
                ship.goToward(gotoPos, ship.root.position, Parameters_1.Parameters.AITurnRate);
                // position we want to fire at - where we predict the enemy will be in the future
                const firePos = enemy.position.add(enemy.forward.normalizeToNew().multiplyByFloats(Parameters_1.Parameters.AIPredictionRange * ships[ship.bestPrey].velocity, Parameters_1.Parameters.AIPredictionRange * ships[ship.bestPrey].velocity, Parameters_1.Parameters.AIPredictionRange * ships[ship.bestPrey].velocity));
                const fireDot = ShipManager.dotToTarget(ship, firePos);
                const distanceToTarget = ship.root.position.subtract(enemy.position).length();
                if ((distanceToTarget < Parameters_1.Parameters.AIBreakDistance || ship.dotToEnemy < 0.4) && ship.velocity > Parameters_1.Parameters.AIMinimumSpeed) {
                    input.breaking = true;
                }
                if (distanceToTarget > Parameters_1.Parameters.AIBurstDistance && ship.dotToEnemy > 0.8 && ship.velocity < Parameters_1.Parameters.AIMaximumSpeed) {
                    input.burst = true;
                }
                if (fireDot > Parameters_1.Parameters.AIFirePrecision && ship.dotToAlly < Parameters_1.Parameters.AIFriendlyFirePrecision && distanceToTarget < Parameters_1.Parameters.AIFireRange) {
                    input.shooting = true;
                }
                break;
            case AIState.WANDER:
                input.dx = Math.cos(this.time * 0.002) * Parameters_1.Parameters.AITurnRate;
                input.dy = Math.sin(this.time * 0.002) * Parameters_1.Parameters.AITurnRate;
                break;
        }
        // add a bit of randomness
        input.dx += (2 * Math.random() - 1) * Parameters_1.Parameters.AIInputRandomness;
        input.dy += (2 * Math.random() - 1) * Parameters_1.Parameters.AIInputRandomness;
    }
    dispose() {
        this.ships.forEach(ship => {
            ship.dispose();
        });
        this._missileManager.dispose();
        this._shotManager.dispose();
    }
}
exports.ShipManager = ShipManager;
ShipManager._tmpMatrix = new core_1.Matrix;
//# sourceMappingURL=Ship.js.map