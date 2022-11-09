function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
    modal.style.height = getBodyHeight() +"px";
    document.querySelector(".contact_modal__close-logo").focus();
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

function getBodyHeight(){
    const body = document.querySelector("body");
    return body.offsetHeight;
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