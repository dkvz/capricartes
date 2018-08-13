
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
    this.backgroundPreview = document.getElementById('backgroundPreview');
    this.imagePreview = document.getElementById('imagePreview');
    this.slideInput = document.getElementById('slideInput');
    this.effectCheckboxes = document.querySelectorAll('[data-effect]');


    this.state.slides = [];
    
  }

  loadGreetingCard() {
    // We need to parse all the options:

  }

}

module.exports = Capricartes;
