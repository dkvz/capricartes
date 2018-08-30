
import cardStuff from './card-stuff';
import { addHtmlOption, addOptionFromTemplate } from './view-utils';
import playButton from '../static/play_filled.svg';
import stopButton from '../static/stop_filled.svg';

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
    this.musicSelect = this.document.getElementById('musicSelect');
    this.slidesCount = this.document.getElementById('slidesCount');
    this.effectsDiv = this.document.getElementById('effectsDiv');
    this.musicPreviewImg = this.document.getElementById('musicPreviewImg');

    this.state.slides = [];
    this.state.selectedMusic = 0;
    this.state.musicPlaying = false;

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
    cardStuff.tunes.forEach((m, i) => {
      addHtmlOption(
        this.musicSelect,
        m.name,
        this.document,
        i
      )
    });

    // Now add the effects as checkboxes:
    const checkboxTemplate = this.document.getElementById('chkboxTpl');
    cardStuff.effects.forEach((e, i) => {
      addOptionFromTemplate(
        this.effectsDiv,
        checkboxTemplate,
        e.name,
        'chkbox-text',
        i,
        'data-effect'
      );
    });
    
    this.document.getElementById('addSlideButton')
      .addEventListener('click', this.addSlideClick.bind(this));
    this.document.getElementById('delSlideButton')
      .addEventListener('click', this.delSlideClick.bind(this));
    this.slidesSelect.addEventListener('change', this.selectSlide.bind(this));
    this.document.getElementById('musicPreviewButton')
      .addEventListener('click', this.previewMusicClick.bind(this));
  }

  previewMusicClick() {
    // Check if music is currently playing:
    if (this.audio && !this.audio.paused) {
      this.audio.currentTime = 0;
      this.audio.pause();
      // Put the image back to "play":
      this.musicPreviewImg.src = playButton;
      this.musicPreviewImg.classList.remove('spinning');
      this.state.musicPlaying = false;
    } else {
      // Let's not recycle the audio tag, 
      // we're re-creating it.
      // Because it's easier.
      // I hope the garbage collector collects the garbage.
      // Check the selected index, set it as selectedMusic 
      // in the state.
      if (this.musicSelect.selectedIndex != 0) {
        this.musicPreviewImg.src = playButton;
        this.musicPreviewImg.classList.add('spinning');
        //this.musicPreviewImg.src = stopButton;
        // This state thing is completely useless, why is it
        // there?
        this.state.musicPlaying = true;
        this.state.selectedMusic = this.musicSelect.selectedIndex;
        cardStuff.tunes[this.state.selectedMusic - 1].preload(
          _ => {
            // This event can be called when pausing...
            // Which is a problem.
            if (this.state.musicPlaying) {
              this.audio = cardStuff.tunes[this.state.selectedMusic - 1].enable();
              this.musicPreviewImg.classList.remove('spinning');
              this.musicPreviewImg.src = stopButton;
              this.audio.play();
            }
          },
          true
        );
      }
    }
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
