import { displayModal, closeModal } from "../utils/modal.js";
import { photographerFactory } from "../factories/photographer.js";
import { contactFormAddEventListeners } from "../utils/contactForm.js";
import { mediaFactory } from "../factories/media.js";
const params = new URL(document.location).searchParams;
const id = params.get("id");
const lightboxModal = document.querySelector("#lightbox_modal");
const lightboxCloseButton = document.querySelector(".lightbox__close-button");
const mediaSection = document.querySelector(".medias");
const stickyInfoLikesNumber = document.querySelector(
  ".sticky-info .likes__number"
);

let photographerData;
let photographerMedia;
let lightboxMediaCounter = 0;
const lightboxVideo = document.querySelector(".lightbox-video");
const lightboxImg = document.querySelector(".lightbox-img");

async function getPhotographers() {
  const photographers = await fetch("../../data/photographers.json");
  const photographersJson = await photographers.json();
  return photographersJson;
}

// Renvoie les elements de media qui ont le photographerId mis en parametre
function getMedia(photographerId, media) {
  const medias = [];
  media.forEach((elt) => {
    if (elt.photographerId === parseInt(photographerId)) {
      medias.push(elt);
    }
  });
  return medias;
}

// Renvoie le photographe qui a le photographerId dans les photographers
function getPhotographerData(photographerId, photographers) {
  for (let i = 0; i < photographers.length; i++) {
    if (photographers[i].id === parseInt(photographerId)) {
      return photographers[i];
    }
  }
}

async function displayDataPhotographer(photographer) {
  const photographHeader = document.querySelector(".photograph-header");
  const photographerModel = photographerFactory(photographer);
  const photographerHeaderDOM = photographerModel.getPhotographerHeaderDOM();
  photographHeader.appendChild(photographerHeaderDOM);
}

async function displayDataMedia(medias, name) {
  const mediaModel = mediaFactory(medias, name);
  const mediaCardDOM = mediaModel.getMediaCardDOM();
  mediaSection.appendChild(mediaCardDOM);
}

function stickyInfoPrice(photographerData) {
  const stickyInfoPrice = document.querySelector(".sticky-info__price");
  stickyInfoPrice.innerHTML = photographerData.price + "€ / jour";
}

// retourne la somme des likes des medias.
function getTotalOfLikes() {
  const likesNumbers = document.querySelectorAll(".likes__number");
  let totalLikes = 0;
  likesNumbers.forEach((elt) => {
    // On verifie que le contenu soit bien un numero et que ce ne soit pas vide.
    if (!isNaN(elt.innerText) && elt.innerText !== "") {
      totalLikes += parseInt(elt.innerText);
    }
  });
  return totalLikes;
}

function stickyInfoDisplayLikesNumber() {
  stickyInfoLikesNumber.innerHTML = getTotalOfLikes();
}

function contactModalAddNameToTitle(name) {
  const contactModalTitle = document.querySelector(".contact_modal__title");
  contactModalTitle.innerText += `\r\n ${name}`;
}

function lightBoxModalIsClosed() {
  closeModal(lightboxModal);
  lightboxArrowKeyboardToggle(false);
}

function lightboxModalIsOpened(evt) {
  displayModal(lightboxModal);
  const article = evt.currentTarget.parentNode;
  lightboxMediaCounter = article.getAttribute("data-value");
  lightBoxChangeContent(lightboxMediaCounter);
  lightboxArrowKeyboardToggle(true);
}

function lightboxArrowKeyboardAction(event) {
  if (event.key === "ArrowLeft") {
    lightboxPreviousMedia();
  }
  if (event.key === "ArrowRight") {
    lightboxNextMedia();
  }
}

// Si le parametre open est True : va ajouter les actions des touches du clavier sur la LightBox, si False il va les enlever.
function lightboxArrowKeyboardToggle(open) {
  // On ouvre la lightbox
  if (open) {
    window.document.addEventListener("keydown", lightboxArrowKeyboardAction);
  } else {
    // On ferme la lightbox
    window.document.removeEventListener("keydown", lightboxArrowKeyboardAction);
  }
}

