import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { redrawCanvas } from './canvas.js';


// Page Elements References
const uploadButton = document.getElementById( 'uploadButton' );
const downloadButton = document.getElementById( 'downloadButton' );

const downloadableSkin = document.getElementById( 'textureFinishedSkin' );

const chooseAlexButton = document.getElementById( 'chooseAlexButton' );
const chooseSteveButton = document.getElementById( 'chooseSteveButton' );
const alexArmSizeElements = Array.from( document.getElementsByClassName( 'alexArmSizeElement' ) );
const steveArmSizeElements = Array.from( document.getElementsByClassName( 'steveArmSizeElement' ) );

const selectableElements = Array.from( document.getElementsByClassName( 'selectableElement' ) );

const modelPreviewDiv = document.getElementById( 'modelPreviewDiv' );
const modelPreviewRotation = document.getElementById( 'modelPreviewRotation' );


// Three.js
const renderer = new THREE.WebGLRenderer({ alpha: true });
const gltfLoader = new GLTFLoader( );

const scene = new THREE.Scene( );
const camera = new THREE.PerspectiveCamera( 75, modelPreviewDiv.clientWidth / modelPreviewDiv.clientHeight, 0.1, 1000 );
renderer.setSize(modelPreviewDiv.clientWidth, modelPreviewDiv.clientHeight);
camera.aspect = modelPreviewDiv.clientWidth / modelPreviewDiv.clientHeight;
camera.updateProjectionMatrix();

const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
keyLight.position.set(1, 0.5, 1);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
fillLight.position.set(-1, 1, 1);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0x404040, 1);
backLight.position.set(1, 0, -1);
scene.add(backLight)

camera.position.z = 2;
camera.position.y = 0.5;
camera.rotation.x = -1*Math.PI/16;
modelPreviewDiv.appendChild(renderer.domElement);

let alex, steve, currentlyUsedModel;

async function loadModels( ) {
    alex = await loadModel( './scripts/models/alex.gltf' );
    steve = await loadModel( './scripts/models/steve.gltf' );
}

async function loadModel( model ) {
    return new Promise(( resolve, reject ) => {
        gltfLoader.load(model, ( model ) => resolve( model.scene ), undefined, reject);
    });
}

async function init( ) {
    await loadModels();
    chooseSteveButton.click();
}


// Event listeners
uploadButton.addEventListener( 'change', async function( ) {
    await redrawCanvas( currentlyUsedModel, renderer, scene, camera );
});

downloadButton.addEventListener( 'click', ( ) => {

    let link = document.createElement( 'a' );
    link.download = 'your_viking_skin.png';
    link.href = downloadableSkin.toDataURL( );
    link.click( );
});

selectableElements.forEach( element => {
    element.addEventListener( 'click', async ( event ) => {
        if ( event.currentTarget.classList.contains( 'selectedElement' ) ) {
            event.currentTarget.classList.remove( 'selectedElement' );
        }else {
            Array.from( event.currentTarget.parentNode.children ).forEach( element => {
                element.classList.remove( 'selectedElement' )
            });
            event.currentTarget.classList.add( 'selectedElement' );
        }

        await redrawCanvas( currentlyUsedModel, renderer, scene, camera );
    });
});

chooseAlexButton.addEventListener('click', () => {
    toggleModel( alex, alexArmSizeElements, steveArmSizeElements );
});

chooseSteveButton.addEventListener('click', () => {
    toggleModel( steve, steveArmSizeElements, alexArmSizeElements );
});


async function toggleModel( model, showElements, hideElements ) {
    showElements.forEach(element => element.classList.remove( 'hidden' ));
    hideElements.forEach(element => element.classList.remove( 'selectedElement' ));
    hideElements.forEach(element => element.classList.add( 'hidden' ));

    modelPreviewRotation.value = 0;
    model.rotation.y = 0;
    model.rotation.x = 0;
    model.rotation.z = 0;

    scene.remove( currentlyUsedModel );
    scene.add( model );
    currentlyUsedModel = model;
    await redrawCanvas( currentlyUsedModel, renderer, scene, camera );

    renderer.render( scene, camera );
}

modelPreviewRotation.addEventListener( 'input', ( event ) => {
    let rotation = (event.target.value * Math.PI) / 180;
    currentlyUsedModel.rotation.y = rotation;
    renderer.render( scene, camera );
});

window.addEventListener( 'resize', () => {
    camera.aspect = modelPreviewDiv.clientWidth / modelPreviewDiv.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelPreviewDiv.clientWidth, modelPreviewDiv.clientHeight);
    renderer.render( scene, camera );
});

window.onload = (event) => {
    init();
  };