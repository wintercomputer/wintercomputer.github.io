import * as THREE from 'three';

const baseSkin = document.getElementById( 'texturePreviewBasedSkin' );
const modelPreviewSkin = document.getElementById( 'textureModelPreview' );
const downloadableSkin = document.getElementById( 'textureFinishedSkin' );

const baseSkinCtx = baseSkin.getContext( '2d' );
const modelPreviewSkinCtx = modelPreviewSkin.getContext( '2d' );
const downloadableSkinCtx = downloadableSkin.getContext( '2d' );

modelPreviewSkinCtx.scale(1, -1);
modelPreviewSkinCtx.translate(0, -64);

export async function redrawCanvas( currentModel, renderer, scene, camera ) {
    await drawBaseSkin( baseSkinCtx );
    await drawFinishedSkin( modelPreviewSkinCtx );
    await drawFinishedSkin( downloadableSkinCtx );

    let texture = new THREE.CanvasTexture( modelPreviewSkin );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    
    currentModel.traverse(( element ) => {
        if ( element.isMesh ) {
            element.material.map = texture;
            element.material.needsUpdate = true;
        }
    });

    renderer.render(scene, camera);
}

async function drawBaseSkin( canvasCtx ) {
    return new Promise(( resolve, reject ) => {
        let importedSkin = uploadButton.files[0];
        
        if (typeof importedSkin != "undefined") {
            let reader = new FileReader();
            
            reader.onload = ( event ) => {
                let skinImage = new Image();
                skinImage.src = event.target.result;
    
                skinImage.onload = function () {
    
                    canvasCtx.clearRect( 0, 0, baseSkin.width, baseSkin.height );
                    canvasCtx.drawImage( skinImage, 0, 0 );
                    canvasCtx.imageSmoothingEnabled = false;
                };
    
                skinImage.onerror = reject;
                resolve();
            };
            
            reader.onerror = reject;
            reader.readAsDataURL( importedSkin );
        }else {
            let skinImage = new Image();
            skinImage.src = './parts/2_empty.png';

            skinImage.onload = function () {
    
                canvasCtx.clearRect( 0, 0, baseSkin.width, baseSkin.height );
                canvasCtx.drawImage( skinImage, 0, 0 );
                canvasCtx.imageSmoothingEnabled = false;
                resolve();
            };

            skinImage.onerror = reject;
        }
    });
}

async function drawFinishedSkin(canvasCtx) {
    await drawBaseSkin( canvasCtx );
    return new Promise( async ( resolve, reject ) => {
        let elements = document.getElementById('selection');
        let selectedElements = Array.from(elements.getElementsByClassName('selectedElement'));
        
        for (let element of selectedElements) {
            await new Promise((resolve, reject) => {
                let image = new Image();
                image.src = element.getAttribute( 'data-skin-link' );
                
                image.onload = function () {
                    canvasCtx.drawImage(image, 0, 0);
                    canvasCtx.imageSmoothingEnabled = false;
                    resolve();       
                };
                
                image.onerror = reject;
            });
        }
        resolve();
    });
}