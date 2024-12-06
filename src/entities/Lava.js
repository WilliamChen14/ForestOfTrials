import * as THREE from 'three';

export class Lava {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;
        this.position = new THREE.Vector3(x, y, z);
        this.lastCollisionTime = 0;
        this.collisionDistance = 0.7;
        this.damageInterval = 800; // Damage every 800ms
        
        const textureLoader = new THREE.TextureLoader();
        const lavaTexture = textureLoader.load('../assets/lava.webp');
        
        lavaTexture.magFilter = THREE.NearestFilter;
        lavaTexture.minFilter = THREE.NearestFilter;
        lavaTexture.wrapS = THREE.RepeatWrapping;
        lavaTexture.wrapT = THREE.RepeatWrapping;
        
        // Create uniforms for the shader
        this.uniforms = {
            uTexture: { value: lavaTexture },
            animation_time: { value: 0.0 }
        };
        
        // Shader material with flowing lava effect
        const LavaMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float animation_time;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv;
                    float pulseInt = sin(animation_time * 2.0);
                    
                    // Create flowing effect by offsetting UV coordinates
                    float flowSpeed = 0.1;
                    //uv.x += sin(uv.y * 4.0 + animation_time) * 0.05;
                    uv.y += animation_time * 0.1;
                    
                    vec4 texColor = texture2D(uTexture, uv);
                    
                    // Add pulsing glow effect
                    float pulse =  pulseInt * 0.1 + 0.9;
                    texColor.rgb *= pulse;
                    
                    gl_FragColor = texColor;
                }
            `
        });
        
        // Create and position the lava mesh
        const lava = new THREE.Mesh(
            new THREE.BoxGeometry(1, 3.0, 1), 
            LavaMaterial
        );
        lava.position.set(x, y, z);
        this.MapLayoutMesh = lava;
        
        // Add point light for illumination
        this.light = new THREE.PointLight(0xff4400, 1, 3);
        this.light.position.copy(this.position);
        this.light.position.y += 0.5;
        
        this.scene.add(lava);
        this.scene.add(this.light);
        
        this.clock = new THREE.Clock();
        this.update = this.update.bind(this);
        
        // Create particle system for lava bubbles
        this.createBubbleParticles();
    }
    
    createBubbleParticles() {
        const geometry = new THREE.BufferGeometry();
        const particleCount = 30;
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 0.8;     // x
            positions[i + 1] = Math.random() * 0.3;         // y
            positions[i + 2] = (Math.random() - 0.5) * 0.8; // z
            
            // Orange-red colors for particles
            colors[i] = 1;                                  // r
            colors[i + 1] = 0.3 + Math.random() * 0.3;     // g
            colors[i + 2] = 0;                             // b
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.bubbles = new THREE.Points(geometry, material);
        this.bubbles.position.copy(this.position);
        this.scene.add(this.bubbles);
    }
    
    checkCollision(characterMesh) {
        const distance = this.position.distanceTo(characterMesh.position);
        const currentTime = Date.now();
        
        if (distance <= this.collisionDistance && 
            currentTime - this.lastCollisionTime >= this.damageInterval) {
            this.lastCollisionTime = currentTime;
            return true;
        }
        return false;
    }
    
    getLastCollisionTime() {
        return this.lastCollisionTime;
    }
    
    update() {
        // Update shader animation time
        this.uniforms.animation_time.value += this.clock.getDelta();
        
        // Animate bubbles
        if (this.bubbles) {
            const positions = this.bubbles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Move bubbles upward
                positions[i + 1] += 0.01;
                
                // Reset bubbles that reach the top
                if (positions[i + 1] > 0.3) {
                    positions[i + 1] = 0;
                    positions[i] = (Math.random() - 0.5) * 0.8;
                    positions[i + 2] = (Math.random() - 0.5) * 0.8;
                }
            }
            this.bubbles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate light intensity
        if (this.light) {
            this.light.intensity = 1 + Math.sin(this.uniforms.animation_time.value * 4) * 0.2;
        }
    }
    
    remove() {
        if (this.MapLayoutMesh) this.scene.remove(this.MapLayoutMesh);
        if (this.bubbles) this.scene.remove(this.bubbles);
        if (this.light) this.scene.remove(this.light);
    }
}