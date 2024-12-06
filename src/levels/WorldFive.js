import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { Slime } from '../entities/Slime.js';
import { BigSlime } from '../entities/BigSlime.js';
import { Ghost } from '../entities/Ghost.js';
import { Box } from '../entities/Box.js';
import { BossSlime } from '../entities/BossSlime.js';

export class WorldFive extends BaseLevel {
    async build() {
        // Starting platform with sign
        await this.addSign(0, 1, 0, "Welcome! Complete three trials to face the boss.\nCollect planks to build your path!");
        
        // Starting area (3x3)
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                this.addStoneFloor(x, 0, z);
            }
        }

        // Main bridge to central platform
        const bridgeStart = 2;
        const bridgeLength = 6;
        
        for (let x = bridgeStart; x < bridgeStart + bridgeLength; x++) {
            this.addPlank(x, 0, 0);
        }
        
        // Lava beneath bridge
        for (let x = bridgeStart; x < bridgeStart + bridgeLength; x++) {
            for (let z = -3; z <= 3; z++) {
                if (z !== 0) {
                    this.addLava(x, -2, z);
                }
            }
        }

        // Central hub platform (5x5)
        const centerX = bridgeStart + bridgeLength;
        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                if ((x + z) % 2 === 0) {
                    this.addStoneFloor(centerX + x, 0, z);
                } else {
                    this.addDirtFloor(centerX + x, 0, z);
                }
            }
        }

        // Build three challenge platforms
        // North challenge - Fire Ring
        await this.buildFireChallenge(centerX, -6);
        
        // East challenge - Ghost
        await this.buildGhostChallenge(centerX, 0);
        
        // South challenge - Slime
        await this.buildSlimeChallenge(centerX, 6);

        // Gap and boss arena setup
        const wallX = centerX + 10;
        await this.buildPlankGapChallenge(wallX);
        
        // Boss arena moved further back to require plank bridging
        await this.buildBossArena(wallX + 8);

        return this.getLevelData();
    }

    async buildFireChallenge(x, z) {
        // Bridge to fire challenge
        for (let i = -2; i >= -4; i--) {
            this.addPlank(x, 0, i);
        }

        // Platform (4x4)
        for (let dx = -1; dx <= 2; dx++) {
            for (let dz = -8; dz <= -5; dz++) {
                this.addStoneFloor(x + dx, 0, dz);
            }
        }

        await this.addSign(x, 1, z - 1, "Fire Ring Trial\nReward: Building Plank");
        this.addMob(Slime, x + 1, 1, z - 1);
        this.addMob(Slime, x, 1, z - 1);
        this.addMob(Slime, x, 1, z + 1);
        this.addMob(Slime, x + 1, 1, z);
        this.addPlank(x + 1, 1, z - 1);

        // Add lava around platform
        for (let dx = -2; dx <= 3; dx++) {
            for (let dz = -9; dz <= -4; dz++) {
                if (dx < -1 || dx > 2 || dz < -8 || dz > -5) {
                    this.addLava(x + dx, -2, dz);
                }
            }
        }
    }

    async buildGhostChallenge(x, z) {
        // Bridge to ghost challenge
        for (let i = 1; i <= 4; i++) {
            this.addPlank(x + i, 0, 0);
        }

        const ghostPlatformX = x + 6;

        // Checkerboard platform (4x4)
        for (let dx = 0; dx <= 3; dx++) {
            for (let dz = -1; dz <= 2; dz++) {
                if ((dx + dz) % 2 === 0) {
                    this.addStoneFloor(ghostPlatformX + dx, 0, dz);
                } else {
                    this.addDirtFloor(ghostPlatformX + dx, 0, dz);
                }
            }
        }

        await this.addSign(ghostPlatformX, 1, z - 1, "Ghost's Trial\nReward: Building Plank");
        this.addMob(Ghost, ghostPlatformX + 1, 1, z);
        this.addMob(Ghost, ghostPlatformX + 2, 1, z + 1);
        this.addPlank(ghostPlatformX + 3, 1, z);

        // Add lava around platform
        for (let dx = -1; dx <= 4; dx++) {
            for (let dz = -2; dz <= 3; dz++) {
                this.addLava(ghostPlatformX + dx, -2, dz);
            }
        }
    }

    async buildSlimeChallenge(x, z) {
        // Bridge to slime challenge
        for (let i = 1; i <= 4; i++) {
            this.addPlank(x, 0, i);
        }

        // Elevated platform
        for (let dx = -1; dx <= 2; dx++) {
            for (let dz = 5; dz <= 8; dz++) {
                this.addStoneFloor(x + dx, 0, dz);
            }
        }

        await this.addSign(x, 1, z + 2, "Slime's Trial\nReward: Building Plank");
        this.addMob(BigSlime, x + 1, 1, z + 1);
        this.addPlank(x + 1, 1, z + 2);

        // Add lava around platform
        for (let dx = -2; dx <= 3; dx++) {
            for (let dz = 4; dz <= 9; dz++) {
                this.addLava(x + dx, -2, dz);
            }
        }
    }

    async buildPlankGapChallenge(x) {
        // Platform before gap
        for (let z = -1; z <= 1; z++) {
            this.addStoneFloor(x - 1, 0, z);
            this.addStoneFloor(x - 2, 0, z);
        }
        
        await this.addSign(x - 2, 1, 0, "Stack your planks to reach the boss!");
        
        // Small support platform in the middle (single block)
        const midPoint = x + 3;
        //this.addStoneFloor(midPoint, 0, 0);
        
        // Add lava under the gap, avoiding the support platform area
        for (let dx = x; dx < x + 7; dx++) {
            for (let z = -3; z <= 3; z++) {
                // Skip lava placement at the support platform position
                if (!(dx === midPoint && z === 0)) {
                    this.addLava(dx, -2, z);
                }
            }
        }
    }

    async buildBossArena(x) {
        // Larger boss arena (10x10)
        for (let dx = -4; dx <= 5; dx++) {
            for (let dz = -5; dz <= 4; dz++) {
                if (Math.abs(dx) + Math.abs(dz) <= 8) {
                    if ((dx + dz) % 2 === 0) {
                        this.addStoneFloor(x + dx, 0, dz);
                    } else {
                        this.addDirtFloor(x + dx, 0, dz);
                    }
                }
            }
        }

        // Dramatic fire rings
        this.addFireRing(x, 1, 0, 4, 3);  // Outer ring
        this.addFireRing(x, 1, 0, 2, 3);  // Inner ring
        
        // Boss in center
        this.addMob(BossSlime, x, 1, 0);

        // Exit behind boss
        this.addExit(x + 4, 1, 0);
        
        // Back wall with fires
        for (let z = -5; z <= 4; z++) {
            this.addInvisWall(x + 6, 1, z);
            this.addTree(x + 5, 0, z);
        }

        // Add lava around arena
        for (let dx = -5; dx <= 6; dx++) {
            for (let dz = -6; dz <= 5; dz++) {
                this.addLava(x + dx, -2, dz);
            }
        }
    }
}