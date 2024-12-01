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
        this.addSign(5, 1, 5, 'You can jump with the space bar.\nWatch out for the fire!\nMake your way to the Yellow Exit');
        this.addExit(10, 1, 9);

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
        this.addFire(8, 1, 5);

        // Add an extra sign explaining fire
        this.addSign(2, 1, 2, 'Careful! Fire will hurt you.\nTry to avoid it!');

        return this.getLevelData();
    }
}