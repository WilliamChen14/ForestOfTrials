import * as THREE from 'three';

export class Water {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.MapLayoutMesh = null;

        const textureLoader = new THREE.TextureLoader();
        const waterTexture = textureLoader.load('../../assets/water.jpg');

        waterTexture.magFilter = THREE.NearestFilter;
        waterTexture.minFilter = THREE.NearestFilter;
        waterTexture.wrapS = THREE.RepeatWrapping;
        waterTexture.wrapT = THREE.RepeatWrapping;

        // Create uniforms for the shader
        this.uniforms = {
            uTexture: { value: waterTexture },
            animation_time: { value: 0.0 }
        };

        // Shader material with scrolling effect
        const WaterMaterial = new THREE.ShaderMaterial({
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

                    // Scroll texture along X-axis
                    uv.x += animation_time * 0.1; // Adjust speed here
                    vec4 texColor = texture2D(uTexture, uv);

                    gl_FragColor = texColor;
                }
            `
        });

        // Create and position the water mesh
        const water = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), WaterMaterial);
        water.position.set(x, y, z);
        this.MapLayoutMesh = water;
        scene.add(water);

        // Update the animation in the main loop
        this.clock = new THREE.Clock();
        this.update = this.update.bind(this);
    }

    update() {
        this.uniforms.animation_time.value += this.clock.getDelta();
    }

    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}