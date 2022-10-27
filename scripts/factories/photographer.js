function photographerFactory(data) {
    const { name, portrait, id, city, country, price, tagline } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const anchor = document.createElement( 'a' );
        const imgContainer = document.createElement( 'div' );
        const img = document.createElement( 'img' );
        const divLocation = document.createElement( 'div' );
        const divTagLine = document.createElement('div');
        const divPrice = document.createElement('div');
        const h2 = document.createElement( 'h2' );

        anchor.setAttribute("href","");
        anchor.setAttribute("aria-label","Lien vers page de " + name );
        img.setAttribute("src", picture);
        img.setAttribute("alt","Portrait de " + name);
        h2.textContent = name;
        divLocation.textContent = country + ", " + city ;
        divTagLine.textContent = tagline;
        divPrice.textContent = price + "€/jour";

        h2.classList.add('photographer__link__name');
        img.classList.add('photographer__pic');
        imgContainer.classList.add('photographer__link__pic-container');
        article.classList.add('photographer');
        anchor.classList.add('photographer__link');
        divLocation.classList.add("photographer__location");
        divTagLine.classList.add('photographer__tagline');
        divPrice.classList.add('photographer__price');

        imgContainer.appendChild(img);
        anchor.appendChild(imgContainer);
        anchor.appendChild(h2);
        article.appendChild(anchor);
        article.appendChild(divLocation);
        article.appendChild(divTagLine);
        article.appendChild(divPrice);

        return (article);
    }
    return { name, picture, id, city,country, price, tagline, getUserCardDOM }
}