import * as THREE from 'three';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { BaseLevel } from './BaseLevel.js';
import { Ghost } from '../entities/Ghost.js';

export class WorldOne extends BaseLevel {
    async build() {
        const floorSize = 10;

        // Add initial sign and exit
        await this.addMemory(0, 1, 0, "Memory #1\nYou awaken in a mysterious forest, your mind clouded. Something compels you forward, though you can't remember what...");
        
        // Tutorial and story progression
        await this.addSign(2, 1, 2, "Strange symbols appear in your mind... 'K' to grab objects, 'J' to defend yourself...");
        
        this.addExit(10, 1, 9);
        this.addBox(3, 1, 5);

        await this.addNpc(5,1,5, "Help traveller! The slimes are invading our village! Use k to grab that box to help you get over this dreaded fence!");

        // Create a complete floor with walls
        this.addWallsAndFloorsAroundGrid(-1, floorSize + 1, -1, floorSize + 1);


        // Add trees around the perimeter for decoration
        for (let x = -1; x <= floorSize + 1; x++) {
            this.addTree(x, 1, -1);
            this.addTree(x, 1, floorSize + 1);
        }


        for (let z = -1; z <= floorSize + 1; z++) {
            this.addTree(-1, 1, z);
            this.addTree(floorSize + 1, 1, z);
        }

        //this.addFireRing(3, 1, 3, 1.5, 4); // Small ring of 4 fires

        //this.addFireWall(6, 2, 6, 6, 1, 2); // Vertical line of fires with gaps

        // Add a single fire near the exit as a final challenge
        this.addFire(8, 1, 4);
        await this.addFireplace(8, 1, 4);
        await this.addRocks(1, 1, 6, 0);
        await this.addHouse(6,1,1, 0.5);

        await this.addFence(5, 1, 7, Math.PI * 0.1);
        this.addInvisWall(4, -1.2, 7.2);
        this.addInvisWall(5, -1.2, 7);
        this.addInvisWall(6, -1.2, 6.7);
        await this.addFence(8, 1, 6.5, Math.PI * 0);
        this.addInvisWall(7, -1.2, 6.5);
        this.addInvisWall(8, -1.2, 6.5);
        this.addInvisWall(9, -1.2, 6.5);
        await this.addFence(2, 1, 8.5, Math.PI * 0.2);

        //this.addMob(Ghost, 4, 1, 4);

        

        //this.addMob(BigSlime, 7, 1, 7);
        //this.addMob(BossSlime, 8, 1, 8);

        this.addWater(5,.01,2);
        this.addWater(6,.01,2);
        this.addWater(6,.01,3);
        this.addWater(7,.01,3);
        this.addWater(7,.01,2);

        await this.addMemory(9, 1, 8, "Memory Fragment\nThe path ahead beckons. Each trial will reveal more of who you are...");

        // Add an extra sign explaining fire
        await this.addSign(4, 1, 2, 'Careful! Fire will hurt you.\nTry to avoid it!');

        return this.getLevelData();
    }
}