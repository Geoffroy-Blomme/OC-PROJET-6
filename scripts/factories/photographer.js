export function photographerFactory(data) {
  const { name, portrait, id, city, country, price, tagline } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.classList.add("photographer");

    const articleInnerHtml = `
            <a class="photographer__link" href="photographer.html?id=${id}" aria-label="Lien vers page de ${name}">
                    <div class="photographer__pic-container">
                    <img src="${picture}" alt="Portrait de ${name}" class="photographer__pic">
                    </div>
                <div class="photographer__profile">
                    <h2 class="photographer__profile__name">${name}</h2>
                    <div class="photographer__profile__location">${country}, ${city}</div>
                    <div class="photographer__profile__tagline">${tagline}</div>
                    <div class="photographer__profile__price">${price}€/jour</div>
                </div>
            </a>
        `;
    article.innerHTML += articleInnerHtml;

    return article;
  }

  function getPhotographerHeaderDOM() {
    const photographerHeaderDiv = document.createElement("div");
    photographerHeaderDiv.classList.add("photograph-header__container");
    const photographerHeaderInnerHTML = `<div class="photographer__profile">
        <h2 class="photographer__profile__name">${name}</h2>
        <div class="photographer__profile__location">${country}, ${city}</div>            
        <div class="photographer__profile__tagline">${tagline}</div>
    </div>
    <button aria-label="Contact me" class="contact_button btn" ">Contactez-moi</button>
    <div class="photographer__pic-container">
        <img src="${picture}" alt="Portrait de ${name}" class="photographer__pic">
    </div>
    `;
    photographerHeaderDiv.innerHTML += photographerHeaderInnerHTML;

    return photographerHeaderDiv;
  }

  return {
    name,
    picture,
    id,
    city,
    country,
    price,
    tagline,
    getUserCardDOM,
    getPhotographerHeaderDOM,
  };
}
