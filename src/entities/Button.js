import * as THREE from 'three';

export class Button {
    constructor(scene, x, y, z, gate) {
        this.scene = scene;
        this.MapLayoutMesh = null;
        this.gate = gate; // Associate this button with a specific gate

        // Create button mesh and set its properties
        const ButtonMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xa1843b,
            roughness: 0.5,
            metalness: 0,
        });
        const button = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.8), ButtonMaterial);
        button.castShadow = true;
        button.receiveShadow = true;
        button.position.set(x, y, z);
        this.MapLayoutMesh = button;
        scene.add(button);

        this.collisionDistance = 0.8; // Distance to detect objects
        this.triggered = false; // To track the button state
    }

    checkObjectsAbove(MayLayout) {
        let objectDetected = false;

        // Check if any object is directly above the button
        for (const object of MayLayout) {
            const distance = this.MapLayoutMesh.position.distanceTo(object.position);

            // Ensure object is within collision distance AND above the button
            const isAbove =
                object.position.y > this.MapLayoutMesh.position.y &&
                distance <= this.collisionDistance;

            if (isAbove) {
                objectDetected = true;

                if (!this.triggered) {
                    this.triggered = true; // Set triggered state
                    this.gate.unlock(); // Call the gate's unlock method
                }
                break;
            }
        }

        // If no object is detected and the button was triggered, lock the gate
        if (!objectDetected && this.triggered) {
            this.triggered = false; // Reset triggered state
            this.gate.close(); // Call the gate's lock (close) method
        }
    }

    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}
