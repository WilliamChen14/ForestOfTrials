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
                      if (MATERIALS[node.material.name] == undefined) {
                        console.error(`cannot find material named '${node.material.name}'`)
                        return;
                      }
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
                if (offsets !== undefined) {
                  if (offsets.transformOffset !== undefined) {
                    gltf.scene.position.set(
                      offsets.transformOffset.x,
                      offsets.transformOffset.y, 
                      offsets.transformOffset.z
                    );
                  }
                  if (offsets.rotationOffset !== undefined) {
                    gltf.scene.rotation.set(
                      offsets.rotationOffset.x,
                      offsets.rotationOffset.y, 
                      offsets.rotationOffset.z
                    );
                  }
                  if (offsets.scaleOffset !== undefined) {
                    gltf.scene.scale.set(
                      offsets.scaleOffset.x,
                      offsets.scaleOffset.y,
                      offsets.scaleOffset.z
                    );
                  }
                }

                // add shadows
                gltf.scene.traverse((child) => {
                  if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                });

                // Resolve the promise with the mixer
                resolve({mixer: mixer, sceneObject: gltf.scene });
            
            }, undefined, function ( error ) {
                console.error( error );
                reject(error);
            } );
        }).then((results) => {
          console.log(`loaded ${path}`);
            this.mixer = results.mixer;
            this.sceneObject = results.sceneObject;
        });
    }
}

const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('../../assets/wood.png');

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
    "npcHat": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x858585),  // Set to desired color (e.g., orange)
        roughness: 0.2,
        metalness: 1.0,
      }),
    "npcKicks": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x8f2835),  // Set to desired color (e.g., orange)
        roughness: 0.2,
        metalness: 1.0,
      }),
    "npcShirt": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xc5c530),  // Set to desired color (e.g., orange)
        roughness: 0.8,
        metalness: 0.0,
      }),
    "npcSkin": new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x7f3235),  // Set to desired color (e.g., orange)
        roughness: 0.4,
        metalness: 0.0,
      }),
    "signMaterial": new THREE.MeshPhysicalMaterial({
        map: woodTexture,
        color: 0x73543d,
        roughness: 0.5,
        metalness: 0,
    }),
    "woodMaterial": new THREE.MeshPhysicalMaterial({
        map: woodTexture,
        color: 0x73543d,
        roughness: 0.5,
        metalness: 0,
    }),
    "rockMaterial": new THREE.MeshPhysicalMaterial({
        color: 0x73543d,
        roughness: 0.5,
        metalness: 0,
    }),
    "wall1": new THREE.MeshPhysicalMaterial({
        map: woodTexture,
        color: 0x73543d,
        roughness: 0.8,
        metalness: 0,
    }),
    "wall2": new THREE.MeshPhysicalMaterial({
        map: woodTexture,
        color: 0xa0aB74,
        roughness: 0.8,
        metalness: 0,
    }),
    "wall3": new THREE.MeshPhysicalMaterial({
        color: 0xE7AD64,
        roughness: 0.9,
        metalness: 0,
    }),
    "Material": new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        roughness: 0.5,
        metalness: 0,
    }),
};
