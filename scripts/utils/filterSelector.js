const filterSelector = document.querySelector(".filter-selector");
const filterList= document.querySelector(".filter-selector__list");
const arrowLogo = document.querySelector(".filter-selector__arrow-logo");

//Sera utiliser pour savoir si filterList est actuellement visible ou non.
let filterListIsVisible = false;
function filterSelectorIsClicked(){
    filterListHideToggle();
    rotateArrowLogoToggle();
}

function filterListHideToggle(){
    const filterListChildren = filterList.children;
    if(filterListChildren.length > 0){
            // on commence a un pour ne pas cacher le premier enfant
            for(i = 1; i < filterListChildren.length ; i++){
                //On verifie si la liste est actuellement visible
                if(filterListIsVisible){
                    //liste visible donc on la rend invisible
                    filterListChildren[i].style.visibility = "inherit";
                }
                else{
                    //liste invisible donc on la rend visible
                    filterListChildren[i].style.visibility = "hidden";

                }
            }
    }
    //C'est un toggle donc si elle etait invisible devient visible, et le contraire.
    filterListIsVisible = !filterListIsVisible;
}

function rotateArrowLogoToggle(){
    let transform;
    if(filterListIsVisible){
        transform = 'rotate(0deg)';
    }
    else{
        transform = 'rotate(180deg)';
    }
    arrowLogo.style.transform = transform;

}

function eventListeners(){
    filterSelector.addEventListener("click",filterSelectorIsClicked);
}

function init(){
    eventListeners();
}

init();