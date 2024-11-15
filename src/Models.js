// this file manages mesh and material loading
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import TREE from '/assets/models/tree.glb'
import CHARACTER from '/assets/models/character.glb'

// instantiate a loader
const loader = new GLTFLoader();



const MATERIALS = {
    "treeLeaves0": new THREE.MeshToonMaterial({
        color: new THREE.Color(0x4f7500),  // Set to desired color (e.g., orange)
        gradientMap: null,           // Optional: define gradientMap for toon shading
      }),
    "treeTrunk": new THREE.MeshToonMaterial({
        color: new THREE.Color(0x3f2515),  // Set to desired color (e.g., orange)
        gradientMap: null,           // Optional: define gradientMap for toon shading
      }),
    "CharacterSkin": new THREE.MeshToonMaterial({
        color: new THREE.Color(0x9f9515),  // Set to desired color (e.g., orange)
        gradientMap: null,           // Optional: define gradientMap for toon shading
      }),
    "CharacterShirt": new THREE.MeshToonMaterial({
        color: new THREE.Color(0x3f25f5),  // Set to desired color (e.g., orange)
        gradientMap: null,           // Optional: define gradientMap for toon shading
      }),
    "CharacterBackpack": new THREE.MeshToonMaterial({
        color: new THREE.Color(0x7f5515),  // Set to desired color (e.g., orange)
        gradientMap: null,           // Optional: define gradientMap for toon shading
      }),
    "CharacterKicks": new THREE.MeshToonMaterial({
        color: new THREE.Color(0x8f8585),  // Set to desired color (e.g., orange)
        gradientMap: null,           // Optional: define gradientMap for toon shading
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