
import * as THREE from 'three';

export class Fire {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.position = new THREE.Vector3(x, y, z);
        this.lastCollisionTime = 0;
        this.collisionDistance = 0.7;

        // Create base flame shape geometry
        const flameShape = new THREE.Shape();
        flameShape.moveTo(0, 0);
        flameShape.bezierCurveTo(0.5, 0.5, 0.5, 1, 0, 2);  // Right side of flame
        flameShape.bezierCurveTo(-0.5, 1, -0.5, 0.5, 0, 0); // Left side of flame

        const extrudeSettings = {
            steps: 1,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        // Create materials for different parts of the flame
        const baseMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        // Create main flame
        const flameGeometry = new THREE.ExtrudeGeometry(flameShape, extrudeSettings);
        this.flameMesh = new THREE.Mesh(flameGeometry, baseMaterial);
        this.flameMesh.position.copy(this.position);
        this.flameMesh.scale.set(0.5, 0.5, 0.5);

        // Create inner flame (slightly smaller)
        const innerFlameGeometry = flameGeometry.clone();
        this.innerFlameMesh = new THREE.Mesh(innerFlameGeometry, coreMaterial);
        this.innerFlameMesh.position.copy(this.position);
        this.innerFlameMesh.scale.set(0.3, 0.3, 0.3);

        // Add point light for illumination
        this.light = new THREE.PointLight(0xff4400, 2, 4);
        this.light.position.copy(this.position);
        this.light.position.y += 0.5;

        // Add everything to the scene
        this.scene.add(this.flameMesh);
        this.scene.add(this.innerFlameMesh);
        this.scene.add(this.light);

        // Initialize animation properties
        this.clock = new THREE.Clock();
        this.time = 0;

        // Create embers (particles)
        this.createEmbers();
    }

    createEmbers() {
        const geometry = new THREE.BufferGeometry();
        const particleCount = 50;
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 0.3;
            positions[i + 1] = Math.random() * 0.8;
            positions[i + 2] = (Math.random() - 0.5) * 0.3;
            
            colors[i] = 1;
            colors[i + 1] = Math.random() * 0.5 + 0.5;
            colors[i + 2] = 0;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.embers = new THREE.Points(geometry, material);
        this.embers.position.copy(this.position);
        this.scene.add(this.embers);
    }

    checkCollision(characterMesh) {
        const distance = this.position.distanceTo(characterMesh.position);
        if (distance <= this.collisionDistance) {
            this.lastCollisionTime = Date.now();
        }
        return distance <= this.collisionDistance;
    }

    getLastCollisionTime() {
        return this.lastCollisionTime;
    }

    update() {
        this.time += this.clock.getDelta();

        // Animate flames
        const baseScale = 0.5;
        const innerScale = 0.3;
        
        // Main flame animation
        this.flameMesh.scale.x = baseScale * (1 + Math.sin(this.time * 5) * 0.1);
        this.flameMesh.scale.y = baseScale * (1 + Math.sin(this.time * 3) * 0.1);
        this.flameMesh.rotation.y = Math.sin(this.time) * 0.2;

        // Inner flame animation
        this.innerFlameMesh.scale.x = innerScale * (1 + Math.sin(this.time * 7) * 0.1);
        this.innerFlameMesh.scale.y = innerScale * (1 + Math.cos(this.time * 4) * 0.1);
        this.innerFlameMesh.rotation.y = Math.sin(this.time * 1.5) * 0.3;

        // Animate embers
        const positions = this.embers.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += 0.02;
            if (positions[i + 1] > 1) {
                positions[i + 1] = 0;
                positions[i] = (Math.random() - 0.5) * 0.3;
                positions[i + 2] = (Math.random() - 0.5) * 0.3;
            }
        }
        this.embers.geometry.attributes.position.needsUpdate = true;

        // Animate light intensity
        this.light.intensity = 2 + Math.sin(this.time * 10) * 0.2;
    }

    remove() {
        this.scene.remove(this.flameMesh);
        this.scene.remove(this.innerFlameMesh);
        this.scene.remove(this.embers);
        this.scene.remove(this.light);
    }
}