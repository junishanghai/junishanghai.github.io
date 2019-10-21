import {
  isNil,
  isEmpty,
  sprintf,
  camelCase,
  snakeCase,
  createElementFromHTML
} from './utilities.js'

const icon_html = '<i class="material-icons">{0}</i>'
const icon_toggle_html =
  '<i state="false" class="material-icons">{0}</i><i state="true" class="material-icons">{1}</i>'
const icons = {
  scene: sprintf(icon_toggle_html, 'folder', 'folder_open'),
  group: sprintf(
    icon_toggle_html,
    'keyboard_arrow_right',
    'keyboard_arrow_down'
  ),
  camera: sprintf(icon_html, 'videocam'),
  directionalLight: sprintf(icon_html, 'call_received'),
  spotLight: sprintf(icon_html, 'flare'),
  ambientLight: sprintf(icon_html, 'wb_sunnny'),
  hemisphereLight: sprintf(icon_html, 'wb_incandescent'),
  pointLight: sprintf(icon_html, 'highlight'),
  rectAreaLight: sprintf(icon_html, 'photo_filter'),
  lineSegments: sprintf(icon_html, 'show_chart'),
  mesh: sprintf(icon_html, 'widgets'),
  object: sprintf(icon_html, 'layers')
}

const XObject = function(object, parent) {
  this.wrapper = null
  this.object = object
  this.type = this.getTypeName()
  this.parent = typeof parent === 'undefined' ? null : parent
  this.li = null
  this.ul = null
  this.childBuff = []
  this.listeners = {}
}

Object.assign(XObject.prototype, {
  getText() {
    return sprintf('{0}<span>{1}</span>', this.getTypeIcon(), this.object.uuid)
  },
  getTypeIcon() {
    return icons[this.type] || icons['object']
  },
  getTypeName() {
    let type = null
    if (this.object.isCamera === true) {
      type = 'camera'
    } else if (this.object.isLight === true) {
      type = 'light'
      if (this.object.isAmbientLight) {
        type = 'ambientLight'
      } else if (this.object.isDirectionalLight) {
        type = 'directionalLight'
      } else if (this.object.isHemisphereLight) {
        type = 'hemisphereLight'
      } else if (this.object.pointLight) {
        type = 'pointLight'
      } else if (this.objcet.isRectAreaLight) {
        type = 'rectAreaLight'
      } else if (this.object.isSpotLight) {
        type = 'spotLight'
      }
    } else if (this.object.isCamera === true) {
      type = 'camera'
      if (this.object.isOrthographicCamera) {
        type = 'orthographicCamera'
      } else if (this.object.isPerspectiveCamera) {
        type = 'perspectiveCamera'
      }
    } else if (this.object.type.match(/scene/i)) {
      type = 'scene'
    } else if (this.object.type.match(/group/i)) {
      type = 'group'
    } else {
      type = this.object.type
    }
    return camelCase(snakeCase(type))
  },
  prepare() {
    if (this.hasChildren()) {
    }
  },
  isTrue() {
    if (!this.li) return false
    if (this.li.dataset.open) {
      return this.li.dataset.open === 'true'
    }
    if (this.li.dataset.onoff) {
      return this.li.dataset.onoff === 'true'
    }
    return false
  },
  isTop() {
    return this.parent === null
  },
  hasChildren() {
    return !isEmpty(this.object.children)
  },
  addEventListener(eventname, fn) {
    if (isNil(this.li))
      throw new Error('addListener got erorr this.li is empty!')
    this.listeners[eventname] = fn
    this.li.addEventListener(eventname, fn, false)
  },
  removeEventListener(eventname) {
    if (eventname) {
      const fn = this.listeners[eventname]
      if (fn) {
        this.li.removeEventListener(eventname, fn)
        this.listeners[eventname] = undefined
      }
    } else {
      Object.keys(this.listeners).forEach(name => {
        const fn = this.listeners[name]
        if (fn) {
          this.li.removeEventListener(eventname, fn)
          this.listeners[eventname] = undefined
        }
      })
    }
  },
  setOpenClose(open) {
    if (!isNil(this.li)) this.li.setAttribute('data-open', open)
    if (!isNil(this.ul)) this.ul.setAttribute('data-open', open)
  },
  create(open) {
    this.create_li()
    if (open) this.open()
  },
  create_li() {
    if (this.li) return this.li

    let ul
    if (this.wrapper) {
      ul = this.wrapper
    } else {
      if (isNil(this.parent.ul)) {
        console.log('create_li this.parent.ul is empty')
        return
      }
      ul = this.parent.ul
    }
    // const li = document.createElement('li')
    const li = createElementFromHTML(sprintf('<li>{0}</li>', this.getText()))
    li.setAttribute('data-open', false)
    li.id = this.object.uuid + '-li'
    //    li.appendChild(document.createTextNode(this.getText()))
    ul.appendChild(li)
    this.li = li

    const instance = this
    /* add click event listener */
    this.addEventListener('click', function(e) {
      const target = e.currentTarget
      const uuid = target.id
      const open = target.dataset.open

      console.log('click uuid = ' + uuid + ', open = ' + open)

      if (open === 'true') {
        instance.close()
      } else {
        instance.open()
      }
      e.preventDefault()
      e.stopPropagation()
    })
    return this.li
  },
  create_ul() {
    if (isNil(this.li)) throw new Error('create_ul this.li is empty!')
    if (this.ul) return this.ul
    const ul = document.createElement('ul')
    ul.classList.add('object-list')
    ul.setAttribute('data-open', false)
    ul.id = this.object.uuid + '-ul'
    this.li.appendChild(ul)
    this.ul = ul
    return this.ul
  },
  disposeSelf() {},
  open() {
    if (!this.hasChildren()) return

    this.li = this.create_li()
    this.ul = this.create_ul()

    for (let i = 0, li = this.object.children.length; i < li; i++) {
      const x = new XObject(this.object.children[i], this)
      x.create_li()
      this.childBuff.push(x)
    }
    this.setOpenClose(true)
  },
  close(clean) {
    // processing this.childBuff
    if (!isEmpty(this.childBuff)) {
      console.log('close this.childBuff is not empty')
      for (let i = this.childBuff.length; i > 0; i--) {
        const child = this.childBuff.pop()
        child.close()
      }
    }

    let p
    if (this.ul) {
      p = this.ul.parentNode
      p.removeChild(this.ul)
      this.ul = undefined
    }

    if (this.li && !this.isTop() && clean === true) {
      this.removeEventListener()
      p = this.li.parentNode
      p.removeChild(this.li)
      this.li = undefined
    }
    this.childBuff.length = 0
    this.setOpenClose(false)
  },
  setWrapper(wrapper) {
    this.wrapper = wrapper
  }
})

XObject.parse = function(root) {
  const x = new XObject(root)
  x.prepare()
  return x
}

export { XObject }