// Va changer le contenu de la Lightbox, le media et le titre, par ex, en fonction des donnees qui se trouvent dans photographerMedia[lightboxMediaCounter];
async function lightBoxChangeContent(lightboxMediaCounter) {
  const data = photographerMedia[lightboxMediaCounter];
  lightBoxChangeMedia(data);
  const lightboxContentTitle = document.querySelector(
    ".lightbox__content__title"
  );
  lightboxContentTitle.innerText = data.title;
}

function lightBoxChangeMedia(data) {
  if ("image" in data) {
    lightBoxChangeMediaImg(data);
  }

  if ("video" in data) {
    lightBoxChangeMediaVideo(data);
  }
}

function lightBoxChangeMediaImg(data) {
  lightboxVideo.style.display = "none";
  lightboxImg.style.display = "";
  const mediaModel = mediaFactory();
  const newSrc = `${mediaModel.getPhotographerLink(photographerData.name)}/${
    data.image
  }`;
  lightboxImg.src = newSrc;
  const imgAlt = `Picture of ${data.title}`;
  lightboxImg.setAttribute("alt", imgAlt);
}

function lightBoxChangeMediaVideo(data) {
  lightboxImg.style.display = "none";
  lightboxVideo.style.display = "";
  lightboxVideo.setAttribute("controls", "");
  const mediaModel = mediaFactory();
  const newSrc = `${mediaModel.getPhotographerLink(photographerData.name)}/${
    data.video
  }`;
  lightboxVideo.src = newSrc;
  const videoAlt = `Video of ${newSrc}`;
  lightboxVideo.setAttribute("alt", videoAlt);
}

//
function lightboxControlArrowIsClicked(indexChange) {
  if (indexChange === 1) {
    // On est au dernier media et on veut le prochain, donc on revient au premier
    if (lightboxMediaCounter === photographerMedia.length - 1) {
      lightboxMediaCounter = 0;
    } else {
      lightboxMediaCounter++;
    }
  } else if (indexChange === -1) {
    // On est au premier media et on veut le predecent, donc on va au dernier
    if (lightboxMediaCounter === 0) {
      lightboxMediaCounter = photographerMedia.length - 1;
    } else {
      lightboxMediaCounter--;
    }
  }
  lightBoxChangeContent(lightboxMediaCounter);
}

function lightboxPreviousMedia() {
  lightboxControlArrowIsClicked(-1);
}

function lightboxNextMedia() {
  lightboxControlArrowIsClicked(+1);
}

function likeButtonIsClicked(likeButton) {
  const parent = likeButton.currentTarget.parentNode;
  const likesNumber = parent.querySelector(".likes__number");
  const dataLiked = likeButton.currentTarget.getAttribute("data-liked");
  let newLikesNumber = parseInt(likesNumber.innerText);
  let newStickyInfoLikesNumber = parseInt(stickyInfoLikesNumber.innerText);
  // Le media etait deja liked
  if (dataLiked === "true") {
    likeButton.currentTarget.setAttribute("data-liked", "false");
    newStickyInfoLikesNumber--;
    newLikesNumber--;
  } else {
    likeButton.currentTarget.setAttribute("data-liked", "true");
    newStickyInfoLikesNumber++;
    newLikesNumber++;
  }
  stickyInfoLikesNumber.innerText = "" + newStickyInfoLikesNumber;
  likesNumber.innerText = "" + newLikesNumber;
}

function sortButtonIsClicked(sortingFunction) {
  // On vide le container.
  clearMediasContainer();
  // On trie les media
  sortMedias(sortingFunction);
  // On display les medias qui sont maintenant triees.
  displayDataMedia(photographerMedia, photographerData.name);
  // On rajoute les events listeners aux medias crees.
  addEventListenersToMedia();
}

function sortMedias(sortingFunction) {
  photographerMedia.sort(sortingFunction);
}

// Supprime le container contenant les medias
function clearMediasContainer() {
  const mediasContainer = document.querySelector(".medias-container");
  mediasContainer.remove();
}

