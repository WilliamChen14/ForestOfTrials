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
import { DirtFloor } from '../entities/DirtFloor.js';

export function LevelTwo(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exits = [];
    let Signs = [];
    let Tools = [];
    let Waters = [];
    
    
    const floorSize = 20;




    const bossSlime = new BossSlime(scene, 10, 1, 10);
    Mobs.push(bossSlime);

    const Box1 = new Box(scene, 3, 1, 3);
    Tools.push(Box1);
    MapLayout.push(Box1.MapLayoutMesh);
    const Box2 = new Box(scene, 17, 1, 3);
    Tools.push(Box2);
    MapLayout.push(Box2.MapLayoutMesh);
    const Box3 = new Box(scene, 3, 1, 17);
    Tools.push(Box3);
    MapLayout.push(Box3.MapLayoutMesh);
    const Box4 = new Box(scene, 17, 1, 17);
    Tools.push(Box4);
    MapLayout.push(Box4.MapLayoutMesh);

    const exit = new Exit(scene, 19, 1, 19);
    Exits.push(exit.MapLayoutMesh);
    
    

    // Add ground tiles (10x10 grid)
    for (let x = -1; x < floorSize + 1; x++) {
        const treeOne = new Tree(scene, -1, 1, x);
        //MapLayout.push(treeOne.MapLayoutMesh);
        const treeTwo = new Tree(scene, 20, 1, x);
        //MapLayout.push(treeTwo.MapLayoutMesh);
        const treeThree = new Tree(scene, x, 1, -1);
        //MapLayout.push(treeThree.MapLayoutMesh);
        const treeFour = new Tree(scene, x, 1, 20);
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
            const dirtFloor = new DirtFloor(scene, x, 0, z);
            MapLayout.push(dirtFloor.MapLayoutMesh);
        }
    }

    return {MapLayout, Mobs, Signs, Exits, Tools, Waters};  // Return all tiles for collision detection
}
