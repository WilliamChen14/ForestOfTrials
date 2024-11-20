// Level.js
import * as THREE from 'three';

import { loadModel } from '../Models.js';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { Box } from '../entities/Box.js';

export function LevelOne(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exits = [];
    let Signs = [];
    let Tools = [];
    
    const floorSize = 15;



    //loadModel(scene);

    
    const signOne = new Sign(scene, -7, 1, 9, "You can reset the level by pressing \"r\"");
    Signs.push(signOne);
    

    const exit = new Exit(scene, 0, 1, 30);
    Exits.push(exit.MapLayoutMesh);
    
    const floor = new StoneFLoor(scene, 0, 0, -1);
    const treeO = new Tree(scene, -1, 1, -1);
    const invisWallO = new InvisWall(scene, -1, 1, -1);
    MapLayout.push(invisWallO.MapLayoutMesh);
    const invisWallT = new InvisWall(scene, 1, 1, -1);
    MapLayout.push(invisWallT.MapLayoutMesh);
    const floorT = new StoneFLoor(scene, 1, 0, -1);
    MapLayout.push(floorT.MapLayoutMesh);
    const floorO = new StoneFLoor(scene, -1, 0, -1);
    MapLayout.push(floorO.MapLayoutMesh);
    const treeT = new Tree(scene, 1, 1, -1);

    const floorTH = new StoneFLoor(scene, 0, 0, -2);
    MapLayout.push(floorTH.MapLayoutMesh);
    const invisWallTH = new InvisWall(scene, 0, 1, -1);
    MapLayout.push(invisWallTH.MapLayoutMesh);
    const treeTH = new Tree(scene, 0, 1, -2);

    
    

    // Add ground tiles (10x10 grid)
    for (let x = 1; x < floorSize + 1; x++) {
        const treeOne = new Tree(scene, 0-x - 1, 1, x-1);
        const invisWallOne = new InvisWall(scene, 0-x - 1, 1, x-1);
        MapLayout.push(invisWallOne.MapLayoutMesh);
        const floorOne = new StoneFLoor(scene, 0-x - 1, 0, x-1);
        MapLayout.push(floorOne.MapLayoutMesh);
        const invisWallTwo = new InvisWall(scene, x + 1, 1, x-1);
        MapLayout.push(invisWallTwo.MapLayoutMesh);
        const floorTwo = new StoneFLoor(scene, x + 1, 0, x-1);
        MapLayout.push(floorTwo.MapLayoutMesh);
        const treeTwo = new Tree(scene, x + 1, 1, x-1);
        for(let y = 0; y < x + 1; y++){
            const floorOne = new StoneFLoor(scene, y, 0, x-1);
            MapLayout.push(floorOne.MapLayoutMesh);
            const floorTwo = new StoneFLoor(scene, 0-y, 0, x-1);
            MapLayout.push(floorTwo.MapLayoutMesh);
        }
    }
    for (let x = floorSize; x >= 0; x--) {
        const treeOne = new Tree(scene, 0-x - 1, 1, (floorSize - x) + floorSize);
        const invisWallOne = new InvisWall(scene, 0-x - 1, 1, (floorSize - x) + floorSize);
        MapLayout.push(invisWallOne.MapLayoutMesh);
        const floorOne = new StoneFLoor(scene, 0-x - 1, 0, (floorSize - x) + floorSize);
        MapLayout.push(floorOne.MapLayoutMesh);
        const invisWallTwo = new InvisWall(scene, x + 1, 1, (floorSize - x) + floorSize);
        MapLayout.push(invisWallTwo.MapLayoutMesh);
        const floorTwo = new StoneFLoor(scene, x + 1, 0, (floorSize - x) + floorSize);
        MapLayout.push(floorTwo.MapLayoutMesh);
        const treeTwo = new Tree(scene, x + 1, 1, (floorSize - x) + floorSize);
        for(let y = 0; y < x + 1; y++){
            const floorOne = new StoneFLoor(scene, y, 0, (floorSize - x) + floorSize);
            MapLayout.push(floorOne.MapLayoutMesh);
            const floorTwo = new StoneFLoor(scene, 0-y, 0, (floorSize - x) + floorSize);
            MapLayout.push(floorTwo.MapLayoutMesh);
        }
    }

    for(let z = 1; z < 7; z++){
        for(let x = 0; x < 3; x++){
            for(let y = -x; y <= x; y++){
                const floorOne = new StoneFLoor(scene, y, z, 5+x);
                MapLayout.push(floorOne.MapLayoutMesh);
            }
            for(let y = -x; y <= x; y++){
                const floorOne = new StoneFLoor(scene, y, z, 9-x);
                MapLayout.push(floorOne.MapLayoutMesh);
            }
        }
    }
    const floorPeak = new StoneFLoor(scene, 0, 7, 7);
    MapLayout.push(floorPeak.MapLayoutMesh);

    for(let x = -2; x < 3; x++){
        const Box1 = new Box(scene, x, 1, 10);
        Tools.push(Box1);
        MapLayout.push(Box1.MapLayoutMesh);
    }

    for(let x = -10; x < 15; x++){
        const treeOne = new Tree(scene, x, 1, 13);
        const invisWallOne = new InvisWall(scene, x, 1, 13);
        MapLayout.push(invisWallOne.MapLayoutMesh);
    }

    for(let x = 0; x < 3; x++){
        const floorOne = new StoneFLoor(scene, -9, 1, 14+x);
        MapLayout.push(floorOne.MapLayoutMesh);
        const floorTwo = new StoneFLoor(scene, -9, 2, 14+x);
        MapLayout.push(floorTwo.MapLayoutMesh);
    }

    const slimeOne = new Slime(scene, 8, 1, 14);
    Mobs.push(slimeOne);
    const slimeTwo = new Slime(scene, 0, 1, 14);
    Mobs.push(slimeTwo);
    const slimeThree = new Slime(scene, -6, 1, 14);
    Mobs.push(slimeThree);

    for(let x = 0; x < 3; x++){
        const floorOne = new StoneFLoor(scene, 9, 1, 14+x);
        MapLayout.push(floorOne.MapLayoutMesh);
        const floorTwo = new StoneFLoor(scene, 9, 2, 14+x);
        MapLayout.push(floorTwo.MapLayoutMesh);
    }

    for(let x = -13; x < 10; x++){
        const treeOne = new Tree(scene, x, 1, 17);
        const invisWallOne = new InvisWall(scene, x, 1, 17);
        MapLayout.push(invisWallOne.MapLayoutMesh);
    }

    return {MapLayout, Mobs, Signs, Exits, Tools};  // Return all tiles for collision detection
}
