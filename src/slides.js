class Slides {

  constructor(slides, template, document) {
    this.slides = slides;
    this.document = document;
    this.dom = template.content.cloneNode(true);
    // Bind everything:
    this.dom.querySelector('[data-action="close"]')
      .addEventListener('click', this.hide.bind(this));
    this.dom.querySelector('[data-action="next"]')
      .addEventListener('click', this.next.bind(this));
    this.dom.querySelector('[data-action="previous"]')
      .addEventListener('click', this.previous.bind(this));

    this.currentSlide = 0;

    const slidesEl = this.dom.querySelector('.slide');
    this.slideNodes = this.slides.map((s, i) => {
      const nel = this.document.createElement('div');
      nel.textContent = s;
      if (i === 0) {
        // Only the first element has to be on top
        // and shown.
        this._applyShownState(nel);
      } else {
        this._applyHiddenState(nel);
      }
      slidesEl.appendChild(nel);
      return nel;
    });
    
    if (this.slides.length <= 1) {
      // Hide the controls:
      this.dom.querySelector('.bottom-controls')
        .style.display = 'none';
    }
  }

  _applyShownState(el) {
    el.style.zIndex = 2;
  }

  _applyHiddenState(el) {
    el.style.zIndex = -1;
  }

  next() {
    // We have to check the current position
    // using this.currentSlide.
    
  }

  previous() {

  }

  hide() {

  }

  attach(element) {
    element.appendChild(this.dom);
  } 

}

export default Slides;