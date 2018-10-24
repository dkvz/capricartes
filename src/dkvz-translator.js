class DkvzTranslator {

  constructor(resources, defaultLanguage) {
    this.resources = resources;
    // I'm not doing error checking on resources, 
    // this class will throw error if things are weird.
    if (this.defaultLanguage) this.lang = defaultLanguage;
    else this.lang = Object.keys(resources)[0];
  }

  changeLanguage(lang) {
    // We're not checking if it exists in resources.
    this.lang = lang;
  }

  getLanguages() {
    return Object.keys(this.resources);
  }

  getLanguage() {
    return this.lang;
  }

  t(key) {
    return this.resources[this.lang][key];
  }

  translateTree(el) {
    el.querySelectorAll('[data-t]').forEach(n => {
      n.textContent = this.t(n.getAttribute('data-t'));
    });
    el.querySelectorAll('[data-t-attr]').forEach(n => {
      n.getAttribute('data-t-attr').split(',')
        .map(attr => attr.trim())
        .forEach(attr => {
          n.setAttribute(
            attr,
            this.t(n.getAttribute(attr))
          );
        });
    });
    // These are to be injected HTML:
    el.querySelectorAll('[data-t-h]').forEach(n => {
      n.innerHTML = this.t(n.getAttribute('data-t-h'));
    });
  }

  guessLanguageFromBrowser(window) {
    const userLang = window.navigator.language || 
      window.navigator.userLanguage;
    // Get the language string from 0 to '-':
    const dash = userLang.indexOf('-');
    const candidate = userLang.substring(
      0, 
      (dash > 0) ? dash : undefined
    );
    this.lang = this.resources[candidate] ? 
      candidate :
      Object.keys(this.resources)[0];
  }

}

export default DkvzTranslator;