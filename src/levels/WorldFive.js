import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { Slime } from '../entities/Slime.js';
import { BigSlime } from '../entities/BigSlime.js';
import { Ghost } from '../entities/Ghost.js';
import { Box } from '../entities/Box.js';
import { BossSlime } from '../entities/BossSlime.js';

export class WorldFive extends BaseLevel {
    async build() {
        await this.addMemory(0, 1, 0, "Memory #5\nThe Temple of the Ancient Scrolls. This is where it all began - where Birdman's hunger for power corrupted him. Now, at last, you've returned to end it.");
        
        // Temple entrance platform (5x5 ceremonial space)
        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                this.addStoneFloor(x, 0, z);
                // Add pillars at corners
                if ((Math.abs(x) === 2 && Math.abs(z) === 2)) {
                    this.addTree(x, 1, z, Math.PI * 0.25);
                }
            }
        }

        // Temple bridge section
        const bridgeStart = 3;
        const bridgeLength = 8;
        
        // Broken temple bridge requiring planks
        for (let x = bridgeStart; x < bridgeStart + bridgeLength; x += 2) {
            this.addPlank(x, 0, 0);
        }
        
        // Ceremonial lava pit beneath
        for (let x = bridgeStart - 1; x < bridgeStart + bridgeLength + 1; x++) {
            for (let z = -4; z <= 4; z++) {
                if (z !== 0) {
                    this.addLava(x, -2, z);
                }
            }
        }

        // Central temple chamber
        const centerX = bridgeStart + bridgeLength;
        for (let x = -3; x <= 3; x++) {
            for (let z = -3; z <= 3; z++) {
                if (Math.abs(x) + Math.abs(z) <= 4) {
                    this.addStoneFloor(centerX + x, 0, z);
                }
            }
        }

        // Temple trials
        await this.buildFireTrial(centerX, -6);
        await this.buildSpiritTrial(centerX, 0);
        await this.buildGuardianTrial(centerX, 6);

        const innerSanctumX = centerX + 10;
        await this.buildFinalBridgeChallenge(innerSanctumX);
        await this.buildSanctumArena(innerSanctumX + 8);

        return this.getLevelData();
    }

    async buildFireTrial(x, z) {
        // Fire trial platform with ceremonial braziers
        for (let i = -2; i >= -4; i--) {
            this.addPlank(x, 0, i);
        }

        // Ritual platform
        for (let dx = -1; dx <= 2; dx++) {
            for (let dz = -8; dz <= -5; dz++) {
                this.addStoneFloor(x + dx, 0, dz);
                if ((dx === -1 || dx === 2) && (dz === -8 || dz === -5)) {
                    await this.addFireplace(x + dx, 1, dz);
                }
            }
        }

        await this.addSign(x, 1, z - 1, "Trial of Purification\nConquer the flames to proceed");
        this.addMob(Ghost, x + 1, 1, z - 1);
        this.addMob(Ghost, x, 1, z - 1);
        this.addPlank(x + 1, 1, z - 1);

        // Lava moat
        for (let dx = -2; dx <= 3; dx++) {
            for (let dz = -9; dz <= -4; dz++) {
                if (dx < -1 || dx > 2 || dz < -8 || dz > -5) {
                    this.addLava(x + dx, -2, dz);
                }
            }
        }
    }

    async buildSpiritTrial(x, z) {
        for (let i = 1; i <= 4; i++) {
            this.addPlank(x + i, 0, 0);
        }

        const platformX = x + 6;

        // Spirit trial chamber
        for (let dx = 0; dx <= 3; dx++) {
            for (let dz = -1; dz <= 2; dz++) {
                this.addStoneFloor(platformX + dx, 0, dz);
                if ((dx === 0 || dx === 3) && (dz === -1 || dz === 2)) {
                    this.addTree(platformX + dx, 1, dz, Math.PI * 0.5);
                }
            }
        }

        await this.addSign(platformX, 1, z - 1, "Trial of Spirit\nFace the temple's guardians");
        this.addMob(Ghost, platformX + 1, 1, z);
        this.addMob(Ghost, platformX + 2, 1, z + 1);
        this.addPlank(platformX + 3, 1, z);

        // Lava protection
        for (let dx = -1; dx <= 4; dx++) {
            for (let dz = -2; dz <= 3; dz++) {
                if (dx < 0 || dx > 3 || dz < -1 || dz > 2) {
                    this.addLava(platformX + dx, -2, dz);
                }
            }
        }
    }

    async buildGuardianTrial(x, z) {
        for (let i = 1; i <= 4; i++) {
            this.addPlank(x, 0, i);
        }

        // Guardian's chamber
        for (let dx = -1; dx <= 2; dx++) {
            for (let dz = 5; dz <= 8; dz++) {
                this.addStoneFloor(x + dx, 0, dz);
                if ((dx === -1 || dx === 2) && (dz === 5 || dz === 8)) {
                    this.addFire(x + dx, 0.5, dz);
                }
            }
        }

        await this.addSign(x, 1, z + 2, "Trial of Strength\nProve your worth to proceed");
        this.addMob(BigSlime, x + 1, 1, z + 1);
        this.addPlank(x + 1, 1, z + 2);

        // Lava protection
        for (let dx = -2; dx <= 3; dx++) {
            for (let dz = 4; dz <= 9; dz++) {
                if (dx < -1 || dx > 2 || dz < 5 || dz > 8) {
                    this.addLava(x + dx, -2, dz);
                }
            }
        }
    }

    async buildFinalBridgeChallenge(x) {
        // Sanctum entrance
        for (let z = -1; z <= 1; z++) {
            this.addStoneFloor(x - 1, 0, z);
            this.addStoneFloor(x - 2, 0, z);
        }
        
        await this.addMemory(x - 2, 1, 0, "Now you're at the final threshold. Beyond you must face Birdman...");
        
        // Lava chasm
        for (let dx = x; dx < x + 7; dx++) {
            for (let z = -3; z <= 3; z++) {
                this.addLava(dx, -2, z);
            }
        }
    }

    async buildSanctumArena(x) {
        // Extended temple floor
        for (let dx = -6; dx <= 7; dx++) {
            for (let dz = -7; dz <= 6; dz++) {
                this.addStoneFloor(x + dx, 0, dz);
            }
        }

        // Temple walls (left side)

        // Right side wall
        for (let dz = -7; dz <= 6; dz++) {
            for (let dy = 0; dy < 4; dy++) {
                this.addStoneFloor(x + 7, dy, dz);
                this.addInvisWall(x + 7, dy, dz);
            }
        }

        for (let dx = -6; dx <= 7; dx++) {
            for (let dy = 0; dy < 4; dy++) {
                this.addStoneFloor(x + dx, dy, -7);
                this.addInvisWall(x + dx, dy, -7);
            }
        }
        
        // Back wall
        for (let dx = -6; dx <= 7; dx++) {
            for (let dy = 0; dy < 4; dy++) {
                this.addStoneFloor(x + dx, dy, 6);
                this.addInvisWall(x + dx, dy, 6);
            }
        }
        
        await this.addFireplace(x - 3, 1, -3);
        await this.addFireplace(x + 3, 1, -3);
        await this.addFireplace(x - 3, 1, 3);
        await this.addFireplace(x + 3, 1, 3);

        this.addFire(x - 3, 1.5, -3);
        this.addFire(x + 3, 1.5, -3);
        this.addFire(x - 3, 1.5, 3);
        this.addFire(x + 3, 1.5, 3);

        this.addFire(x - 2, 1, 0);
        this.addFire(x + 2, 1, 0);
        this.addFire(x, 1, 2);

        this.addFire(x - 4, 1, 0);
        this.addFire(x + 2, 1, 0);
        this.addFire(x, 1, 4);
        
        this.addMob(BossSlime, x + 1, 1, 0);
        this.addExit(x + 4, 1, 0);

        // Lava surrounding temple
        for (let dx = -8; dx <= 9; dx++) {
            for (let dz = -9; dz <= 8; dz++) {
                if (Math.abs(dx) + Math.abs(dz) > 11) {
                    this.addLava(x + dx, -2, dz);
                }
            }
        }
    }
}