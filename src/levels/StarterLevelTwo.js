// Level.js
import * as THREE from 'three';

import { Slime } from '../entities/Slime';
import { BigSlime } from '../entities/BigSlime.js';

import { BaseLevel } from './BaseLevel.js';

export class StarterLevelTwo extends BaseLevel {
    async build() {

        const floorSize = 20;

        const floorDepth = 8;
        const floorWidth = 20;

        // Add initial sign and exit
        await this.addSign(5, 1, 5, 'You can attack with the j key and pick up some objects with the k key. \nWhen you are ready make your way to the Yellow Exit');
        await this.addMemory(0,1,0, "Memory #2 \n You see some enemies ahead of you, but why are you here? Who put you in this forest of trials?");
        await this.addHouse(3,1,0,0);
        await this.addHouse(7,1,1,0);
        await this.addFireplace(7,1,1,0);
        await this.addRocks(14,1,1,Math.PI * -0.5);
        this.addInvisWall(3, 0, 0);
        this.addInvisWall(4, 0, 0);
        this.addInvisWall(5, 0, 0);
        this.addInvisWall(6, 0, 0);
        this.addInvisWall(7, 0, 1);
        this.addInvisWall(8, 0, 1);
        this.addInvisWall(9, 0, 1);
        this.addInvisWall(10, 0, 1);
        this.addInvisWall(11, 0, 1);
        
        // Create a complete floor with walls
        this.addWallsAndFloorsAroundGrid(-1, 20 + 1, -1, 8 + 1);

        this.addMob(Slime, 6, 1, 6);
        this.addMob(Slime, 8, 1, 2);
        this.addMob(Slime, 10, 1, 4);
        this.addMob(Slime, 12, 1, 2);
        this.addMob(BigSlime, 13, 1, 2);
        this.addBox(3,1,3);
        this.addExit(20,1,5);


        for(let x = -1; x < floorDepth + 1; x++){
            this.addStoneFloor(16, 1, x);
            this.addStoneFloor(16, 2, x);
        }


        // Add trees around the perimeter for decoration
        for (let x = -1; x <= 20 + 1; x++) {
            this.addTree(x, 1, -1);
            this.addTree(x, 1, 9);
        }

        for (let z = -1; z <= 8 + 1; z++) {
            this.addTree(-1, 1, z);
            this.addTree(20 + 1, 1, z);
        }

        return this.getLevelData();
    }
}
