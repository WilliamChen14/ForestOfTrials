// Level.js
import * as THREE from 'three';

import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { DirtFloor } from '../entities/DirtFloor.js';
import { Water } from '../entities/Water.js';
import { Fire } from '../entities/Fire.js';

export function StarterLevel(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exits = [];
    let Signs = [];
    let Tools = [];
    let Waters = [];
    
    const floorSize = 10;


    const addExit = (x,y,z) => {
        const exitMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfffc63,
            roughness: 0.5,
            metalness: 0,
        });
        const exit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 1.2), exitMaterial);
        exit.castShadow = true;
        exit.receiveShadow = true;
        exit.position.set(x, y, z);
        scene.add(exit);
        Exit.push(exit);
    }



    const signOne = new Sign(scene, 5, 1, 5, "You can jump with the space bar. \nWhen you are ready make your way to the Yellow Exit");
    Signs.push(signOne);

    const exit = new Exit(scene, 9, 1, 8);
    Exits.push(exit.MapLayoutMesh);
    
    

    // Add ground tiles (10x10 grid)
    for (let x = -1; x < floorSize + 1; x++) {
        const treeOne = new Tree(scene, -1, 1, x);
        //MapLayout.push(treeOne.MapLayoutMesh);
        const treeTwo = new Tree(scene, 10, 1, x);
        //MapLayout.push(treeTwo.MapLayoutMesh);
        const treeThree = new Tree(scene, x, 1, -1);
        //MapLayout.push(treeThree.MapLayoutMesh);
        const treeFour = new Tree(scene, x, 1, 10);
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


    }

    return {MapLayout, Mobs, Signs, Exits, Tools, Waters};  // Return all tiles for collision detection
}
