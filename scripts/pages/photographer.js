const params = (new URL(document.location)).searchParams;
let paramsValues = {};
const id = params.get('id');
const filterButton = document.querySelector(".media-filters-container");
const filtersMediaList = document.querySelector(".filter-selector__list");

/*
Par défaut true, sera false si le photographe n'est pas trouvable dans les données
*/
let knownPhotographer = true;

async function getPhotographers() {
    // Penser à remplacer par les données récupérées dans le json
    
    let photographers = await fetch('data/photographers.json');
    let photographersJson = await photographers.json();
    return photographersJson;
}

// Renvoie les elements de media qui ont le photographerId mis en parametre
function getMedia(photographerId, media){
    let medias= [];
    media.forEach(elt => {
        if(elt.photographerId == photographerId){
            medias.push(elt);
        }
    });    
    return medias;
}

// Renvoie le photographe qui a le photographerId dans les photographers
function getPhotographerData(photographerId, photographers){
    for (let i = 0 ; i < photographers.length; i++){
        if(photographers[i].id == photographerId){
            return photographers[i];
        }
    }

    // On a pas trouvé notre photographe dans les données
    knownPhotographer = false;
    
}

async function displayData(photographer) {
    const photographHeader = document.querySelector(".photograph-header");
    const photographerModel = photographerFactory(photographer);
    const photographerHeaderDOM = photographerModel.getPhotographerHeaderDOM();
    photographHeader.appendChild(photographerHeaderDOM);

};

// Toggle la rotation de l'arrow du filterButton
function filterButtonArrowToggle(){
    var transform;
    if(filterButtonArrow.style.transform == ""){
        transform = 'rotate(180deg)';
    }
    if(filterButtonArrow.style.transform == "rotate(180deg)"){
        transform = "rotate(0deg)";
    }
    if(filterButtonArrow.style.transform == "rotate(0deg)"){
        transform = 'rotate(180deg)';
    }
    
    filterButtonArrow.style.WebkitTransform = transform;
}


function filtersMediaListTextContent(){
    const children = filtersMediaList.children;
    for(i = 0; i<children.length; i++){
        children[i].textContent = children[i].dataset.value;
    }

}

async function init() {
    // Récupère les datas des photographes et des medias
    const { photographers, media } = await getPhotographers();
    // Récupère les medias de notre photographe
    const photographerMedia = getMedia(id, media);
    // Récupère les datas de notre photographe
    const photographerData = getPhotographerData(id, photographers);
    filtersMediaListTextContent();
    displayData(photographerData);
}

init();