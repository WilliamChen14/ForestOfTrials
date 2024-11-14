// src/entities/Sign.js
import * as THREE from 'three';

export class Tree {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        // Create sign mesh and set its properties
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
        this.treeTrunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), treeTrunkMaterial);
        this.treeBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), treeMaterial);
        this.treeMid = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), treeMaterial);
        this.treeTop = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), treeMaterial);
        this.treeBase.castShadow = true;
        this.treeBase.receiveShadow = true;
        this.treeMid.castShadow = true;
        this.treeMid.receiveShadow = true;
        this.treeTop.castShadow = true;
        this.treeTop.receiveShadow = true;
        this.treeTrunk.castShadow = true;
        this.treeTrunk.receiveShadow = true;
        this.treeTrunk.position.set(x,y,z);
        this.treeBase.position.set(x, y + 0.2, z);
        this.treeMid.position.set(x, y + 0.5, z);
        this.treeTop.position.set(x, y + 0.8, z);
        scene.add(this.treeTrunk);
        scene.add(this.treeBase);
        scene.add(this.treeMid);
        scene.add(this.treeTop);
        this.MapLayoutMesh = this.treeMid;
    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.treeBase);
        this.scene.remove(this.treeMid);
        this.scene.remove(this.treeTop);
        this.scene.remove(this.treeTrunk);
    }
}