// Renvoie -1 si a a plus de likes que b, 1 si b a plus de likes que a, 0 si egal.
function sortByPopularity(a, b) {
  const nbOfLikesA = parseInt(a.likes);
  const nbOfLikesB = parseInt(b.likes);

  if (nbOfLikesA < nbOfLikesB) {
    return -1;
  }
  if (nbOfLikesA > nbOfLikesB) {
    return 1;
  }
  return 0;
}

// Renvoie -1 si a est plus récent que b, 1 si b est plus récent que a, 0 si égal.
function sortByDate(a, b) {
  const dateA = Date.parse(a.date);
  const dateB = Date.parse(b.date);

  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
}

// Renvoie 1 si le titre de a est plus que b petit dans l'ordre alphabétique, -1 si b est plus petit que a, 0 si ils sont égaux.
// Dans l'ordre alphabétique, la lettre b est plus 'petite' que la lettre d
function sortByTitle(a, b) {
  const titleA = a.title;
  const titleB = b.title;

  if (titleA < titleB) {
    return -1;
  }
  if (titleA > titleB) {
    return 1;
  }
  return 0;
}

// Rend l'element cliquable via les touches du clavier.
function makeClickableElementAccessible(evt) {
  const keyDown = evt.key;
  console.log("ok");
  if (keyDown === "Enter") {
    console.log("enter");

    evt.currentTarget.click();
  }
}

function addEventListenersToMedia() {
  const allThumbs = document.querySelectorAll(".thumb-imgfull");
  allThumbs.forEach((elt) => {
    // Quand un media est clique, on va mettre dans la variable lightboxMediaCounter son index dans photographerMedia.
    elt.addEventListener(
      "click",
      () => {
        lightboxMediaCounter = elt.getAttribute("data-value");
      },
      true
    );
  });

  // appuyer sur le media va ouvrir la lightbox
  const allThumbsMediaContainer = document.querySelectorAll(
    ".thumb-imgfull__media-container"
  );
  allThumbsMediaContainer.forEach((elt) => {
    elt.addEventListener("click", lightboxModalIsOpened);
    elt.addEventListener("keydown", makeClickableElementAccessible);
  });
  // appuyer sur titre du media va ouvrir la lightbox
  const allThumbsText = document.querySelectorAll(".thumb-imgfull__text");
  allThumbsText.forEach((elt) => {
    elt.addEventListener("click", lightboxModalIsOpened);
  });
}

function eventListeners() {
  addEventListenersToMedia();
  contactFormAddEventListeners();
  lightboxCloseButton.addEventListener("click", lightBoxModalIsClosed);
  const lightboxControlArrowNext = document.querySelector(
    ".lightbox__control-arrow--next"
  );
  lightboxControlArrowNext.addEventListener("click", lightboxNextMedia);
  const lightboxControlArrowPrevious = document.querySelector(
    ".lightbox__control-arrow--previous"
  );
  lightboxControlArrowPrevious.addEventListener("click", lightboxPreviousMedia);
  const likeButtons = document.querySelectorAll(".likes__logo");
  likeButtons.forEach((elt) => {
    elt.addEventListener("click", likeButtonIsClicked);
  });
  const filterPopular = document.querySelector("#filter-popularity");
  const filterDate = document.querySelector("#filter-date");
  const filterTitle = document.querySelector("#filter-title");
  filterPopular.addEventListener("click", () => {
    sortButtonIsClicked(sortByPopularity);
  });
  filterDate.addEventListener("click", () => {
    sortButtonIsClicked(sortByDate);
  });
  filterTitle.addEventListener("click", () => {
    sortButtonIsClicked(sortByTitle);
  });
}

async function init() {
  // Récupère les datas des photographes et des medias
  const { photographers, media } = await getPhotographers(); // Récupère les medias de notre photographe
  photographerMedia = getMedia(id, media);
  // Récupère les datas de notre photographe
  photographerData = getPhotographerData(id, photographers);
  displayDataPhotographer(photographerData);
  const name = photographerData.name;
  displayDataMedia(photographerMedia, name);
  stickyInfoPrice(photographerData);
  stickyInfoDisplayLikesNumber();
  contactModalAddNameToTitle(name);
  sortButtonIsClicked(sortByPopularity);
  eventListeners();
}

init();
