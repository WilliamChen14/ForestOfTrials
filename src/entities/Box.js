// src/entities/Sign.js
import * as THREE from 'three';

export class Box {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        const textureLoader = new THREE.TextureLoader();
        const boxTexture = textureLoader.load('../../assets/box.png');

        // Create sign mesh and set its properties
        const BoxMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xa1843b,
            map: boxTexture,
            roughness: 0.5,
            metalness: 0,
        });
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), BoxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        box.position.set(x, y, z);
        this.MapLayoutMesh = box;
        scene.add(box);

        this.collisionDistance = 0.8;

    }

    checkCollision(characterMesh) {
        const distance = this.MapLayoutMesh.position.distanceTo(characterMesh.position);
        return distance <= this.collisionDistance;
    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}