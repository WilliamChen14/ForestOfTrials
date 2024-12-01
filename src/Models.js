// this file manages mesh and material loading
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import TREE from '/assets/models/tree.glb'
import CHARACTER from '/assets/models/character.glb'

// instantiate a loader
const loader = new GLTFLoader();

export class Model {
    constructor() {
        this.initialized = false;
        this.mixer = null;
        this.sceneObject = null;
    }

    async loadModel(path, offsets) {
        await new Promise((resolve, reject) => {
            loader.load(path, function ( gltf ) {
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        const prevNodeMaterial = node.material;
                        node.material = MATERIALS[node.material.name];
                    }
                });
                // Set up AnimationMixer
                const mixer = new THREE.AnimationMixer(gltf.scene);
                const animation = gltf.animations[0]; // Play the first animation
                if (animation) {
                    const action = mixer.clipAction(animation);
                    action.play();
                }
                gltf.scene.position.set(
                  offsets.transformOffset.x,
                  offsets.transformOffset.y, 
                  offsets.transformOffset.z
                );
                gltf.scene.rotation.set(
                  offsets.rotationOffset.x,
                  offsets.rotationOffset.y, 
                  offsets.rotationOffset.z
                );
                gltf.scene.scale.set(
                  offsets.scaleOffset.x,
                  offsets.scaleOffset.y, 
                  offsets.scaleOffset.z
                );

                // Resolve the promise with the mixer
                resolve({mixer: mixer, sceneObject: gltf.scene });
            
            }, undefined, function ( error ) {
                console.error( error );
                reject(error);
            } );
        }).then((results) => {
            this.mixer = results.mixer;
            this.sceneObject = results.sceneObject;
        });
    }
}


const MATERIALS = {
    "treeLeaves0": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x4f7500),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 0.0,
      }),
    "treeTrunk": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x3f2515),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 0.0,
      }),
    "characterSkin": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x9f8555),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 0.0,
      }),
    "characterShirt": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x1565c0),  // Set to desired color (e.g., orange)
        roughness: 0.8,
        metalness: 0.0,
      }),
    "characterBackpack": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x7f3515),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 0.0,
      }),
    "characterKicks": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x2f2525),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 1.0,
      }),
    "characterHat": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x3f2525),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 1.0,
      }),
    "characterBelt": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xdfd5d5),  // Set to desired color (e.g., orange)
        roughness: 0.5,
        metalness: 1.0,
      }),
};
