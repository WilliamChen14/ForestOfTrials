// Level.js
import * as THREE from 'three';

import { Sign } from '../entities/Sign';
import { Slime } from '../entities/Slime';
import { StoneFLoor } from '../entities/StoneFloor';
import { Tree } from '../entities/Tree';
import { InvisWall } from '../entities/InvisWall';
import { BigSlime } from '../entities/BigSlime.js';
import { Box } from '../entities/Box.js';
import { Exit } from '../entities/Exit.js';

export function StarterLevelTwo(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exits = [];
    let Signs = [];
    let Tools = [];

    const floorWidth = 20;
    const floorDepth = 8;


    const signOne = new Sign(scene, 5, 1, 5, "You can attack with the j key and pick up some objects with the k key. \nWhen you are ready make your way to the Yellow Exit");
    Signs.push(signOne);
    const slimeOne = new Slime(scene, 6, 1, 6);
    Mobs.push(slimeOne);
    const slimeTwo = new Slime(scene, 8, 1, 2);
    Mobs.push(slimeTwo);
    const slimeThree = new Slime(scene, 10, 1, 4);
    Mobs.push(slimeThree);
    const slimeFour = new Slime(scene, 12, 1, 2);
    Mobs.push(slimeFour);

    const slimeBoss = new BigSlime(scene, 13, 1, 2);
    Mobs.push(slimeBoss);

    const Box1 = new Box(scene, 3, 1, 3);
    Tools.push(Box1);
    MapLayout.push(Box1.MapLayoutMesh);


    const exit = new Exit(scene, 19, 1, 5);
    Exits.push(exit.MapLayoutMesh);

    for(let x = -1; x < floorDepth + 1; x++){
        const stoneWallOne = new StoneFLoor(scene, 16, 1, x);
        MapLayout.push(stoneWallOne.MapLayoutMesh);
        const stoneWallOnet = new StoneFLoor(scene, 16, 2, x);
        MapLayout.push(stoneWallOnet.MapLayoutMesh);
    }


    

    // Add ground tiles (10x10 grid)
    for (let x = -1; x < floorWidth + 1; x++) {
        const treeOne = new Tree(scene, -1, 1, x);
        //MapLayout.push(treeOne.MapLayoutMesh);
        const treeTwo = new Tree(scene, floorWidth, 1, x);
        //MapLayout.push(treeTwo.MapLayoutMesh);
        const treeThree = new Tree(scene, x, 1, -1);
        //MapLayout.push(treeThree.MapLayoutMesh);
        const treeFour = new Tree(scene, x, 1, floorDepth);
        //MapLayout.push(treeFour.MapLayoutMesh);

        const invisWallOne = new InvisWall(scene, x, 1, -1);
        MapLayout.push(invisWallOne.MapLayoutMesh);
        const invisWallTwo = new InvisWall(scene, x, 2, -1);
        MapLayout.push(invisWallTwo.MapLayoutMesh);
        const invisWallThree = new InvisWall(scene, x, 1, floorDepth);
        MapLayout.push(invisWallThree.MapLayoutMesh);
        const invisWallFour = new InvisWall(scene, x, 2, floorDepth);
        MapLayout.push(invisWallFour.MapLayoutMesh);
        const invisWallFive = new InvisWall(scene, -1, 1, x);
        MapLayout.push(invisWallFive.MapLayoutMesh);
        const invisWallSix = new InvisWall(scene, -1, 2, x);
        MapLayout.push(invisWallSix.MapLayoutMesh);
        const invisWallSeven = new InvisWall(scene, floorWidth, 1, x);
        MapLayout.push(invisWallSeven.MapLayoutMesh);
        const invisWallEight = new InvisWall(scene, floorWidth, 2, x);
        MapLayout.push(invisWallEight.MapLayoutMesh);

        for (let z = -1; z < floorDepth + 1; z++) {
            const stoneFloor = new StoneFLoor(scene, x, 0, z);
            MapLayout.push(stoneFloor.MapLayoutMesh);
        }
    }

    return {MapLayout, Mobs, Signs, Exits, Tools};  // Return all tiles for collision detection
}
