// this file manages mesh and material loading
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import TREE from '/assets/models/tree.glb'
import CHARACTER from '/assets/models/character.glb'

// instantiate a loader
const loader = new GLTFLoader();



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
    loader.load( TREE, function ( object ) {
        console.log("created tree")
        object.scene.traverse((node) => {
            if (node.isMesh) {
                const prevNodeMaterial = node.material;
                node.material = MATERIALS[node.material.name];
            }
        });
        object.scene.position.set(0,1,0)
        scene.add( object.scene );
    
    }, undefined, function ( error ) {
        console.error( error );
    } );

    loader.load(CHARACTER, function ( object ) {
        console.log("created tree")
        object.scene.traverse((node) => {
            if (node.isMesh) {
                const prevNodeMaterial = node.material;
                console.log(node.material.name)
                node.material = MATERIALS[node.material.name];
            }
        });
        object.scene.position.set(0,1,0)
        scene.add( object.scene );
    
    }, undefined, function ( error ) {
        console.error( error );
    } );
}