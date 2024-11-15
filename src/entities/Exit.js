// src/entities/Sign.js
import * as THREE from 'three';

export class Exit {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        // Create sign mesh and set its properties
        const exitMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfffc63,
            roughness: 0.5,
            metalness: 0,
        });
        const exit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 1.2), exitMaterial);
        exit.castShadow = true;
        exit.receiveShadow = true;
        exit.position.set(x, y, z);
        this.scene.add(exit);
        this.MapLayoutMesh = exit;

    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}