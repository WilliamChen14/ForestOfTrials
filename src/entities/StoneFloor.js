// src/entities/Sign.js
import * as THREE from 'three';

export class StoneFLoor {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        // Create sign mesh and set its properties
        const StoneFloorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4a403f,
            roughness: 0.5,
            metalness: 0,
        });
        const stoneFLoor = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), StoneFloorMaterial);
        stoneFLoor.castShadow = true;
        stoneFLoor.receiveShadow = true;
        stoneFLoor.position.set(x, y, z);
        this.MapLayoutMesh = stoneFLoor;
        scene.add(stoneFLoor);

    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}