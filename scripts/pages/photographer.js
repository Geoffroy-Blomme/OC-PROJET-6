import {displayModal, closeModal} from '/scripts/utils/modal.js';
import {photographerFactory} from '/scripts/factories/photographer.js';
import { contactFormAddEventListeners,closeContactModal } from '../utils/contactForm.js';
import { mediaFactory } from '../factories/media.js';
const params = (new URL(document.location)).searchParams;
let paramsValues = {};
const id = params.get('id');
const lightboxModal = document.querySelector("#lightbox_modal");
const lightboxCloseButton = document.querySelector(".lightbox__close-button");
const filterButton = document.querySelector(".media-filters-container");
const filtersMediaList = document.querySelector(".filter-selector__list");
const mediaSection = document.querySelector(".medias");
const stickyInfo = document.querySelector(".sticky-info");
const stickyInfoLikesNumber = document.querySelector(".sticky-info .likes__number");

/*
Par défaut true, sera false si le photographe n'est pas trouvable dans les données
*/
let knownPhotographer = true;

let photographerData;
let photographerMedia;
let lightboxMediaCounter = 0;
const lightboxVideo = document.querySelector(".lightbox-video");
const lightboxImg = document.querySelector(".lightbox-img");


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

function filtersMediaListTextContent(){
    const children = filtersMediaList.children;
    for(let i = 0; i<children.length; i++){
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

function stickyInfoDisplayLikesNumber(){
    stickyInfoLikesNumber.innerHTML = getTotalOfLikes();
}

function contactModalAddNameToTitle(name){
    const contactModalTitle = document.querySelector(".contact_modal__title");
    contactModalTitle.innerText += `\r\n ${name}`;
}

function addEventListenersToMedia(){
    const allThumbs = document.querySelectorAll(".thumb-imgfull");
    allThumbs.forEach(elt => {
        // Quand un media est clique, on va mettre dans la variable lightboxMediaCounter son index dans photographerMedia.
        elt.addEventListener("click", event => {
            lightboxMediaCounter = elt.getAttribute("data-value");
        },true);
        
    });

    // appuyer sur le media va ouvrir la lightbox
    const allThumbsMediaContainer = document.querySelectorAll(".thumb-imgfull__media-container");
    allThumbsMediaContainer.forEach(elt => {
        elt.addEventListener("click",lightboxModalIsOpened);
    });
    // appuyer sur titre du media va ouvrir la lightbox
    const allThumbsText = document.querySelectorAll(".thumb-imgfull__text");
    allThumbsText.forEach(elt =>{
        elt.addEventListener("click",lightboxModalIsOpened);
    });
}


function bodyToggleOverflow(){
    const body = document.querySelector("body");
    const bodyOverflow = body.style.overflow;
    if(bodyOverflow == "hidden"){
        body.style.overflow = "initial";
    }
    else if((bodyOverflow == "") || (bodyOverflow == "initial") ){
        body.style.overflow = "hidden"
    }
    else{
        body.style.overflow = "initial";
    }
}

function lightBoxModalIsClosed(){
    closeModal(lightboxModal);
    bodyToggleOverflow();
}

function lightboxModalIsOpened(){
    displayModal(lightboxModal);
    bodyToggleOverflow();
    lightBoxChangeContent();
}

// Va changer le contenu de la Lightbox, le media et le titre, par ex, en fonction des donnees qui se trouvent dans photographerMedia[lightboxMediaCounter];
async function lightBoxChangeContent(){
    const dataToPut = photographerMedia[lightboxMediaCounter];
    const lightboxContentTitle = document.querySelector(".lightbox__content__title");
    lightBoxChangeMedia(dataToPut);
}

function lightBoxChangeMedia(data){
    const lightboxContentTitle = document.querySelector(".lightbox__content__title");
    lightboxContentTitle.innerText = data.title;
    const dataToPut = photographerData;
    const mediaFac = mediaFactory(data,photographerData.name);
    const link = mediaFac.getPhotographerLink(photographerData.name) +'/' + getLinkToFile(data);
    if('image' in data){
        lightBoxChangeMediaImg(link,dataToPut);
    }
    else if('video' in data){
        lightBoxChangeMediaVideo(link,dataToPut);
    }
}

function lightBoxChangeMediaImg(link,data){
    lightboxVideo.style.display = 'none';
    lightboxImg.style.display = '';
    lightboxImg.src = link;
    const imgAlt = `Picture of ${data.title}`;
    lightboxImg.setAttribute("alt",imgAlt);
}

function lightBoxChangeMediaVideo(link,data){
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = '';
    lightboxVideo.src = link;
    lightboxVideo.setAttribute("controls",'');
    const videoAlt = `Video of ${data.title}`;
    lightboxVideo.setAttribute("alt",videoAlt);

}

// Renvoie le lien qui va renvoyer vers le media contenu dans les data
function getLinkToFile(data){
    let link = '';
    if('image' in data){
        link += data.image;
    }
    else if ('video' in data){
        link +=data.video;
    }
    return link;
}

// 
function lightboxControlArrowIsClicked(data, indexChange){
    if(indexChange == 1){
        // On est au dernier media et on veut le prochain, donc on revient au premier
        if(lightboxMediaCounter == (photographerMedia.length -1)){
            lightboxMediaCounter = 0;
        }
        else{
            lightboxMediaCounter++;
        }
    }
    else if(indexChange == -1){
        // On est au premier media et on veut le predecent, donc on va au dernier
        if(lightboxMediaCounter == 0){
            lightboxMediaCounter = (photographerMedia.length -1)
        }
        else{
            lightboxMediaCounter--;
        }
    }
    lightBoxChangeContent(photographerMedia[lightboxMediaCounter]);

}

function lightboxPreviousMedia(data){
    lightboxControlArrowIsClicked(data,-1)
}


function lightboxNextMedia(data){
    lightboxControlArrowIsClicked(data,+1);

}

function likeButtonIsClicked(likeButton){
    const parent = likeButton.currentTarget.parentNode;
    const likesNumber = parent.querySelector(".likes__number");
    const dataLiked = likeButton.currentTarget.getAttribute("data-liked");
    let newLikesNumber = parseInt(likesNumber.innerText);
    let newStickyInfoLikesNumber = parseInt(stickyInfoLikesNumber.innerText);
    //Le media etait deja liked
    if(dataLiked == "true"){
        likeButton.currentTarget.setAttribute("data-liked",'false');
        newStickyInfoLikesNumber--;  
        newLikesNumber--;      
    }
    else{
        likeButton.currentTarget.setAttribute("data-liked",'true');
        newStickyInfoLikesNumber++;
        newLikesNumber++;
    }
    stickyInfoLikesNumber.innerText = '' + newStickyInfoLikesNumber;
    likesNumber.innerText = '' + newLikesNumber;
}

function sortMedias(sortingFunction){
    const mediaContainer = document.querySelector(".medias-container");
    // On met nos element dans un array
    let mediasArray = [].slice.call(mediaContainer.children);
    // On les trie
    mediasArray.sort(sortingFunction);
    mediaContainer.innerHTML='';
    for(let i = 0; i < mediasArray.length; i++){
        mediasArray[i].setAttribute('data-value',`${i}`);
        mediaContainer.appendChild(mediasArray[i]);
    }

}


// Renvoie -1 si a a plus de likes que b, 1 si b a plus de likes que a, 0 si egal.
function sortByPopularity(a,b){
    let nbOfLikesA = parseInt(a.querySelector(".likes__number").innerText);
    let nbOfLikesB = parseInt(b.querySelector(".likes__number").innerText);

    if(nbOfLikesA < nbOfLikesB){
        return -1;
    }
    if( nbOfLikesA > nbOfLikesB){
        return 1;
    }
    return 0;
}

function sortByDate(a,b){
    let dateA = Date.parse(a.getAttribute('data-date'));
    let dateB = Date.parse(b.getAttribute('data-date'));
    if(dateA < dateB){
        return -1;
    }
    if(dateA > dateB){
        return 1;
    }
    return 0;
}

function sortByTitle(a,b){
    let titleA = a.getAttribute('data-title');
    let titleB = b.getAttribute('data-title');
    if( titleA < titleB){
        return -1;
    }
    if( titleA > titleB){
        return 1;
        
    }
    return 0;
}

function eventListeners(){
    addEventListenersToMedia();
    contactFormAddEventListeners();
    lightboxCloseButton.addEventListener("click",lightBoxModalIsClosed);
    let lightboxControlArrowNext = document.querySelector(".lightbox__control-arrow--next");
    lightboxControlArrowNext.addEventListener("click",lightboxNextMedia);
    let lightboxControlArrowPrevious = document.querySelector(".lightbox__control-arrow--previous");
    lightboxControlArrowPrevious.addEventListener("click",lightboxPreviousMedia);
    const likeButtons = document.querySelectorAll(".likes__logo");
    likeButtons.forEach(elt =>{
        elt.addEventListener("click",likeButtonIsClicked);
    });
    let filterPopular = document.querySelector("#filter-popularity");
    let filterDate = document.querySelector("#filter-date");
    let filterTitle = document.querySelector("#filter-title");
    filterPopular.addEventListener("click", () => {
        sortMedias(sortByPopularity);
    });
    filterDate.addEventListener("click", () => {
        sortMedias(sortByDate);
    });
    filterTitle.addEventListener("click", () => {
        sortMedias(sortByTitle);
    });
}

async function init() {
    // Récupère les datas des photographes et des medias
    const { photographers, media } = await getPhotographers();
    // Récupère les medias de notre photographe
    photographerMedia = getMedia(id, media);
    // Récupère les datas de notre photographe
    photographerData = getPhotographerData(id, photographers);
    filtersMediaListTextContent();
    displayDataPhotographer(photographerData);
    const name = photographerData.name;
    displayDataMedia(photographerMedia,name);
    stickyInfoPrice(photographerData);
    stickyInfoDisplayLikesNumber();
    contactModalAddNameToTitle(name);
    eventListeners();
}

init();