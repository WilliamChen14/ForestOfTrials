// Level.js
import * as THREE from 'three';

import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { BaseLevel } from './BaseLevel.js';

export class StarterLevel extends BaseLevel {
    build() {
        const floorSize = 10;

        // Add initial sign and exit
        this.addSign(5, 1, 5, 'You can jump with the space bar. \nWhen you are ready make your way to the Yellow Exit');
        this.addExit(9, 1, 8);

        // Create a complete floor with walls
        this.addWallsAndFloorsAroundGrid(-1, floorSize + 1, -1, floorSize + 1);

        // Add wall borders
        for (let x = -1; x < floorSize + 1; x++) {
            this.addInvisWall(x, 1, -1);
            this.addInvisWall(x, 1, floorSize);
        }
        
        // Add trees around the perimeter for decoration
        for (let x = -1; x <= floorSize + 1; x++) {
            this.addTree(x, 1, -1);
            this.addTree(x, 1, floorSize);
        }
        
        for (let z = -1; z <= floorSize + 1; z++) {
            this.addTree(-1, 1, z);
            this.addTree(floorSize + 1, 1, z);
        }

        return this.getLevelData();
    }
}