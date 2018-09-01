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

    const slidesEl = this.dom.querySelector('.slide');
    this.slides.forEach(s => {
      const nel = this.document.createElement('div');
      nel.textContent = s;
      slidesEl.appendChild(nel);
    });
    
    if (this.slides.length <= 1) {
      // Hide the controls:
      this.dom.querySelector('.bottom-controls')
        .style.display = 'none';
    }
  }

  next() {

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