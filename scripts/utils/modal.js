function displayModal(element) {
    element.style.display = "block";
}

function getBodyHeight(){
    const body = document.querySelector("body");
    return body.offsetHeight;
}

function closeModal(element){
    element.style.display = "none";
}

export {displayModal, getBodyHeight, closeModal};