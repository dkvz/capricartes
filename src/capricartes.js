
import cardStuff from './card-stuff';
import { addHtmlOption } from './view-utils';

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
    this.backgroundSelect = this.document.getElementById('backgroundSelect');
    this.imageSelect = this.document.getElementById('imageSelect');
    this.slidesCount = this.document.getElementById('slidesCount');

    this.state.slides = [];

    // Populate the combo boxes:
    cardStuff.backgrounds.forEach((bg, i) => {
      addHtmlOption(
        this.backgroundSelect,
        bg.name,
        this.document,
        i
      )
    });
    cardStuff.foregrounds.forEach((im, i) => {
      addHtmlOption(
        this.imageSelect,
        im.name,
        this.document,
        i
      )
    });
    
    this.document.getElementById('addSlideButton')
      .addEventListener('click', this.addSlideClick.bind(this));
    this.document.getElementById('delSlideButton')
      .addEventListener('click', this.delSlideClick.bind(this));
    this.slidesSelect.addEventListener('change', this.selectSlide.bind(this));
  }

  addSlideClick() {
    const text = this.slideInput.value;
    if (text.length > 0) {
      this.state.slides.push(text);
      addHtmlOption(
        this.slidesSelect,
        text.substring(0, 10) + '...',
        this.document
      );
      this.slidesSelect.selectedIndex = 0;
      this._updateSlidesCount();
      this.vibrateElement(this.slidesSelect);
      this.slideInput.value = '';
    }
  }

  _updateSlidesCount() {
    this.slidesCount.innerText = (this.state.slides.length) + ' Slide(s)...';
  }

  vibrateElement(el) {
    el.classList.remove('vibrateW');
    void el.offsetWidth;
    el.classList.add('vibrateW');
  }

  delSlideClick() {
    if (this.state.slides.length > 0) {
      const selected = this.slidesSelect.selectedIndex;
      if (selected > 0) {
        this.slidesSelect.remove(selected);
        this.state.slides.splice(selected - 1, 1);
        this.slidesSelect.selectedIndex = 0;
        this._updateSlidesCount();
        this.slideInput.value = '';
      }
    }
  }

  selectSlide() {
    if (this.state.slides.length > 0)
      this.slideInput.value = this.state.slides[
        this.slidesSelect.selectedIndex - 1
      ];
    else this.slideInput.value = '';
  }

  loadGreetingCard() {
    /*cardStuff.effects[0].enable(
      this.document.body, this.window, this.document
    );*/
    
    //cardStuff.foregrounds[0].enable(this.sections[0]);
  }

}

export default Capricartes;
