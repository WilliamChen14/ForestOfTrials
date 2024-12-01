// src/entities/Sign.js
import * as THREE from 'three';

export class DirtFloor {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        // Create sign mesh and set its properties
        const DirtFloorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x5e4127,
            roughness: 0.5,
            metalness: 0,
        });
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