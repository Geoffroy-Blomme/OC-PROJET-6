function displayModal (element) {
  element.style.display = 'block'
  const body = document.querySelector('body')
  body.style.overflow = 'hidden'
  element.style.overflow = 'auto'
}

function getBodyHeight () {
  const body = document.querySelector('body')
  return body.offsetHeight
}

function closeModal (element) {
  element.style.display = 'none'
  const body = document.querySelector('body')
  body.style.overflow = ''
}

export { displayModal, getBodyHeight, closeModal }
