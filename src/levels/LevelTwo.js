// Level.js
import * as THREE from 'three';

export function LevelTwo(scene) {
    let MapLayout = [];
    let Mobs = [];
    let Exit = [];
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

    addSign(5, 1, 5);
    addExit(10,1,9);
    

    // Add ground tiles (10x10 grid)
    for (let x = -1; x < floorSize + 1; x++) {
        addTree(-1, 1, x);
        addTree(10, 1, x);
        addTree(x, 1, -1);
        addTree(x, 1, 10);
        addClearTile(x, 0, -1);
        addClearTile(x, 1, -1);
        addClearTile(x, 2, -1);
        addClearTile(x, 0, floorSize);
        addClearTile(x, 1, floorSize);
        addClearTile(x, 2, floorSize);
        addClearTile(-1, 0, x);
        addClearTile(-1, 1, x);
        addClearTile(-1, 2, x);
        addClearTile(floorSize, 0, x);
        addClearTile(floorSize, 1, x);
        addClearTile(floorSize, 2, x);
        for (let z = -1; z < floorSize + 1; z++) {
            addTile(x, 0, z, 0x4a403f);
        }
    }

    // Add raised tiles to create platforms or obstacles
    addTile(2, 1, 2, 0x808000);
    addTile(2, 1, 3, 0x808000);
    
    



    return {MapLayout, Mobs, Exit};  // Return all tiles for collision detection
}
