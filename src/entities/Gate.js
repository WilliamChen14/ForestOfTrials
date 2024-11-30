import * as THREE from 'three';

export class Gate {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.blocks = [];
        this.unlocked = false;
        this.timeToUnlock = 2000; // Animation duration in milliseconds

        const GateMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xa1843b,
            roughness: 0.5,
            metalness: 0,
        });

        // Create 8 blocks for the gate
        const blockWidth = 1; // Each block width
        const blockHeight = 1; // Block height
        const blockDepth = 1; // Block depth

        for (let i = 0; i < 8; i++) {
            const block = new THREE.Mesh(
                new THREE.BoxGeometry(blockWidth, blockHeight, blockDepth),
                GateMaterial
            );
            block.castShadow = true;
            block.receiveShadow = true;

            // Arrange blocks: 4 on the left and 4 on the right
            const offsetX = (i < 4 ? -1 : 1) * 0.5; // Left (-) or right (+)
            const offsetY = (i % 4) * 0.2; // Vertical stacking
            block.position.set(x + offsetX, y + offsetY, z);

            this.blocks.push(block);
            scene.add(block);
        }
    }

    unlock() {
        if (this.unlocked) return;
        this.unlocked = true;

        // Animate the blocks moving to "open"
        this.animateBlocks(true);
    }

    close() {
        if (!this.unlocked) return;
        this.unlocked = false;

        // Animate the blocks moving to "close"
        this.animateBlocks(false);
    }

    animateBlocks(opening) {
        const startTime = performance.now();

        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / this.timeToUnlock, 1);
            const direction = opening ? 1 : -1;

            for (let i = 0; i < this.blocks.length; i++) {
                const block = this.blocks[i];

                // Determine if block is part of the center
                const isCenterBlock = i === 1 || i === 2 || i === 5 || i === 6;
                const isLeftSide = i < 4;

                if (isCenterBlock) {
                    block.position.x += direction * (isLeftSide ? -1 : 1) * 0.005; // Move horizontally
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    remove() {
        // Remove all blocks from the scene
        for (const block of this.blocks) {
            this.scene.remove(block);
        }
    }
}
