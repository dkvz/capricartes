class DkvzTranslator {

  constructor(resources, defaultLanguage) {
    this.resources = resources;
    // Initializing a bunch of constants we use as
    // attributes on elements to translate:
    this.tAttr = 'data-t';
    this.tAttrs = 'data-t-attr';
    this.tHTMLAttr = 'data-t-h';
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
    el.querySelectorAll('[' + this.tAttr + ']').forEach(n => {
      n.textContent = this.t(n.getAttribute(this.tAttr));
    });
    el.querySelectorAll('[' + this.tAttrs + ']').forEach(n => {
      n.getAttribute(this.tAttrs).split(',')
        .map(attr => attr.trim())
        .forEach(attr => {
          let key;
          if (n.hasAttribute(this.tAttrs + attr)) {
            // This attribute has been translated previously.
            // We need to use the saved translate string.
            key = n.getAttribute(this.tAttrs + attr);
          } else {
            // I need to save the translate string
            // somewhere to find it later on.
            key = n.getAttribute(attr);
            n.setAttribute(
              this.tAttrs + attr, 
              key
            );
          }
          n.setAttribute(
            attr,
            this.t(key)
          );
        });
    });
    // These are to be injected HTML:
    el.querySelectorAll('[' + this.tHTMLAttr + ']').forEach(n => {
      n.innerHTML = this.t(n.getAttribute(this.tHTMLAttr));
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