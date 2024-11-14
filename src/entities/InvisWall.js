// src/entities/Sign.js
import * as THREE from 'three';

export class InvisWall {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        const inviseWallMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            roughness: 0.5,
            metalness: 0,
            transparent: true,
            opacity: 0.0
        });
        const inviseWallMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), inviseWallMaterial);
        inviseWallMesh.castShadow = true;
        inviseWallMesh.receiveShadow = true;
        inviseWallMesh.position.set(x, y, z);
        scene.add(inviseWallMesh);
        this.MapLayoutMesh = inviseWallMesh;

    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}