// this file manages mesh and material loading
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import MODEL from './treee.glb'

// instantiate a loader
const loader = new GLTFLoader();

export function loadModel(scene) {

    console.log("loading model")
    loader.load( MODEL, function ( object ) {
        console.log("created tree")
        object.scene.traverse((node) => {
            if (node.isMesh) {
              node.material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(0x508000),
                roughness: 0.8,
                metalness: 0,
            });
            }
          });
          object.scene.position.set(0,2,0)
        scene.add( object.scene );
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
}