let mediaLink;
function mediaFactory(data, name) {
  mediaLink = "assets/photographers";

  // Retourne le lien qui contient les medias du photographe
  function getPhotographerLink(name) {
    const slicedName = name.split(" ");
    // On recupere le prenom
    let firstName = slicedName[0];
    // Si prenom compose on remplace le - par un espace
    firstName = firstName.replace("-", " ");

    return mediaLink + "/" + firstName;
  }

  function getVideoDOM(videoData, link) {
    const videoDOM = document.createDocumentFragment();
    const videoDOMInnerHtml = `
        <video class="thumb-imgfull__video" alt="${videoData.title}" src="${link}/${videoData.video}">
        </video>
        `;
    videoDOM.innerHTML = videoDOMInnerHtml;
    return videoDOM;
  }

  function getImageDOM(imageData, link) {
    const imgDOM = document.createDocumentFragment();
    const imgDOMInnerHtml = `
        <img  class="thumb-imgfull__img" src="${link}/${imageData.image}" alt="Photo : ${imageData.title}" />
        `;
    imgDOM.innerHTML = imgDOMInnerHtml;
    return imgDOM;
  }

  function getMediaCardDOM() {
    const div = document.createElement("div");
    div.classList.add("medias-container");

    const fullMediaLink = getPhotographerLink(name);

    // pour chaque element de data on creer un thumb-imgfull
    for (let i = 0; i < data.length; i++) {
      let mediaDOM;
      if ("image" in data[i]) {
        mediaDOM = getImageDOM(data[i], fullMediaLink);
      } else if ("video" in data[i]) {
        mediaDOM = getVideoDOM(data[i], fullMediaLink);
      } else {
        return "";
      }
      const thumbImgFullInnerHtml = `
            <article data-value="${i}" class="thumb-imgfull">
                <div role="button" aria-label="Open the LightBox for ${data[i].title}" tabindex="0"  class="thumb-imgfull__media-container">
                    ${mediaDOM.innerHTML}
                </div>
                
                <div class="thumb-imgfull__text-container">
                    <span class="thumb-imgfull__text">
                        ${data[i].title}
                    </span>
            
                    <div class="likes">
                        <span class="likes__number">
                            ${data[i].likes}
                        </span>
                        <span data-liked="false" class="likes__logo">
                            &hearts;
                        </span>
                    </div>
                </div> 
               
            </article>
            `;
      div.innerHTML += thumbImgFullInnerHtml;
    }
    return div;
  }
  return { data, getMediaCardDOM, mediaLink, getPhotographerLink };
}

export { mediaFactory };
