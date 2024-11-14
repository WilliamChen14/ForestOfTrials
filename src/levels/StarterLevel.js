// Level.js
import * as THREE from 'three';

import { loadModel } from '../Models.js';
import { Sign } from '../entities/Sign';
import { Slime } from '../entities/Slime';
import { StoneFLoor } from '../entities/StoneFloor';
import { Tree } from '../entities/Tree';
import { InvisWall } from '../entities/InvisWall';

export function StarterLevel(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exit = [];
    let Signs = [];
    const tileSize = 1;
    const floorSize = 10;

    // Function to add tiles at specific positions with specific properties
    const addTile = (x, y, z, color) => {
        const tileMaterial = new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.5,
            metalness: 0,
        });
        const tile = new THREE.Mesh(new THREE.BoxGeometry(tileSize, 1, tileSize), tileMaterial);
        tile.castShadow = true;
        tile.receiveShadow = true;
        tile.position.set(x, y, z);
        scene.add(tile);
        MapLayout.push(tile);
    };

    const addClearTile = (x, y, z) => {
        const tileMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            roughness: 0.5,
            metalness: 0,
            transparent: true,
            opacity: 0.0
        });
        const tile = new THREE.Mesh(new THREE.BoxGeometry(tileSize, 1, tileSize), tileMaterial);
        tile.castShadow = true;
        tile.receiveShadow = true;
        tile.position.set(x, y, z);
        scene.add(tile);
        MapLayout.push(tile);
    };

    const addSign = (x, y, z) => {
        const signMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x422522,
            roughness: 0.5,
            metalness: 0,
        });
        const sign = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.2), signMaterial);
        sign.castShadow = true;
        sign.receiveShadow = true;
        sign.position.set(x, y, z);
        scene.add(sign);
        Mobs.push(sign);
    }

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

    const addTree = (x,y,z) => {
        const treeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x17541c,
            roughness: 0.5,
            metalness: 0,
        });
        const treeTrunkMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x422522,
            roughness: 0.5,
            metalness: 0,
        });
        const treeTrunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), treeTrunkMaterial);
        const treeBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), treeMaterial);
        const treeMid = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), treeMaterial);
        const treeTop = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), treeMaterial);
        treeBase.castShadow = true;
        treeBase.receiveShadow = true;
        treeMid.castShadow = true;
        treeMid.receiveShadow = true;
        treeTop.castShadow = true;
        treeTop.receiveShadow = true;
        treeTrunk.castShadow = true;
        treeTrunk.receiveShadow = true;
        treeTrunk.position.set(x,y,z);
        treeBase.position.set(x, y + 0.2, z);
        treeMid.position.set(x, y + 0.5, z);
        treeTop.position.set(x, y + 0.8, z);
        scene.add(treeTrunk);
        MapLayout.push(treeTrunk);
        scene.add(treeBase);
        MapLayout.push(treeBase);
        scene.add(treeMid);
        MapLayout.push(treeMid);
        scene.add(treeTop);
        MapLayout.push(treeTop);
    }

    loadModel(scene);

    const signOne = new Sign(scene, 5, 1, 5, "You can jump with the space bar. \nWhen you are ready make your way to the Yellow Exit");
    Signs.push(signOne);
    const slimeOne = new Slime(scene, 6, 1, 6);
    Mobs.push(slimeOne);


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

    // Add raised tiles to create platforms or obstacles
    addTile(2, 1, 2, 0x808000);
    addTile(2, 1, 3, 0x808000);
    addTile(3, 1, 2, 0x808000);
    addTile(3, 1, 3, 0x808000);
    addTile(3, 2, 2, 0x808000);
    addTile(3, 2, 3, 0x808000);

    return {MapLayout, Mobs, Signs, Exit};  // Return all tiles for collision detection
}
