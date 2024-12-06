import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { Slime } from '../entities/Slime.js';
import { BigSlime } from '../entities/BigSlime.js';
import { Ghost } from '../entities/Ghost.js';
import { Box } from '../entities/Box.js';
import { Gate } from '../entities/Gate.js';
import { Button } from '../entities/Button.js';
import { BossSlime } from '../entities/BossSlime.js';

export class WorldFour extends BaseLevel {
    async build() {
        await this.addNpc(1, 1, 0, "Guardian! Thank you for coming here! The ancient scrolls were stolen by Birdman, our court wizard. He disappeared into the temple... but something dark followed. These creatures - they're unlike anything we've seen.");
        await this.addMemory(1, 1, 1, "You remember this place. There's fire on the bridge...you need to be careful and make sure you have enough lives");

        // Create starting platform with mixed floor types for visual interest
        for (let x = -7; x <= 8; x++) {
            for (let z = -7; z <= 8; z++) {
                // Create checkerboard pattern
                if ((x + z) % 2 === 0) {
                    this.addStoneFloor(x, 0, z);
                } else {
                    this.addDirtFloor(x, 0, z);
                }
            }
        }

        // Add decorative elements in starting area
        await this.addFireplace(-6, 1, -6);
        await this.addFireplace(-6, 1, 7);
        await this.addFireplace(7, 1, -6);
        await this.addFireplace(7, 1, 7);

        this.addHouse(-2, 1, 1, Math.PI / 2);

        // Add rock formations for atmosphere
        await this.addRocks(-5, 1, -5, Math.PI / 4);
        await this.addRocks(-5, 1, 6, -Math.PI / 4);
        await this.addRocks(6, 1, -5, Math.PI / 2);
        await this.addRocks(6, 1, 6, -Math.PI / 2);

        for (let z = -3; z <= 2; z++) {
            for (let y = 1; y <= 2; y++) {
                this.addStoneFloor(8, y, z);
            }
        }


        for (let x = -7; x <= 8; x++) {
            this.addInvisWall(x, 1, 8);
            this.addInvisWall(x, 1, -7);
            // Only add trees if not in stone floor area
            if (x !== 8) { // Since stone floor is at x=8
                this.addTree(x, 0, 8);
                this.addTree(x, 0, -7);
            }
        }
        
        for (let z = -7; z <= 8; z++) {
            this.addInvisWall(-7, 1, z);
            this.addTree(-7, 1, z);
            // Only add tree if not in stone floor z range
            if (z < -3 || z > 2) {
                this.addTree(8, 1, z);
            }
        }
        
        this.addBox(3, 1, 2);

        // Add initial enemies in starting area
        this.addMob(Ghost, -4, 1, -4);
        this.addMob(Ghost, 5, 1, -4);
        this.addMob(Slime, 0, 1, 4);
        this.addMob(Slime, 3, 1, 4);
        this.addMob(Slime, 5, 1, 4);
        this.addMob(Ghost, 6, 1, -4);

        for (let z = -3; z <= 2; z++) {
            for (let y = 1; y <= 2; y++) {
                this.addStoneFloor(8, y, z);
            }
        }

        
        // Create elevated section (stairs and platforms)
        const stairStart = 9;
        const stairWidth = 6;
        
        // Build main staircase
        for (let i = 0; i < 5; i++) {
            for (let z = -3; z <= 2; z++) {
                this.addStoneFloor(stairStart + i, i, z);
            }
            // Add walls and decorative elements along stairs
            this.addInvisWall(stairStart + i, i + 1, -4);
            this.addInvisWall(stairStart + i, i + 1, 3);
            if (i % 2 === 0) {
                this.addTree(stairStart + i, i + 1, -4);
                this.addTree(stairStart + i, i + 1, 3);
            } else {
                await this.addFireplace(stairStart + i, i + 1, -4);
                await this.addFireplace(stairStart + i, i + 1, 3);
            }
        }

        // Add enemies on stairs (alternating types)
        this.addMob(Slime, stairStart + 1, 2, 0);
        this.addMob(Ghost, stairStart + 2, 3, -1);
        this.addMob(Slime, stairStart + 3, 4, 1);
        this.addMob(Ghost, stairStart + 4, 5, 0);

        // Create bridge section with 
        const bridgeHeight = 5;
        const bridgeLength = 31;
        const platformSpacing = 3;

        // Create bridge platforms with consistent spacing
        for (let x = stairStart + 5; x < stairStart + bridgeLength; x += platformSpacing) {
            // Create 2x2 platforms
            for (let dx = 0; dx <= 1; dx++) {
                for (let dz = -1; dz <= 0; dz++) {
                    this.addStoneFloor(x + dx, bridgeHeight, dz);
                }
            }

            const centerX = x + 0.5; // Assuming each platform spans x to x+1
            const centerZLeft = -2;   // Adjust based on desired side placement
            const centerZRight = 1;   // Adjust based on desired side placement

            this.addTree(centerX, bridgeHeight+0.8, centerZLeft+2.25);
            this.addTree(centerX, bridgeHeight+0.8, centerZRight-2.25);


            // Add hazards and decoration
            if (x % 4 === 0) {
                this.addFire(x, bridgeHeight+0.5, -1);
            }
            
            // Add floating ghosts along bridge
            if (x % 6 === 0) {
                this.addMob(Ghost, x, bridgeHeight + 1, -3);
                this.addMob(Ghost, x + 1, bridgeHeight + 1, 2);
            }
        }

        // Create boss arena (20x20)
        const arenaStartX = stairStart + bridgeLength;
        for (let x = arenaStartX; x <= arenaStartX + 15; x++) {
            for (let z = -9; z <= 4; z++) {
                // Create pattern in boss arena floor
                if ((x + z) % 2 === 0) {
                    this.addStoneFloor(x, bridgeHeight, z);
                } else {
                    this.addDirtFloor(x, bridgeHeight, z);
                }
            }
        }

        // Add decorative elements in boss arena
        this.addFireRing(arenaStartX + 7, bridgeHeight + 1, 0, 3, 5);
        
        // Add corner fireplaces
        await this.addFireplace(arenaStartX + 2, bridgeHeight + 1, -1);
        await this.addFireplace(arenaStartX + 2, bridgeHeight + 1, 2);
        await this.addFireplace(arenaStartX + 4, bridgeHeight + 1, -1);
        await this.addFireplace(arenaStartX + 4, bridgeHeight + 1, 2);

        // Add rock formations in corners
        await this.addRocks(arenaStartX + 1, bridgeHeight + 1, -1, Math.PI / 4);
        await this.addRocks(arenaStartX + 1, bridgeHeight + 1, 2, -Math.PI / 4);
        await this.addRocks(arenaStartX + 8, bridgeHeight + 1, -1, Math.PI / 2);
        await this.addRocks(arenaStartX + 8, bridgeHeight + 1, 2, -Math.PI / 2);

        await this.addMemory(stairStart + 15, bridgeHeight + 1, 0, "Memory Fragment\nNow you remember that night - racing to stop Birdman at the temple gates. He was attempting a forbidden ritual with the scrolls. There was a blast of energy... then darkness.");

        // Add walls around boss arena
        for (let x = arenaStartX; x <= arenaStartX + 15; x++) {
            this.addInvisWall(x, bridgeHeight + 1, -9);
            this.addInvisWall(x, bridgeHeight + 1, 10);
            if (x % 2 === 0) {
                this.addTree(x, bridgeHeight + 1, -9);
                this.addTree(x, bridgeHeight + 1, 4);
            }
        }
        for (let z = -9; z <= 4; z++) {
            this.addInvisWall(arenaStartX + 15, bridgeHeight + 1, z);
            if (z % 2 === 0) {
                this.addTree(arenaStartX + 15, bridgeHeight + 1, z);
            }
        }

        // Add mini-bosses and regular enemies in arena
        this.addMob(BigSlime, arenaStartX + 5, bridgeHeight + 1, -5);
        this.addMob(Slime, arenaStartX + 3, bridgeHeight + 1, -3);
        this.addMob(Slime, arenaStartX + 3, bridgeHeight + 1, 3);
        this.addMob(Ghost, arenaStartX + 6, bridgeHeight + 1, -2);
        this.addMob(Ghost, arenaStartX + 6, bridgeHeight + 1, 2);

        // Add exit behind boss arena
        await this.addMemory(arenaStartX + 13, bridgeHeight + 1, 0, "Memory Fragment\nThe truth crashes back - Birdman's ritual went wrong. The arcane energy transformed him into the first of the slimes. His consciousness fractured, spreading corruption through the forest. The Boss Slime before you... it's him. What remains of the wizard who betrayed us all.");
        this.addExit(arenaStartX + 14, bridgeHeight + 1, 0);

        return this.getLevelData();
    }
}
