// Level.js
import * as THREE from 'three';

import { loadModel } from '../Models.js';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { BossSlime } from '../entities/BossSlime.js';
import { Box } from '../entities/Box.js';
/*
import { Fire } from '../entities/Fire.js';
import { Ghost } from '../entities/Ghost.js';

export function WorldTwoLevelOne(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exits = [];
    let Signs = [];
    let Tools = [];
    let Waters = [];
    
    
    const floorSize = 14;



    const fire = new Fire(scene, 3, 1, 3);
    Mobs.push(fire);
    const fire1 = new Fire(scene, 11, 1, 3);
    Mobs.push(fire1);
    const fire2 = new Fire(scene, 11, 1, 11);
    Mobs.push(fire2);
    const fire3 = new Fire(scene, 3, 1, 11);
    Mobs.push(fire3);

    const ghost = new Ghost(scene, 6, 1, 6);
    Mobs.push(ghost);



    const exit = new Exit(scene, 13, 1, 13);
    Exits.push(exit.MapLayoutMesh);
    
    

    // Add ground tiles (10x10 grid)
    for (let x = -1; x < floorSize + 1; x++) {
        const treeOne = new Tree(scene, -1, 1, x);
        //MapLayout.push(treeOne.MapLayoutMesh);
        const treeTwo = new Tree(scene, 14, 1, x);
        //MapLayout.push(treeTwo.MapLayoutMesh);
        const treeThree = new Tree(scene, x, 1, -1);
        //MapLayout.push(treeThree.MapLayoutMesh);
        const treeFour = new Tree(scene, x, 1, 14);
        //MapLayout.push(treeFour.MapLayoutMesh);

        const invisWallOne = new InvisWall(scene, x, 1, -1);
        MapLayout.push(invisWallOne.MapLayoutMesh);
        const invisWallTwo = new InvisWall(scene, x, 2, -1);
        MapLayout.push(invisWallTwo.MapLayoutMesh);
        const invisWallThree = new InvisWall(scene, x, 1, floorSize);
        MapLayout.push(invisWallThree.MapLayoutMesh);
        const invisWallFour = new InvisWall(scene, x, 2, floorSize);
        MapLayout.push(invisWallFour.MapLayoutMesh);
        const invisWallFive = new InvisWall(scene, -1, 1, x);
        MapLayout.push(invisWallFive.MapLayoutMesh);
        const invisWallSix = new InvisWall(scene, -1, 2, x);
        MapLayout.push(invisWallSix.MapLayoutMesh);
        const invisWallSeven = new InvisWall(scene, floorSize, 1, x);
        MapLayout.push(invisWallSeven.MapLayoutMesh);
        const invisWallEight = new InvisWall(scene, floorSize, 2, x);
        MapLayout.push(invisWallEight.MapLayoutMesh);

        for (let z = -1; z < floorSize + 1; z++) {
            const stoneFloor = new StoneFLoor(scene, x, 0, z);
            MapLayout.push(stoneFloor.MapLayoutMesh);
        }
    }

    return {MapLayout, Mobs, Signs, Exits, Tools, Waters};  // Return all tiles for collision detection

*/

export class WorldTwoLevelOne extends BaseLevel {
    build() {
        const floorSize = 20;

        this.addWallsAndFloorsAroundGrid(-1, floorSize + 1, -1, floorSize + 1);
        for (let x = -1; x <= floorSize + 1; x++) {
            this.addTree(x, 1, -1);
            this.addTree(x, 1, floorSize + 1);
        }

        for (let z = -1; z <= floorSize + 1; z++) {
            this.addTree(-1, 1, z);
            this.addTree(floorSize + 1, 1, z);
        }

        this.addMob(BossSlime, 10, 1, 10);

        this.addBox(3, 1, 3);
        this.addBox(17, 1, 3);
        this.addBox(3, 1, 17);
        this.addBox(17, 1, 17);

        this.addExit(20, 1, 20);

        for (let x = -1; x < floorSize + 1; x++) {
            this.addInvisWall(x, 1, -1);
            this.addInvisWall(x, 1, floorSize + 1);
        }

        return this.getLevelData();
    }
}
