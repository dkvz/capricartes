import cardStuff from './card-stuff';
import { addHtmlOption, addOptionFromTemplate, removeNodesFromElement } from './view-utils';
import playButton from '../static/play_filled.svg';
import stopButton from '../static/stop_filled.svg';
import Slides from './slides';

class Capricartes {
  constructor(window, document) {
    this.window = window;
    this.document = document;
    this.sections = document.querySelectorAll('section');
    this.state = {};
  }

  showSection(name) {
    this.sections.forEach(s => {
      s.style.display = s.id === name ? '' : 'none';
    });
  }

  init() {
    this.slidesTemplate = this.document.getElementById('slidesTpl');
    if (this.window.location.pathname == '/crapic') {
      // The actual greeting card.
      // Requires a loading screen.
      if (this.window.location.search) {
        this.cardFromUrl();
        this.showSection('loading');
        this.loadGreetingCard(this.sections[2]);
        return;
      }
    } else if (this.window.location.pathname == '/secret') {
      this.showSection('card');
      const slidesComp = new Slides(
        ['Les pomme de terre sont gentilles '.repeat(8),
        'Machin bidule '.repeat(3)],
        this.slidesTemplate,
        this.document
      );
      slidesComp.attach(this.sections[2]);
      return;
    }
    // Show the form.
    this.showForm();
  }

  showForm() {
    this.showSection('form');
    this.initFormControls();
  }

