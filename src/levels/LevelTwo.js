import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { Slime } from '../entities/Slime.js';
import { BigSlime } from '../entities/BigSlime.js';
import { Box } from '../entities/Box.js';

export class LevelTwo extends BaseLevel {
    build() {
        // Starting area (12x12 to accommodate stairs)
        this.addSign(0, 1, 0, "Make your way up the stairs.\nBe careful on the bridge - one wrong jump means death.");
        
        // Create starting platform
        for (let x = -3; x <= 8; x++) {
            for (let z = -3; z <= 8; z++) {
                this.addStoneFloor(x, 0, z);
            }
        }

        // Add walls around starting area, with a gap for the stairs
        for (let x = -3; x <= 8; x++) {
            this.addInvisWall(x, 1, -3);
            this.addInvisWall(x, 1, 8);
            this.addTree(x, 1, -3);
            this.addTree(x, 1, 8);
        }
        for (let z = -3; z <= 8; z++) {
            if (z < 1 || z > 5) {  // Leave gap for stairs
                this.addInvisWall(8, 1, z);
                this.addTree(8, 1, z);
            } else {
                this.addStoneFloor(8, 1, z);
                this.addStoneFloor(8, 2, z);
            }
            this.addInvisWall(-3, 1, z);
            this.addTree(-3, 1, z);
        }

        // Add decorative water pools in starting area
        this.addWater(-2, 1, -2);
        this.addWater(-2, 1, 7);
        this.addWater(7, 1, -2);
        this.addWater(7, 1, 7);

        // Add box for additional challenge
        this.addBox(4, 1, 2);

        // Add enemies concentrated near the stairs entrance
        this.addMob(Slime, 5, 1, 0);
        this.addMob(Slime, 6, 1, 1);
        this.addMob(Slime, 7, 1, 0);
        this.addMob(Slime, 5, 1, 2);
        this.addMob(Slime, 7, 1, 2);
        this.addMob(Slime, 5, 1, 4);
        this.addMob(Slime, 6, 1, 3);
        this.addMob(Slime, 7, 1, 4);
        this.addMob(Slime, 6, 1, 5);
        this.addMob(Slime, 7, 1, 3);

        // Create stairs (going up 5 blocks high)
        for (let i = 0; i < 5; i++) {
            for (let z = -2; z <= 2; z++) {
                this.addStoneFloor(9 + i, i, z);
            }
            // Add walls along stairs
            this.addInvisWall(9 + i, i + 1, -3);
            this.addInvisWall(9 + i, i + 1, 3);
            this.addTree(9 + i, i + 1, -3);
            this.addTree(9 + i, i + 1, 3);
        }

        // Add enemies on stairs
        this.addMob(Slime, 10, 1, 0);
        this.addMob(Slime, 11, 2, 1);
        this.addMob(Slime, 12, 3, 0);
        this.addMob(Slime, 13, 4, 1);

        // Create water under the bridge area
        for (let x = 14; x <= 39; x++) {
            for (let z = -6; z <= 5; z++) {
                this.addWater(x, -1, z);
            }
        }

        // Create the bridge platforms (disconnected, requiring jumps)
        const bridgeHeight = 5;
        let bridgeX = 15;
        
        // Create alternating platforms
        while (bridgeX <= 38) {
            for (let dz = -1; dz <= 0; dz++) {
                for (let dx = 0; dx <= 1; dx++) {
                    this.addStoneFloor(bridgeX + dx, bridgeHeight, dz);
                }
            }

            // Add fires more frequently and on both sides
            if (bridgeX % 4 === 0) {
                this.addFire(bridgeX, bridgeHeight + 1, -1);
                this.addFire(bridgeX + 1, bridgeHeight + 1, 0);
            }

            bridgeX += (bridgeX % 6 === 0) ? 3.25 : 2.25;
        }

        // Create final platform (20x15)
        for (let x = 39; x <= 58; x++) {
            for (let z = -7; z <= 7; z++) {
                this.addStoneFloor(x, bridgeHeight, z);
            }
        }

        // Add decorative fire ring around the boss area
        this.addFireRing(54, bridgeHeight + 1, 0, 4, 8);

        // Add walls around final platform
        for (let x = 39; x <= 58; x++) {
            this.addInvisWall(x, bridgeHeight + 1, -7);
            this.addInvisWall(x, bridgeHeight + 1, 7);
            this.addTree(x, bridgeHeight + 1, -7);
            this.addTree(x, bridgeHeight + 1, 7);
        }
        for (let z = -7; z <= 7; z++) {
            this.addInvisWall(58, bridgeHeight + 1, z);
            this.addTree(58, bridgeHeight + 1, z);
        }

        // Add decorative water features in final platform
        this.addWater(40, bridgeHeight, -6);
        this.addWater(40, bridgeHeight, 6);
        this.addWater(45, bridgeHeight, -6);
        this.addWater(45, bridgeHeight, 6);
        this.addWater(50, bridgeHeight, -6);
        this.addWater(50, bridgeHeight, 6);

        // Add enemies on final platform
        this.addMob(Slime, 42, bridgeHeight + 1, -4);
        this.addMob(Slime, 44, bridgeHeight + 1, 0);
        this.addMob(Slime, 42, bridgeHeight + 1, 4);
        this.addMob(Slime, 46, bridgeHeight + 1, -2);
        this.addMob(Slime, 46, bridgeHeight + 1, 2);
        this.addMob(Slime, 48, bridgeHeight + 1, -3);
        this.addMob(Slime, 48, bridgeHeight + 1, 3);
        this.addMob(Slime, 50, bridgeHeight + 1, 0);

        // Add final boss and sign
        this.addSign(52, bridgeHeight + 1, 0, "Defeat the Big Slime to reach the exit!");
        this.addMob(BigSlime, 54, bridgeHeight + 1, 0);

        // Add exit behind boss
        this.addExit(57, bridgeHeight + 1, 0);

        return this.getLevelData();
    }
}