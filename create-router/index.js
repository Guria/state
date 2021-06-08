import { createStore } from '../create-store/index.js'
import { bindDomEvents } from './bind-dom-events.js'

export function createRouter(routes) {
  let normalized = Object.keys(routes).map(name => {
    let value = routes[name]
    if (typeof value === 'string') {
      value = value.replace(/\/$/g, '') || '/'
      let names = (value.match(/\/:\w+/g) || []).map(i => i.slice(2))
      let pattern = value
        .replace(/[\s!#$()+,.:<=?[\\\]^{|}]/g, '\\$&')
        .replace(/\/\\:\w+/g, '/([^/]+)')
      return [
        name,
        RegExp('^' + pattern + '$', 'i'),
        (...matches) =>
          matches.reduce((params, match, index) => {
            params[names[index]] = match
            return params
          }, {}),
        value
      ]
    } else {
      return [name, ...value]
    }
  })

  let prev
  let parse = url => {
    let path = url.pathname
    path = path.replace(/\/$/, '') || '/'
    if (prev === path) return false
    prev = path

    for (let [route, pattern, cb] of normalized) {
      let match = path.match(pattern)
      if (match) {
        return { path, route, params: cb(...match.slice(1)) }
      }
    }
  }

  let router = createStore(() => {
    let navigate = (urlOrPath, historyMethod) => {
      let url = urlOrPath.href ? urlOrPath : new URL(urlOrPath, location.origin)
      let parsed = parse(url)
      if (parsed !== false) {
        set(parsed)
        historyMethod && historyMethod.call(history, null, null, url.href)
      }
    }
    let init = bindDomEvents(navigate)
    let clean = init()
    router.open = navigate
    router.routes = normalized

    if (process.env.NODE_ENV !== 'production') {
      delete router.set
      router.open = (path, historyMethod) => {
        if (typeof historyMethod !== 'function') {
          throw new Error('direct call of router.open is not supported')
        }
        navigate(path, historyMethod)
      }
    }

    return () => {
      prev = undefined
      clean()
    }
  })

  let set = router.set

  return router
}

export function getPagePath(router, name, params) {
  let route = router.routes.find(i => i[0] === name)
  if (process.env.NODE_ENV !== 'production') {
    if (!route[3]) throw new Error('RegExp routes are not supported')
  }
  return route[3].replace(/\/:\w+/g, i => '/' + params[i.slice(2)])
}

export function openPath(router, path) {
  router.open(path, history.pushState)
}

export function redirectPath(router, path) {
  router.open(path, history.replaceState)
}

export function openPage(router, name, params) {
  router.open(getPagePath(router, name, params), history.pushState)
}

export function redirectPage(router, name, params) {
  router.open(getPagePath(router, name, params), history.replaceState)
}
