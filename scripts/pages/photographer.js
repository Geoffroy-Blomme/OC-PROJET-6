const params = (new URL(document.location)).searchParams;
let paramsValues = {};
const id = params.get('id');
const filterButton = document.querySelector(".media-filters-container");
const filtersMediaList = document.querySelector(".filter-selector__list");
const mediaSection = document.querySelector(".medias");
const stickyInfo = document.querySelector(".sticky-info");
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

async function displayDataPhotographer(photographer) {
    const photographHeader = document.querySelector(".photograph-header");
    const photographerModel = photographerFactory(photographer);
    const photographerHeaderDOM = photographerModel.getPhotographerHeaderDOM();
    photographHeader.appendChild(photographerHeaderDOM);


};

async function displayDataMedia(medias,name){
    const mediaModel = mediaFactory(medias,name);
    const mediaCardDOM =  mediaModel.getMediaCardDOM();
    mediaSection.appendChild(mediaCardDOM);
}

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

function stickyInfoPrice(photographerData){
    const stickyInfoPrice = document.querySelector(".sticky-info__price");
    stickyInfoPrice.innerHTML = photographerData.price + "€ / jour";
}

// retourne la somme des likes des medias.
function getTotalOfLikes(){
    const likesNumbers = document.querySelectorAll(".likes__number");
    let totalLikes = 0;
    likesNumbers.forEach(elt => {
        // On verifie que le contenu soit bien un numero et que ce ne soit pas vide.
        if((!isNaN(elt.innerText)) && elt.innerText != ''){
            totalLikes += parseInt(elt.innerText);
        }
    });
    return totalLikes;
}

function stickyInfoLikesNumber(){
    const stickyInfoLikesNumber = document.querySelector(".sticky-info .likes__number");
    stickyInfoLikesNumber.innerHTML = getTotalOfLikes();
}

function contactModalAddNameToTitle(name){
    const contactModalTitle = document.querySelector(".contact_modal__title");
    contactModalTitle.innerText += `\r\n ${name}`;
}

async function init() {
    // Récupère les datas des photographes et des medias
    const { photographers, media } = await getPhotographers();
    // Récupère les medias de notre photographe
    const photographerMedia = getMedia(id, media);
    // Récupère les datas de notre photographe
    const photographerData = getPhotographerData(id, photographers);
    filtersMediaListTextContent();
    displayDataPhotographer(photographerData);
    const name = photographerData.name;
    displayDataMedia(photographerMedia,name);
    stickyInfoPrice(photographerData);
    stickyInfoLikesNumber();
    contactModalAddNameToTitle(name);
}

init();