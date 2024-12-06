import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { BigSlime } from '../entities/BigSlime.js';
import { Box } from '../entities/Box.js';
import { DirtFloor } from '../entities/DirtFloor.js';
import { Ghost } from '../entities/Ghost.js';

export class WorldThree extends BaseLevel {
    async build() {
        const floorSize = 15;

        // Add initial sign and exit
        await this.addMemory(-7, 1, 9, "Memory #3\nThe forest's magic grows stronger. You remember being part of an ancient order, sworn to protect these grounds. The corruption began at the heart...");
        
        await this.addSign(-5, 1, 9, 'The corruption touches everything! Press "r" to reset if you become trapped. And rescue the villager ahead, who has been imprisoned by the slimes...');
        this.addExit(0, 1, 30);

        // Add initial floor and walls
        this.addStoneFloor(0, 0, -1);
        this.addInvisWall(-1, 1, -1);
        this.addInvisWall(1, 1, -1);
        this.addStoneFloor(1, 0, -1);
        this.addStoneFloor(-1, 0, -1);
        this.addTree(-1, 1, -1);
        this.addTree(1, 1, -1);

        // Add additional initial elements
        this.addStoneFloor(0, 0, -2);
        this.addInvisWall(0, 1, -1);
        this.addTree(0, 1, -2);

        // Build main floor grid
        for (let x = 1; x < floorSize + 1; x++) {
            // Add border trees and walls
            this.addTree(-x - 1, 1, x - 1);
            this.addInvisWall(-x - 1, 1, x - 1);
            this.addStoneFloor(-x - 1, 0, x - 1);
            this.addInvisWall(x + 1, 1, x - 1);
            this.addStoneFloor(x + 1, 0, x - 1);
            this.addTree(x + 1, 1, x - 1);

            // Fill in floor tiles
            for (let y = -x; y <= x; y++) {
                this.addStoneFloor(y, 0, x - 1);
            }
        }

        // Build second half of floor
        for (let x = floorSize; x >= 0; x--) {
            const z = (floorSize - x) + floorSize;
            
            // Add border elements
            this.addTree(-x - 1, 1, z);
            this.addInvisWall(-x - 1, 1, z);
            this.addStoneFloor(-x - 1, 0, z);
            this.addInvisWall(x + 1, 1, z);
            this.addStoneFloor(x + 1, 0, z);
            this.addTree(x + 1, 1, z);

            // Fill in floor tiles
            for (let y = -x; y <= x; y++) {
                this.addStoneFloor(y, 0, z);
            }
        }

        // Build elevated sections
        for (let z = 1; z < 7; z++) {
            for (let x = 0; x < 3; x++) {
                for (let y = -x; y <= x; y++) {
                    this.addStoneFloor(y, z, 5 + x);
                    this.addStoneFloor(y, z, 9 - x);
                }
            }
        }

        // Add peak and secret areas
        this.addStoneFloor(0, 7, 7);
        
        // Secret path 1
        for (let x = 0; x < 20; x++) {
            this.addStoneFloor(3 + x, 6, 7);
        }
        await this.addMemory(12, 7, 7, "Memory Fragment\nThe corruption's source... it is at the end of the trials!.");
        
        // Secret path 2
        for (let x = 0; x < 22; x++) {
            this.addStoneFloor(22, 6, 8 + x);
        }
        
        // Secret path 3
        for (let x = 0; x < 22; x++) {
            this.addStoneFloor(22 - x, 6, 30);
        }

        // Add boxes
        for (let x = -2; x < 4; x++) {
            this.addBox(x, 1, 10);
        }

        // Add tree line with invisible walls
        for (let x = -10; x < 15; x++) {
            this.addTree(x, 1, 13);
            this.addInvisWall(x, 1, 13);
        }

        // Add elevated platforms
        for (let x = 0; x < 3; x++) {
            this.addStoneFloor(-9, 1, 14 + x);
            this.addStoneFloor(-9, 2, 14 + x);
            this.addStoneFloor(9, 1, 14 + x);
            this.addStoneFloor(9, 2, 14 + x);
        }

        // Add enemies
        this.addMob(Slime, 8, 1, 16);
        this.addMob(Slime, 0, 1, 16);
        this.addMob(Slime, -6, 1, 16);

        this.addNpc(7, 1, 16, "Thank you for rescuing me from the slimes! Watch out for the ghost in the next trial...they are intelligent unlike the slimes!");

        // nah its  a skill issue if they need this this.addBox(8, 1, 16); // can jump

        // Add final tree line
        for (let x = -13; x < 10; x++) {
            this.addTree(x, 1, 17);
            this.addInvisWall(x, 1, 17);
        }

        this.addMob(Slime, 0, 1, 24);
        this.addMob(Slime, 0, 1, 24);
        this.addMob(BigSlime, 0, 1, 20);

        await this.addMemory(0, 1, 29, "Memory Fragment\nNow you remember - you were the guardian of the village, tasked with keeping the village safe! But what happened? The corruption didn't just appear... it was unleashed. Someone tampered with dark magic. But where were you when it happened? The next trial may hold the answer...");

        return this.getLevelData();
    }
}
