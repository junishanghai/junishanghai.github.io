/* global modelmagic, viewModel */
export const deg = (guage, v) => {
  const x = (v / guage) * 360 * Math.sign(v)
  // console.log('deg = ' + x )
  return x
}

export const rad = (guage, v) => {
  const x = (v / 360) * guage * Math.sign(v)
  // console.log('rad = ' + x )
  return x
}

export const random = function(a, b) {
  return Math.round(Math.random() * Math.max(b - a, 0)) + a
}

export const randomColorStr = noSharp =>
  //  '#' + Math.floor(Math.random() * 16777215).toString(16)
  (noSharp === true ? '' : '#') +
  '0123456789abcdef'
    .split('')
    .map(function(v, i, a) {
      return i > 5 ? null : a[Math.floor(Math.random() * 16)]
    })
    .join('')

export const randomColorRGB = head => {
  head = head || 'rgb'
  const color = randomColorStr(true)
  return sprintf(
    '{0}({1},{2},{3})',
    head,
    color.substring(0, 2),
    color.substring(4, 2),
    color.substring(4)
  )
}
export const randomColorNum = () => {
  return parseInt(randomColorStr(true), 16)
}

/**
 * キャメルケースへ変換 sampleString
 * @param string
 * @return string
 */
export const camelCase = str => {
  str = str.charAt(0).toLowerCase() + str.slice(1)
  return str.replace(/[-_](.)/g, function(match, group1) {
    return group1.toUpperCase()
  })
}

/**
 * スネークケースへ変換 sample_string
 * @param string
 * @return string
 */
export const snakeCase = str => {
  var camel = camelCase(str)
  return camel.replace(/[A-Z]/g, function(s) {
    return '_' + s.charAt(0).toLowerCase()
  })
}

/**
 * パスカルケースへ変換 SampleString
 * @param string
 * @return string
 */
