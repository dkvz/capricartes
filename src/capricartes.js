
class Capricartes {

  constructor(window, document) {
    this.window = window;
    this.document = document;
    this.sections = document.querySelectorAll('section');
    this.state = {};
  }

  showSection(name) {
    this.sections.forEach((s) => {
      s.style.display = (s.id === name) ? '' : 'none';
    });
  }

  init() {
    if (this.window.location.pathname == '/crapic') {
      // The actual greeting card.
      // Requires a loading screen.
      this.showSection('loading');
      this.loadGreetingCard();
    } else {
      // Show the form.
      this.showSection('form');
      this.initFormControls();
    }
  }

  initFormControls() {
    // Register the event listener for the form.
    this.backgroundPreview = this.document.getElementById('backgroundPreview');
    this.imagePreview = this.document.getElementById('imagePreview');
    this.slideInput = this.document.getElementById('slideInput');
    this.effectCheckboxes = this.document.querySelectorAll('[data-effect]');
    this.slidesSelect = this.document.getElementById('slidesSelect');

    this.state.slides = [];
    
    this.document.getElementById('addSlideButton')
      .addEventListener('click', this.addSlideClick.bind(this));
    this.document.getElementById('delSlideButton')
      .addEventListener('click', this.delSlideClick.bind(this));
    this.slidesSelect.addEventListener('change', this.selectSlide.bind(this));
  }

  addSlideClick() {
    const text = this.slideInput.value;
    this.state.slides.push(text);
    const opt = this.document.createElement('option');
    opt.innerText = text.substring(0, 10) + '...';
    this.slidesSelect.appendChild(opt);
    this.slidesSelect.selectedIndex = this.slidesSelect.options.length - 1;
    this.vibrateElement(this.slidesSelect);
    this.slideInput.value = '';
  }

  vibrateElement(el) {
    el.classList.remove('vibrateW');
    void el.offsetWidth;
    el.classList.add('vibrateW');
  }

  delSlideClick() {
    if (this.state.slides.length > 0) {
      const selected = this.slidesSelect.selectedIndex;
      if (selected >= 0) {
        this.slidesSelect.remove(selected);
        this.state.slides.splice(selected, 1);
        console.log('Current slides: ', this.state.slides);
        this.slidesSelect.selectedIndex = -1;
        this.slideInput.value = '';
      }
    }
  }

  selectSlide() {
    if (this.state.slides.length > 0)
      this.slideInput.value = this.state.slides[
        this.slidesSelect.selectedIndex
      ];
  }

  loadGreetingCard() {
    // We need to parse all the options:

  }

}

module.exports = Capricartes;
