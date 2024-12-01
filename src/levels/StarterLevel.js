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

        /*
        const water = new Water(scene, 6, 1, 2);
        Waters.push(water);
        const water2 = new Water(scene, 6, 1, 3);
        Waters.push(water2);
        const water3 = new Water(scene, 7, 1, 2);
        Waters.push(water3);
        const water4 = new Water(scene, 7, 1, 3);
        Waters.push(water4);
        const stoneFloor = new StoneFLoor(scene, 8, 1, 3);
        MapLayout.push(stoneFloor.MapLayoutMesh);
        const stoneFloor0 = new StoneFLoor(scene, 8, 1, 2);
        MapLayout.push(stoneFloor0.MapLayoutMesh);
        const stoneFloor1 = new StoneFLoor(scene, 7, 1, 4);
        MapLayout.push(stoneFloor1.MapLayoutMesh);
        const stoneFloor2 = new StoneFLoor(scene, 8, 1, 4);
        MapLayout.push(stoneFloor2.MapLayoutMesh);
        const stoneFloor3 = new StoneFLoor(scene, 6, 1, 4);
        MapLayout.push(stoneFloor3.MapLayoutMesh);
        const stoneFloor4 = new StoneFLoor(scene, 5, 1, 3);
        MapLayout.push(stoneFloor4.MapLayoutMesh);
        const stoneFloor5 = new StoneFLoor(scene, 5, 1, 2);
        MapLayout.push(stoneFloor5.MapLayoutMesh);
        const stoneFloor6 = new StoneFLoor(scene, 5, 1, 4);
        MapLayout.push(stoneFloor6.MapLayoutMesh);
        const stoneFloor7 = new StoneFLoor(scene, 5, 1, 1);
        MapLayout.push(stoneFloor7.MapLayoutMesh);
        const stoneFloor8 = new StoneFLoor(scene, 6, 1, 1);
        MapLayout.push(stoneFloor8.MapLayoutMesh);
        const stoneFloor9 = new StoneFLoor(scene, 7, 1, 1);
        MapLayout.push(stoneFloor9.MapLayoutMesh);
        const stoneFloor10 = new StoneFLoor(scene, 8, 1, 1);
        MapLayout.push(stoneFloor10.MapLayoutMesh);
        */

        // Add an extra sign explaining fire
        this.addSign(2, 1, 2, 'Careful! Fire will hurt you.\nTry to avoid it!');

        return this.getLevelData();
    }
}
