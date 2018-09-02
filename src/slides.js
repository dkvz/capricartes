class Slides {

  constructor(slides, template, document) {
    this.slides = slides;
    this.document = document;
    this.transformDuration = 1.2;
    // template.content is a documentFragment, and inserting a 
    // document fragment completely empties it.
    // I wanted to keep references to the nodes in the current object,
    // so I have to get the direct child element inside the template
    // and use that as the 'dom'.
    this.dom = template.content.cloneNode(true).querySelector('.slides');
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
      nel.style.transition = 'transform ' + this.transformDuration + 's';
      slidesEl.appendChild(nel);
      if (i === 0) {
        // Only the first element has to be on top
        // and shown.
        nel.style.transform = 'translateX(100%)';
        this._applyShownState(nel);
      } else {
        this._applyHiddenState(nel);
      }
      return nel;
    });
    
    if (this.slides.length <= 1) {
      // Hide the controls:
      this.dom.querySelector('.bottom-controls')
        .style.display = 'none';
    }
  }

  _applyShownState(el) {
    el.style.display = '';
    //el.style.transition = 'transform ' + this.transformDuration + 's';
    el.style.zIndex = 2;
    setTimeout(_ => {
      el.style.transform = 'translateX(0px)';
    }, 100);
  }

  _applyHiddenState(el) {
    el.style.display = 'none';
    el.style.zIndex = 0;
  }

  _preTranslate(fromLeft) {
    //this.slideNodes[this.currentSlide].style.transition = '';
    this.slideNodes[this.currentSlide].style.transform =
      'translateX(' + (fromLeft ? '-' : '') +
      '100%)';
  }

  _slide() {
    this.slideNodes.forEach((s, i) => {
      if (i === this.currentSlide) {
        this._applyShownState(s);
      } else {
        this._applyHiddenState(s);
      }
    });
  }

  next() {
    // We have to check the current position
    // using this.currentSlide.
    if (++this.currentSlide >= this.slides.length) {
      this.currentSlide = 0;
    }
    this._preTranslate();
    this._slide();
  }

  previous() {
    if (--this.currentSlide < 0) {
      this.currentSlide = (this.slides.length - 1);
    }
    this._preTranslate(true);
    this._slide();
  }

  hide() {
    // We set a transition on opacity on the parent
    // 'this.dom' here.
    this.dom.style.opacity = 0;
  }

  attach(element) {
    element.appendChild(this.dom);
  } 

}

export default Slides;