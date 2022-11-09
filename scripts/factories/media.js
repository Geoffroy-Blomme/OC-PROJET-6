function mediaFactory(data,name){
    const mediaLink = `assets/photographers`;

    // Retourne le lien qui contient les medias du photographe
    function getPhotographerLink(name){
        let slicedName = name.split(' ');
        //On recupere le prenom
        let firstName = slicedName[0];
        //Si prenom compose on remplace le - par un espace
        firstName = firstName.replace('-',' ');
        return firstName;
    }

    function getVideoDOM(videoData, link){
        let videoDOM = document.createDocumentFragment();
        const videoDOMInnerHtml = 
        `
        <video controls class="thumb-imgfull__video" src="${link}/${videoData.video}">
        </video>
        `;
        videoDOM.innerHTML = videoDOMInnerHtml;
        return videoDOM;
    }

    function getImageDOM(imageData, link){
        let imgDOM = document.createDocumentFragment();
        const imgDOMInnerHtml = 
        `
        <img  class="thumb-imgfull__img" src="${link}/${imageData.image}" alt="Photo : ${data[i].title}" />
        `;
        imgDOM.innerHTML = imgDOMInnerHtml;
        return imgDOM;
    }

    function getMediaCardDOM(){
        const div = document.createElement("div");
        div.classList.add('medias-container');
        
        const fullMediaLink = mediaLink +'/' + getPhotographerLink(name);            

        // pour chaque element de data on creer un thumb-imgfull
        for(i = 0; i < data.length ; i++){
            let mediaDOM;
            if('image' in data[i]){
                mediaDOM = getImageDOM(data[i],fullMediaLink);
            }

            else if('video' in data[i]){
                mediaDOM = getVideoDOM(data[i],fullMediaLink);
            }

            else{
                return '';
            }
            const thumbImgFullInnerHtml = 
            `
            <article class="thumb-imgfull">
                <div class="thumb-imgfull__media-container">
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
                        <span class="likes__logo">
                            &hearts;
                        </span>
                    </div>
                </div> 
               
            </article>
            `
            div.innerHTML += thumbImgFullInnerHtml;
        }
        return div;

    }
    return {data, getMediaCardDOM};
}