export const pascalCase = str => {
  var camel = camelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
export const createElementFromHTML = html => {
  const tempEl = document.createElement('div')
  tempEl.innerHTML = html
  return tempEl.firstElementChild
}

const strip = s => {
  if (typeof s === 'undefined') return
  if (s === null) return
  return s.replace(/px|em|lem/, '').toString()
}

const stripToNum = s => {
  const n = strip(s)
  if (typeof n === 'undefined') return
  if (n === null) return
  return n * 1
}

const _DomQ = function(selector, ...argv) {
  this.el = getDomElement(selector)
  if (typeof argv === 'undefined') throw new Error('domQ not argv')
}

Object.assign(_DomQ.prototype, {
  addClass: function(classList) {
    const remove = Array.isArray(classList) ? classList : [classList]
    remove.forEach(c => {
      this.el.classList.add(c)
    })
    return this
  },
  removeClass: function(classList) {
    const remove = Array.isArray(classList) ? classList : [classList]
    remove.forEach(c => {
      this.el.classList.remove(c)
    })
    return this
  },
  setSize: function(width, height) {
    this.el.style.width = width + 'px'
    this.el.style.height = height + 'px'
    return this
  },
  setPosition: function(x, y, options) {
    const w = stripToNum(this.el.style.width)
    const h = stripToNum(this.el.style.height)
    const gw = document.body.clientWidth
    const gh = document.body.clientHeight
    if (typeof x === 'string') {
      const s = x.toString()
      options = y
      if (s.match(/right/)) {
        x = gw - w
      } else if (s.match(/left/)) {
        x = 0
      } else if (s.match(/center/)) {
        x = gw / 2 - w / 2
      }
      if (s.match(/top/)) {
        y = 0
      } else if (s.match(/bottom/)) {
        y = gh - h
      } else if (s.match(/middle/)) {
        y = gh / 2 - h / 2
      }
    }
    if (typeof x === 'undefined' || typeof y === 'undefined')
      throw new Error('domQ setPosition invalid parameter!')
    if (isNaN(x) || isNaN(y))
      throw new Error('domQ setPosition invalid parameter, value is NaN!')

    if (options) {
      Object.keys(options).forEach(prop => {
        if (prop.match(/left/)) {
          x += options[prop]
        }
        if (prop.match(/top/)) {
          y += options[prop]
        }
        if (prop.match(/right/)) {
          x -= options[prop]
        }
        if (prop.match(/bottom/)) {
          y -= options[prop]
        }
      })
    }

    this.el.style.left = x + 'px'
    this.el.style.top = y + 'px'
    return this
  }
})

export const domQ = function(selector) {
  return new _DomQ(selector)
}

export const getDomElement = selector => {
  if (typeof selector !== 'string') return selector
  if (!/\s/.test(selector) && selector.match(/^#/)) {
    return document.getElementById(selector.replace(/#/, ''))
  }
  return document.querySelector(selector)
}

export const injectAnimatedDialButtons = (addto, id) => {
  addto = addto || document.body
  id = id || 'animatedDialButtons'

  const html = '/assets/libs/modelmagic-engine/animated_dial_buttons.html'

  fetch(html)
    .then(response => {
      response
        .text()
        .then(html => {
          console.log('html = ' + html)

          const dom = createElementFromHTML(
            sprintf('<div id="{0}">{1}</div>', id, html)
          )
          addto.appendChild(dom)
        })
        .catch(e => {
          throw new Error('animatedDialButtons in fetch got error ' + e)
        })
    })
    .catch(e => {
      throw new Error('animatedDialButtons got error ' + e)
    })
}

/* makeDraggable */
export const makeDraggable = function(selector, options) {
  options = Object.assign(
    {
      draggHandle: null,
      resizeHandle: null,
      min: {
        w: 100,
        h: 200
      }
    },
    options || {}
  )
  var action = null
  var selected = null // Object of the element to be moved
  // var x_pos = 0
  //  var y_pos = 0
  var x_elem = 0
  var y_elem = 0
  var w_elem = 0
  var h_elem = 0
  var sx = 0
  var sy = 0

  // Will be called when user starts dragging an element
  function _drag_init(elem, e) {
    console.log('_drag_init')

    // Store the object of the element which needs to be moved
    action = 'move'
    selected = elem
    sx = e.pageX
    sy = e.pageY
    x_elem = selected.offsetLeft
    y_elem = selected.offsetTop
  }

  // Will be called when user starts resizing an element
  function _resize_init(elem, e) {
    // Store the object of the element which needs to be moved
    action = 'resize'
    selected = elem
    sx = e.pageX
    sy = e.pageY
    w_elem = selected.clientWidth
    h_elem = selected.clientHeight
  }

  // Will be called when user dragging an element
  function _move_elem(e) {
    if (action === 'move') {
      // x_pos = document.all ? window.event.clientX : e.pageX
      // y_pos = document.all ? window.event.clientY : e.pageY
      if (selected !== null) {
        const x = sx - e.pageX
        const y = sy - e.pageY
        console.log('x = ' + x)
        console.log('y = ' + y)
        // console.log('x_pos = ' + x_pos)
        // console.log('y_pos = ' + y_pos)
        console.log('x_elem = ' + x_elem)
        console.log('y_elem = ' + y_elem)
        // selected.style.left = x_pos - x_elem + 'px'
        // selected.style.top = y_pos - y_elem + 'px'
        selected.style.left = Math.max(x_elem - x, 0) + 'px'
        selected.style.top = Math.max(y_elem - y, 0) + 'px'
      }
    } else if (action === 'resize') {
      // x_pos = document.all ? window.event.clientX : e.pageX
      // y_pos = document.all ? window.event.clientY : e.pageY
      if (selected !== null) {
        const x = sx - e.pageX
        const y = sy - e.pageY
        console.log('sx = ' + sx)
        console.log('sy = ' + sy)
        console.log('x = ' + x)
        console.log('y = ' + y)
        // const w = selected.clientWidth - sx - x_pos
        // const h = selected.clientHeight - sy - y_pos
        const w = Math.max(options.min.w, w_elem - x)
        const h = Math.max(options.min.h, h_elem - y)
        console.log('w = ' + x)
        console.log('h = ' + y)
        selected.style.width = w + 'px'
        selected.style.height = h + 'px'
      }
    }
  }

  // Destroy the object when we are done
  function _destroy() {
    selected = null
  }
  const target =
    typeof selector === 'string' ? getDomElement(selector) : selector
  target.classList.add('draggable-element')

  /* dragg handle */
  const handle = options.draggHandle ? options.draggHandle : selector
  let handleEl = typeof handle === 'string' ? getDomElement(handle) : handle
  handleEl.classList.add('dragg-handle')
  handleEl.onmousedown = function(e) {
    _drag_init(target, e)
    return false
  }

  /* resize handle */
  if (options.resizeHandle) {
    handleEl =
      typeof options.resizeHandle === 'string'
        ? getDomElement(options.resizeHandle)
        : options.resizeHandle
    handleEl.classList.add('resize-handle')
    handleEl.onmousedown = function(e) {
      _resize_init(target, e)
      return false
    }
  }

  // document.onmousemove = _move_elem
  // document.onmouseup = _destroy
  document.addEventListener('mousemove', _move_elem)
  document.addEventListener('mouseup', _destroy)
}
/* end of makeDraggable */

export const animatedDialButtons = (
  switchSelector,
  pushInClass,
  pushOutClass
) => {
  const CLASSES = {
    BTN: 'dial-btn',
    ACTIVE: 'dial-btn--active',
    OPTION: 'dial-btn--option'
  }

  if (switchSelector) {
    const sw = getDomElement(switchSelector)
    if (sw) {
      sw.addEventListener('click', e => {
        const el = e.currentTarget
        const state = el.getAttribute('state')
        if (state === 'true') {
          pushOutClass.split(' ').forEach(name => {
            el.classList.remove(name)
          })
          el.setAttribute('state', false)
        } else {
          pushOutClass.split(' ').forEach(name => {
            el.classList.add(name)
          })
          el.setAttribute('state', true)
        }
      })
    }
  }

  var btns = document.querySelectorAll(
    `.${CLASSES.BTN}:not(.${CLASSES.OPTION})`
  )
  var toggleActive = function(e) {
    const btn = e.currentTarget
    var processClick = function(evt) {
      if (e !== evt) {
        btn.classList.remove(CLASSES.ACTIVE)
        btn.IS_ACTIVE = false
        document.removeEventListener('click', processClick)
      }
    }

    if (!btn.IS_ACTIVE) {
      btn.IS_ACTIVE = true
      btn.classList.add(CLASSES.ACTIVE)
      document.addEventListener('click', processClick)
    }
  }

  /* Bind primary buttons */
  ;[].map.call(btns, function(btn) {
    btn.addEventListener('click', toggleActive)
  })

  /* Bind a random listener to ensure underlying action would still be called */
  // const randomBtns = document.querySelectorAll(`.${CLASSES.OPTION}`)
  // ;[].map.call(randomBtns, function(btn) {
  //   btn.addEventListener('click', function(e) {
  //     console.info(`Clicked ${e.currentTarget.getAttribute('data-option')}`)
  //   })
  // })
}

export const keepPosition = (selector, position, callback) => {
  const pos = {
    el: getDomElement(selector)
  }

  position.split(' ').forEach(placement => {
    pos[placement] = true
  })

  function replacement(opt) {
    opt.el.style.visibility = 'hidden'
    const width = opt.el.clientWidth
    const height = opt.el.clientHeight
    const screenWidth = document.body.clientWidth
    const screenHeight = document.body.clientHeight

    const style = {}
    Object.keys(opt).forEach(o => {
      if (o === 'left') {
        style.left = sprintf('{0}px', 0)
      } else if (o === 'right') {
        style.right = sprintf('{0}px', 0)
      } else if (o === 'center') {
        style.left = sprintf('{0}px', screenWidth / 2 - width / 2)
      } else if (o === 'top') {
        style.top = sprintf('{0}px', 0)
      } else if (o === 'bottom') {
        style.bottom = sprintf('{0}px', 0)
      } else if (o === 'middle') {
        style.top = sprintf('{0}px', screenHeight / 2 - height / 2)
      }
    })

    Object.keys(style).forEach(css => {
      opt.el.style[css] = style[css]
    })
    opt.el.style.visibility = 'visible'
  }

  window.addEventListener(
    'resize',
    modelmagic.api(
      'debounce',
      e => {
        console.log('panel aaa')
        replacement(pos)
      },
      250
    )
  )

  if (callback) callback(pos.el)
  replacement(pos)
}

export const realizeSVG = selector => {
  selector = selector || 'img.svg'

  document.querySelectorAll(selector).forEach(el => {
    if (el.src) {
      fetch(el.src)
        .then(response => {
          if (response.status !== 200)
            throw new Error('realizeSVG pretend got error')

          response
            .text()
            .then(html => {
              const svg = createElementFromHTML(html)
              Array.prototype.forEach.call(el.classList, c => {
                if (c !== 'svg') svg.classList.add(c)
              })
              svg.removeAttribute('style')
              svg.removeAttribute('xmlns:a')
              ;['width', 'height'].forEach(a => {
                if (el.hasAttribute(a)) svg.setAttribute(a, el.getAttribute(a))
              })

              if (
                !svg.hasAttribute('viewBox') &&
                svg.hasAttribute('width') &&
                svg.hasAttribute('width')
              )
                svg.setAttribute(
                  'viewBox',
                  sprintf(
                    '0 0 {0} {1}',
                    svg.getAttribute('width'),
                    svg.getAttribute('height')
                  )
                )

              el.parentNode.replaceChild(svg, el)
            })
            .catch(err => {
              throw new Error('realizeSVG got error ' + err)
            })
        })
        .catch(err => {
          throw new Error('realizeSVG got error ' + err)
        })
    }
  })
}

export const sprintf = function(str) {
  var args = Array.prototype.slice.call(arguments, 1)
  return str.replace(/\{\{|\}\}|\{(\d+)\}/g, function(curlyBrack, index) {
    return curlyBrack === '{{' ? '{' : curlyBrack === '}}' ? '}' : args[index]
  })
}

export const isNil = val => {
  if (typeof val === 'undefined') return true
  if (val === null) return true
  return false
}

export const isEmpty = val => {
  if (isNil(val)) return true
  if (Array.isArray(val)) if (val.length === 0) return true
  if (typeof val !== 'string') return false
  if (val === '') return true
  return false
}

export const getProp = (object, path, defaultVal) => {
  const PATH = Array.isArray(path)
    ? path
    : path.split('.').filter(i => i.length)
  if (!PATH.length) {
    return object === undefined ? defaultVal : object
  }
  if (
    object === null ||
    object === undefined ||
    typeof object[PATH[0]] === 'undefined'
  ) {
    return defaultVal
  }
  return getProp(object[PATH.shift()], PATH, defaultVal)
}

export const randRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const sizeXY = (x, y) => {
  return (
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    '&nbsp;x&nbsp;' +
    y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  )
}
window.sizeXY = sizeXY

export const clientSize = e => {
  viewModel.resolution.width(document.body.clientWidth)
  viewModel.resolution.height(document.body.clientHeight)
}

export const mousePoint = e => {
  viewModel.mouse.x(e.clientX)
  viewModel.mouse.y(e.clientY)
}

export const log = text => {
  const ol = document.getElementById('log')
  const li = document.createElement('li')
  if (!text) {
    if (ol.children)
      Array.prototype.forEach.call(ol.children, o => {
        ol.removeChild(o)
      })
    return
  }
  li.appendChild(document.createTextNode(text))
  ol.appendChild(li)
}

export const list = text => {
  const ol = document.getElementById('log')
  let li
  text.forEach(v => {
    li = document.createElement('li')
    li.appendChild(document.createTextNode(v.toString()))
    ol.appendChild(li)
  })
}

export const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`
}

export const uuid = () => {
  // Public Domain/MIT
  var d = new Date().getTime() // Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0 // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
/***
 * Polyfill
 */
/* eslint-disable */
;
(function (Sheet_proto) {
  var originalInsertRule = Sheet_proto.insertRule

  if (originalInsertRule.length === 2) {
    // 2 mandatory arguments: (selector, rules)
    Sheet_proto.insertRule = function (selectorAndRule) {
      // First, separate the selector from the rule
      a: for (
        var i = 0, Len = selectorAndRule.length, isEscaped = 0, newCharCode = 0; i !== Len;
        ++i
      ) {
        newCharCode = selectorAndRule.charCodeAt(i)
        if (!isEscaped && newCharCode === 123) {
          // 123 = "{".charCodeAt(0)
          // Secondly, find the last closing bracket
          var openBracketPos = i
          var closeBracketPos = -1

          for (; i !== Len; ++i) {
            newCharCode = selectorAndRule.charCodeAt(i)
            if (!isEscaped && newCharCode === 125) {
              // 125 = "}".charCodeAt(0)
              closeBracketPos = i
            }
            isEscaped ^= newCharCode === 92 ? 1 : isEscaped // 92 = "\\".charCodeAt(0)
          }

          if (closeBracketPos === -1) break a // No closing bracket was found!
          /* else */
          return originalInsertRule.call(
            this, // the sheet to be changed
            selectorAndRule.substring(0, openBracketPos), // The selector
            selectorAndRule.substring(closeBracketPos), // The rule
            arguments[3] // The insert index
          )
        }

        // Works by if the char code is a backslash, then isEscaped
        // gets flipped (XOR-ed by 1), and if it is not a backslash
        // then isEscaped gets XORed by itself, zeroing it
        isEscaped ^= newCharCode === 92 ? 1 : isEscaped // 92 = "\\".charCodeAt(0)
      }
      // Else, there is no unescaped bracket
      return originalInsertRule.call(this, selectorAndRule, '', arguments[2])
    }
  }
})(CSSStyleSheet.prototype)