  initFormControls() {
    // TODO I initially thought this method would be called only once
    // but since I'm considering implementing pushstate that might no 
    // longer be the case.
    // We should check whether we really need to register the form elements.

    // Register the event listener for the form.
    this.titleInput = this.document.getElementById('titleInput');
    this.backgroundPreview = this.document.getElementById('backgroundPreview');
    this.imagePreview = this.document.getElementById('imagePreview');
    this.slideInput = this.document.getElementById('slideInput');
    this.slidesSelect = this.document.getElementById('slidesSelect');
    this.backgroundSelect = this.document.getElementById('backgroundSelect');
    this.imageSelect = this.document.getElementById('imageSelect');
    this.musicSelect = this.document.getElementById('musicSelect');
    this.slidesCount = this.document.getElementById('slidesCount');
    this.effectsDiv = this.document.getElementById('effectsDiv');
    this.musicPreviewImg = this.document.getElementById('musicPreviewImg');
    this.loadingModal = this.document.getElementById('loadingModal');
    this.previewBar = this.document.getElementById('previewBar');
    this.loadingModal.querySelector('.close').addEventListener(
      'click', this.cancelPreview.bind(this)
    );
    this.loadingModal.querySelector('button').addEventListener(
      'click', this.cancelPreview.bind(this)
    );

    this.state.slides = [];
    this.state.selectedMusic = 0;
    this.state.musicPlaying = false;
    this.state.cancelledPreview = false;
    this.state.originalHref = this.window.location.href;

    // Populate the combo boxes:
    cardStuff.backgrounds.forEach((bg, i) => {
      addHtmlOption(this.backgroundSelect, bg.name, this.document, i);
    });
    cardStuff.foregrounds.forEach((im, i) => {
      addHtmlOption(this.imageSelect, im.name, this.document, i);
    });
    cardStuff.tunes.forEach((m, i) => {
      addHtmlOption(this.musicSelect, m.name, this.document, i);
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

    this.backgroundSelect
      .addEventListener('change', this._previewBackground.bind(this));
    this.imageSelect
      .addEventListener('change', this._previewImage.bind(this));

    this.document
      .getElementById('addSlideButton')
      .addEventListener('click', this.addSlideClick.bind(this));
    this.document
      .getElementById('delSlideButton')
      .addEventListener('click', this.delSlideClick.bind(this));
    this.slidesSelect
      .addEventListener('change', this.selectSlide.bind(this));
    this.document
      .getElementById('musicPreviewButton')
      .addEventListener('click', this.previewMusicClick.bind(this));
    this.document
      .getElementById('previewButton')
      .addEventListener('click', this.showCardPreview.bind(this));
    this.document
      .getElementById('closePreview')
      .addEventListener('click', this.closeCardPreview.bind(this));

    this.window
      .addEventListener('popstate', this.previewPopstateCallback.bind(this));
  }

  previewPopstateCallback(s) {
    if (s.state.preview === false) {
      // Disable the preview:
      this.closeCardPreview();
    }
  }

  showCardPreview() {
    this.state.cancelledPreview = false;
    this.cardFromForm();
    this.showLoadingModal();
    this.loadGreetingCard(this.sections[2], _ => {
      this.hideLoadingDialog();
      // Change the URL so that the "back" button works:
      this.window.history.pushState(
        {preview: true}, 
        'Capricartes - Preview',
        this.window.location.href + '?preview'
      );
      // Add the controls to go back to the form:
      this.showPreviewBar();
    });
  }

  showPreviewBar() {
    this.previewBar.style.display = 'flex';
  }

  hidePreviewBar() {
    this.previewBar.style.display = 'none';
  }

  closeCardPreview() {
    this.window.history.pushState(
      {preview: false},
      'Capricartes',
      this.state.originalHref
    );
    this.hidePreviewBar();
    this.showSection('form');
    this._resetCard(this.sections[2]);
  }

  cancelPreview() {
    // We can't really cancel the Promise.all at the moment.
    // I'm just cancelling the actual switching to the preview view...
    this.hideLoadingDialog();
    this.state.cancelledPreview = true;
  }

  hideLoadingDialog() {
    this.loadingModal.style.display = 'none';
  }

  showLoadingModal() {
    if (this.loadingModal) 
      this.loadingModal.style.display = 'block';
  }

  _previewBackground() {
    if (this.backgroundSelect.selectedIndex !== 0) {
      this.backgroundPreview.textContent = 'Loading...';
      const index = this.backgroundSelect.selectedIndex - 1;
      // This thing has both a callback and returns a promise
      // because I wanted to use Promise.all but get a callback
      // for individual promises. I know that's not an excuse. Uh...
      if (cardStuff.backgrounds[index].preload) {
        cardStuff.backgrounds[index]
          .preload(undefined, true)
          .then(this._activatePreview(
            this.backgroundPreview,
            cardStuff.backgrounds[index].enable
          ));
      } else {
        this._activatePreview(
          this.backgroundPreview,
          cardStuff.backgrounds[index].enable
        )
      }
    } else {
      this._resetPreview(this.backgroundPreview, 'Preview');
    }
  }

  _activatePreview(el, enableFunction) {
    // Reset the preview:
    this._resetPreview(el, '');
    enableFunction(el, true);
  }

  _resetPreview(el, text) {
    // Reset the preview:
    this._resetCard(el, 'preview');
    el.textContent = text;
  }

  _resetCard(el, className) {
    removeNodesFromElement(el);
    el.style.cssText = '';
    el.className = className ? className : '';
  }

  _previewImage() {
    if (this.imageSelect.selectedIndex !== 0) {
      this.imagePreview.textContent = 'Loading...';
      const index = this.imageSelect.selectedIndex - 1;
      if (cardStuff.foregrounds[index].preload) {
        cardStuff.foregrounds[index]
          .preload(undefined, true)
          .then(this._activatePreview(
            this.imagePreview,
            cardStuff.foregrounds[index].enable
          ));
      } else {
        this._activatePreview(
          this.imagePreview,
          cardStuff.foregrounds[index].enable
        )
      }
    } else {
      this._resetPreview(this.imagePreview, 'Preview');
    }
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
        cardStuff.tunes[this.state.selectedMusic - 1].preload(_ => {
          // This event can be called when pausing...
          // Which is a problem.
          if (this.state.musicPlaying) {
            this.audio = cardStuff.tunes[this.state.selectedMusic - 1].enable();
            this.musicPreviewImg.classList.remove('spinning');
            this.musicPreviewImg.src = stopButton;
            this.audio.play();
          }
        }, true);
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
    this.slidesCount.innerText = this.state.slides.length + ' Slide(s)...';
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
    if (this.state.slides.length > 0 && this.slidesSelect.selectedIndex !== 0)
      this.slideInput.value = this.state.slides[
        this.slidesSelect.selectedIndex - 1
      ];
    else this.slideInput.value = '';
  }

  _resetState() {
    delete this.state.title;
    delete this.state.music;
    delete this.state.foreground;
    delete this.state.background;
    this.state.effects = [];
    // We don't reset slides on purpose as they are used
    // in the form.
  }

  cardFromUrl() {
    // We can use atob to decode h264 text from the URL.
    // Params to look for in URL:
    /**
     * t: Title
     * s: Slides, can appear multiple times
     * b: Background
     * f: Foreground
     * e: Effects (comma separated)
     */
    // Reset everything in case we're re-using this function:
    this._resetState();
    this.state.slides = [];
    const params = this.window.location.search.substring(1).split('&');
    // Cycle through params, split again, check if second element
    // exists, check if it's not empty.
    params.forEach((param) => {
      const p = param.split('=');
      if (p && p.length === 2) {
        switch (p[0]) {
          case 't':
            this.state.title = atob(p[1]);
            break;
          case 's':
            this.state.slides.push(atob(p[1]));
            break;
          case 'b':
            let bid = Number(p[1]);
            if (isNaN(bid) || !cardStuff.backgrounds[bid]) bid = 0;
            this.state.background = bid;
            break;
          case 'f':
            let fid = Number(p[1]);
            if (!isNaN(fid) && cardStuff.foregrounds[fid]) 
              this.state.foreground = fid;
            break;
          case 'e':
            // We can have a coma separated list of effects.
            // We should also check that they exist.
            const effects = p[1].split(',');
            effects.forEach(e => {
              const n = Number(e);
              if (!isNaN(n) && cardStuff.effects[n]) {
                this.state.effects.push(n);
              }
            });
            break;
          case 'm':
            let mid = Number(p[1]);
            if (!isNaN(mid) || cardStuff.tunes[mid])
              this.state.music = mid;
        }
      }
    });
  }

  cardFromForm() {
    this._resetState();
    // this.state.slides is supposed to be already set.
    this.state.title = this.titleInput.value;
    if (this.backgroundSelect.selectedIndex > 0) 
      this.state.background = this.backgroundSelect.selectedIndex - 1;
    if (this.imageSelect.selectedIndex > 0) 
      this.state.foreground = this.imageSelect.selectedIndex - 1;
    if (this.musicSelect.selectedIndex > 0) {
      this.state.music = this.musicSelect.selectedIndex - 1;
    }
    // Browse the effect checkboxes:
    const chkboxes = this.document.querySelectorAll('[data-effect]');
    this.state.effects = [];
    if (chkboxes) {
      chkboxes.forEach(c => {
        if (c.checked) this.state.effects.push(c.getAttribute('data-effect'));
      });
    }
  }

  loadGreetingCard(el, callback) {
    // It's important to not be able to add
    // actual HTML to the page.
    let promises = [];
    // Background is always present, we use the "0" if nothing
    // was provided.
    if (this.state.background === undefined) this.state.background = 0;
    if (cardStuff.backgrounds[this.state.background].preload)
      promises.push(cardStuff.backgrounds[this.state.background].preload());
    if (this.state.foreground !== undefined) 
      if (cardStuff.foregrounds[this.state.foreground].preload)
        promises.push(cardStuff.foregrounds[this.state.foreground].preload());
    if (this.state.effects) {
      this.state.effects.forEach(e => {
        if (cardStuff.effects[e].preload)
          promises.push(cardStuff.effects[e].preload(
            undefined, 
            el, 
            this.window,
            this.document
          )
        );
      });
    }
    if (this.state.music !== undefined) 
      promises.push(cardStuff.tunes[this.state.music]);
    
    Promise.all(promises).then(_ => {
      if (!this.state.cancelledPreview) {
        this.showGreetingCard(el);
        callback && callback();
      }
    });
  }

  showGreetingCard(el) {
    cardStuff.backgrounds[
      this.state.background !== undefined ? this.state.background : 0
    ].enable(el);
    this.showSection('card');
    if (this.state.title) {
      const cardTitle = this.document.createElement('h1');
      cardTitle.className = 'main-title';
      cardTitle.textContent = this.state.title;
      el.appendChild(cardTitle);
    }

    // Add the slides:
    if (this.state.slides && this.state.slides.length > 0) {
      const slidesComp = new Slides(
        this.state.slides, 
        this.slidesTemplate, 
        this.document
      );
      slidesComp.attach(el);
    }

    if (this.state.foreground !== undefined) 
      cardStuff.foregrounds[this.state.foreground].enable(el);
    if (this.state.effects) 
      this.state.effects.forEach(e => {
        cardStuff.effects[e].enable(el, this.window, this.document);
      });
    if (this.state.music !== undefined) {
      const audio = cardStuff.tunes[this.state.music].enable();
      el.appendChild(audio);
      audio.play();
    }
  }

}

export default Capricartes;
