// this file manages mesh and material loading
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import TREE from '/assets/models/tree.glb'
import CHARACTER from '/assets/models/character.glb'

// instantiate a loader
const loader = new GLTFLoader();


export class Model {
    constructor(scene) {
        this.scene = scene;
        this.initialized = false;
        this.mixer = null;
        this.sceneObject = null;
    }

    loadModel(path) {
        /*
        new Promise((resolve, reject) => {
            loader.load(path, function ( gltf ) {
                console.log("loaded entity")
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        const prevNodeMaterial = node.material;
                        console.log(node.material.name)
                        node.material = MATERIALS[node.material.name];
                    }
                });
                gltf.scene.position.set(-2,1,0)
                // Set up AnimationMixer
                const mixer = new THREE.AnimationMixer(gltf.scene);
                const animation = gltf.animations[0]; // Play the first animation
                if (animation) {
                    const action = mixer.clipAction(animation);
                    action.play();
                }

                // Resolve the promise with the mixer
                resolve({mixer: mixer, sceneObject: gltf.scene });
            
            }, undefined, function ( error ) {
                console.error( error );
                reject(error);
            } );
        }).then((results) => {
            this.mixer = results.mixer;
            this.sceneObject = results.sceneObject;
            this.scene.add(this.sceneObject);
            console.log("Character loaded with mixer:", this.mixer);
        })
        .catch((error) => {
            console.error("Failed to load character:", error);
        });
        */
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

export function loadModel(scene) {

    console.log("loading model")
    loader.load( TREE, function ( gltf ) {
        console.log("created tree")
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                const prevNodeMaterial = node.material;
                node.material = MATERIALS[node.material.name];
            }
        });
        gltf.scene.position.set(3,1,0)
        scene.add( gltf.scene );
    
    }, undefined, function ( error ) {
        console.error( error );
    } );

    return new Promise((resolve, reject) => {
        loader.load(CHARACTER, function ( gltf ) {
            console.log("created tree")
            gltf.scene.traverse((node) => {
                if (node.isMesh) {
                    const prevNodeMaterial = node.material;
                    console.log(node.material.name)
                    node.material = MATERIALS[node.material.name];
                }
            });
            gltf.scene.position.set(3,1,2)
            // Set up AnimationMixer
            const mixer = new THREE.AnimationMixer(gltf.scene);
            const animation = gltf.animations[0]; // Play the first animation
            if (animation) {
                const action = mixer.clipAction(animation);
                action.play();
                console.log("playing anim")
            }
            scene.add( gltf.scene );

            // Resolve the promise with the mixer
            resolve(mixer);
        
        }, undefined, function ( error ) {
            console.error( error );
            reject(error);
        } );
    });
}
