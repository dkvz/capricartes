class DkvzTranslator {

  constructor(resources, initialLanguage) {
    this.resources = resources;
    // I'm not doing error checking on resources, 
    // this class will throw error if things are weird.
    if (this.initialLanguage) this.lang = initialLanguage;
    else this.lang = Object.keys(resouces)[0];
  }

  changeLanguage(lang) {
    // We're not checking if it exists in resources.
    this.lang = lang;
  }

  t(key) {
    return this.resources[this.lang][key];
  }

  translateTree(el) {
    el.querySelectorAll('[data-t]').forEach(n => {
      n.textContent = this.t(n.getAttribute('[data-t]'));
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
  }

  guessLanguageFromBrowser(window) {
    
  }

}

export default DkvzTranslator;