import {displayModal, getBodyHeight, closeModal} from '/scripts/utils/modal.js';

function displayContactModal() {
    const contactModal = document.querySelector("#contact_modal");
    contactModal.style.height = getBodyHeight() +"px";
    displayModal(contactModal);
    focusCloseLogo();
}

function focusCloseLogo(){
    document.querySelector(".contact_modal__close-logo").focus();
}

function closeContactModal(){
    const contactModal = document.querySelector("#contact_modal");
    closeModal(contactModal);
}

function contactFormAddEventListeners(){
    const contactButton = document.querySelector(".contact_button");
    contactButton.addEventListener("click",displayContactModal);
    const closeImg = document.querySelector(".contact_modal__close-logo");
    closeImg.addEventListener("click",closeContactModal);
    const closeButton = document.querySelector(".contact__modal__form .contact_button");
    closeButton.addEventListener("click",closeContactModal);
    closeButton.addEventListener("click",consoleLogResultOfForm);
}

function consoleLogResultOfForm(){
    let formInputs = document.querySelectorAll(".contact__modal__form input");
    let formTextAreas = document.querySelectorAll(".contact__modal__form textarea");
    for(i=0; i< formInputs.length; i++){            
        console.log(`${formInputs[i].getAttribute("name")} : ${formInputs[i].value}`);
    }
    for(i=0; i< formTextAreas.length; i++){            
        console.log(`${formTextAreas[i].getAttribute("name")} : ${formTextAreas[i].value}`);
    }
    
}

export {contactFormAddEventListeners,closeContactModal};