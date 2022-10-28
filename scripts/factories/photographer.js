function photographerFactory(data) {
    const { name, portrait, id, city, country, price, tagline } = data;

    const picture = `assets/photographers/${portrait}`;

    // For each entry of data, we create a link parameter
    function createlinkParams(){
        let linkParams = "";
        
        for (const [key, value] of Object.entries(data)) {
            linkParams+= `${key}=${value}&`
          }
        return linkParams;
    }

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        article.classList.add('photographer');
        let linkParams = createlinkParams();

        const articleInnerHtml = `
            <a class="photographer__link" href="photographer.html?${linkParams}" aria-label="Lien vers page de ${name}">
                <div class="photographer__link__pic-container">
                <img src="${picture}" alt="Portrait de ${name}" class="photographer__pic">
                </div>
                <h2 class="photographer__link__name">${name}</h2>
            </a>
            <div class="photographer__location">${country}, ${city}</div>
            <div class="photographer__tagline">${tagline}</div>
            <div class="photographer__price">${price}€/jour</div>
        `
        article.innerHTML += articleInnerHtml;

        return (article);
    }
    return { name, picture, id, city,country, price, tagline, getUserCardDOM }
}