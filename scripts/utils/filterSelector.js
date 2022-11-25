const filterSelector = document.querySelector('.filter-selector')
const filterList = document.querySelector('.filter-selector__list')
const arrowLogo = document.querySelector('.filter-selector__arrow-logo')

// Sera utiliser pour savoir si filterList est actuellement visible ou non.
let filterListIsVisible = false
function filterSelectorIsClicked () {
  filterListHideToggle()
  rotateArrowLogoToggle()
}

function filterListHideToggle () {
  const filterListChildren = filterList.children
  if (filterListChildren.length > 0) {
    // on commence a un pour ne pas cacher le premier enfant
    for (let i = 1; i < filterListChildren.length; i++) {
      // On verifie si la liste est actuellement visible
      if (filterListIsVisible) {
        // liste visible donc on la rend invisible
        filterListChildren[i].style.display = 'none'
      } else {
        // liste invisible donc on la rend visible
        filterListChildren[i].style.display = 'flex'
      }
    }
  }
  // C'est un toggle donc si elle etait invisible devient visible, et le contraire.
  filterListIsVisible = !filterListIsVisible
}

function rotateArrowLogoToggle () {
  let transform
  if (filterListIsVisible) {
    transform = 'rotate(180deg)'
  } else {
    transform = 'rotate(0deg)'
  }
  arrowLogo.style.transform = transform
}

// Change l'emplacement de l'element clique et du premier element de la liste contenant les filtres.
function swapPlaceClickedAndFirst (evt) {
  const filterListFirstElement = filterList.children[0]
  const indexClickedElement = getIndexClickedElement(evt.currentTarget)
  // On verifie que l'element clique se trouve bien dans la liste
  if (indexClickedElement !== -1) {
    // On interverti les places
    const replacedNode = filterList.replaceChild(
      evt.currentTarget,
      filterListFirstElement
    )
    filterList.insertBefore(
      replacedNode,
      filterList.children[indexClickedElement]
    )
  }
}

// Renvoie l'index ou se trouve l'element mis en parametre dans la liste filterList, renvoie -1 si il n'y est pas.
function getIndexClickedElement (elt) {
  for (let i = 0; i < filterList.children.length; i++) {
    if (filterList.children[i] === elt) {
      return i
    }
  }
  return -1
}

function eventListeners () {
  filterSelector.addEventListener('click', filterSelectorIsClicked)
  const filterListChildren = filterList.children
  // i commence a 1 car on ne veut pas ajouter pour le premier element.
  for (let i = 0; i < filterListChildren.length; i++) {
    filterListChildren[i].addEventListener('click', swapPlaceClickedAndFirst)
  }
}

function init () {
  eventListeners()
}

init()
