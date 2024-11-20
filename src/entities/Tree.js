import * as THREE from 'three';

export class Tree {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.mapLayoutMesh = null;
        this.treeGroup = new THREE.Group();
        
        // Create more natural trunk with slight taper and bark-like texture
        const trunkGeometry = this.createTrunkGeometry();
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3525,
            roughness: 0.9,
            metalness: 0.1,
            normalScale: new THREE.Vector2(1, 1),
            // Create bark-like pattern using noise
            onBeforeCompile: (shader) => {
                shader.uniforms.time = { value: 0 };
                shader.vertexShader = `
                    varying vec2 vUv;
                    ${shader.vertexShader}
                `.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    vUv = uv;
                    `
                );
                shader.fragmentShader = `
                    varying vec2 vUv;
                    
                    // Simplex noise function
                    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
                    
                    float snoise(vec2 v) {
                        const vec4 C = vec4(0.211324865405187,
                                         0.366025403784439,
                                        -0.577350269189626,
                                         0.024390243902439);
                        vec2 i  = floor(v + dot(v, C.yy) );
                        vec2 x0 = v -   i + dot(i, C.xx);
                        vec2 i1;
                        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                        vec4 x12 = x0.xyxy + C.xxzz;
                        x12.xy -= i1;
                        i = mod289(i);
                        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                                      + i.x + vec3(0.0, i1.x, 1.0 ));
                        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                        m = m*m ;
                        m = m*m ;
                        vec3 x = 2.0 * fract(p * C.www) - 1.0;
                        vec3 h = abs(x) - 0.5;
                        vec3 ox = floor(x + 0.5);
                        vec3 a0 = x - ox;
                        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                        vec3 g;
                        g.x  = a0.x  * x0.x  + h.x  * x0.y;
                        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                        return 130.0 * dot(m, g);
                    }
                    
                    ${shader.fragmentShader}
                `.replace(
                    '#include <color_fragment>',
                    `
                    #include <color_fragment>
                    float noise = snoise(vUv * 10.0);
                    diffuseColor.rgb *= 1.0 + noise * 0.2;
                    `
                );
            }
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        // Create foliage using multiple overlapping geometric shapes
        const foliageGroup = new THREE.Group();
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5a27,
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Create multiple layers of foliage
        const foliageLayers = [
            { scale: 1.0, height: 1.8, segments: 5 },
            { scale: 0.8, height: 2.2, segments: 4 },
            { scale: 0.6, height: 2.6, segments: 3 }
        ];
        
        foliageLayers.forEach((layer) => {
            const foliage = this.createFoliageGeometry(layer.scale, layer.segments);
            const mesh = new THREE.Mesh(foliage, foliageMaterial);
            mesh.position.y = layer.height;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            foliageGroup.add(mesh);
        });
        
        // Add some random rotation to make it look more natural
        foliageGroup.rotation.y = Math.random() * Math.PI * 2;
        
        // Add small details like branches
        const branchMaterial = trunkMaterial.clone();
        branchMaterial.color.setHex(0x3a2815);
        
        for (let i = 0; i < 4; i++) {
            const branch = this.createBranch();
            branch.material = branchMaterial;
            branch.position.y = 0.8 + Math.random() * 0.8;
            branch.rotation.y = (Math.PI * 2 / 4) * i;
            branch.rotation.z = Math.random() * 0.2 - 0.1;
            this.treeGroup.add(branch);
        }
        
        this.treeGroup.add(trunk);
        this.treeGroup.add(foliageGroup);
        
        // Position the entire tree
        this.treeGroup.position.set(x, y - 0.3, z);
        scene.add(this.treeGroup);
        
        // Set reference for collision detection
        this.mapLayoutMesh = trunk;
    }
    
    createTrunkGeometry() {
        const points = [];
        const segments = 8;
        const height = 1.6;
        const baseRadius = 0.3;
        const topRadius = 0.15;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const radius = baseRadius * (1 - t) + topRadius * t;
            points.push(new THREE.Vector2(radius, height * t));
        }
        
        const geometry = new THREE.LatheGeometry(points, 8);
        // Add some random displacement to make it look more natural
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const noise = (Math.random() - 0.5) * 0.05;
            positions[i] += noise;
            positions[i + 2] += noise;
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }
    
    createFoliageGeometry(scale, segments) {
        const geometry = new THREE.ConeGeometry(0.8 * scale, 1.2, segments);
        const positions = geometry.attributes.position.array;
        
        // Add random displacement to make it look less geometric
        for (let i = 0; i < positions.length; i += 3) {
            if (positions[i + 1] < 0.9) { // Don't displace the top point too much
                positions[i] += (Math.random() - 0.5) * 0.2 * scale;
                positions[i + 1] += (Math.random() - 0.5) * 0.1 * scale;
                positions[i + 2] += (Math.random() - 0.5) * 0.2 * scale;
            }
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }
    
    createBranch() {
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.2, 0.1, 0),
            new THREE.Vector3(0.4, 0.15, 0),
            new THREE.Vector3(0.6, 0.1, 0)
        ];
        
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 8, 0.04, 8, false);
        return new THREE.Mesh(geometry);
    }
    
    remove() {
        this.scene.remove(this.treeGroup);
    }
}