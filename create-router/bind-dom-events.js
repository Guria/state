export function bindDomEvents(navigate) {
  let click = event => {
    let link = event.target.closest('a')
    if (
      !event.defaultPrevented &&
      link &&
      event.button === 0 &&
      link.target !== '_blank' &&
      link.dataset.noRouter == null &&
      link.rel !== 'external' &&
      !link.download &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      let url = new URL(link.href)
      if (url.origin === location.origin) {
        event.preventDefault()
        navigate(url, history.pushState)
        if (location.hash !== url.hash) {
          location.hash = url.hash
          if (url.hash === '' || url.hash === '#') {
            window.dispatchEvent(new HashChangeEvent('hashchange'))
          }
        }
      }
    }
  }

  let popstate = () => {
    navigate(location)
  }

  return (element = document.body, initialLocation = location) => {
    navigate(initialLocation)
    element.addEventListener('click', click)
    window.addEventListener('popstate', popstate)

    return () => {
      element.removeEventListener('click', click)
      window.removeEventListener('popstate', popstate)
    }
  }
}
