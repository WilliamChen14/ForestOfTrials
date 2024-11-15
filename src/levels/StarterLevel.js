// Level.js
import * as THREE from 'three';

import { loadModel } from '../Models.js';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';

export function StarterLevel(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exit = [];
    let Signs = [];
    
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


    loadModel(scene);

    const signOne = new Sign(scene, 5, 1, 5, "You can jump with the space bar. \nWhen you are ready make your way to the Yellow Exit");
    Signs.push(signOne);


    addExit(10,1,9);
    

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
            const stoneFloor = new StoneFLoor(scene, x, 0, z);
            MapLayout.push(stoneFloor.MapLayoutMesh);
        }
    }

    return {MapLayout, Mobs, Signs, Exit};  // Return all tiles for collision detection
}
