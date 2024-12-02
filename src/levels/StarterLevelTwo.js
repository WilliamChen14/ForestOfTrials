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
