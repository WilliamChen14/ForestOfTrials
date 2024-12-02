// src/entities/Sign.js
import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const dirtTexture = textureLoader.load('../../assets/dirt.png');
const DirtFloorMaterial = new THREE.MeshPhysicalMaterial({
    map: dirtTexture,
    color: 0xa6c977,
    roughness: 0.1,
    metalness: 0,
});

export class DirtFloor {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        // Create sign mesh and set its properties
        const dirtFloor = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), DirtFloorMaterial);
        dirtFloor.castShadow = true;
        dirtFloor.receiveShadow = true;
        dirtFloor.position.set(x, y, z);
        this.MapLayoutMesh = dirtFloor;
        scene.add(dirtFloor);

    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}