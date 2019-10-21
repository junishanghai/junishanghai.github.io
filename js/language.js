export const __locales = [
  {
    code: 'zh-CN',
    name: 'Chinese'
  },
  {
    code: 'ja-JP',
    name: 'Japanese'
  }
]

export const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0]
  } else {
    return (
      navigator.userLanguage ||
      navigator.language ||
      navigator.browserLanguage ||
      'en'
    )
  }
}

var chosenLang = getNavigatorLanguage()

export const languageControl = function(locales, dom) {
  var drop = document.getElementById(dom)

  drop.innerHTML = ''

  locales.forEach(lang => {
    var HTMLoption = document.createElement('option')
    HTMLoption.value = lang.code
    HTMLoption.textContent = lang.name
    drop.appendChild(HTMLoption)
    if (lang.code.match(chosenLang)) {
      drop.value = lang.code
    }
  })
}
