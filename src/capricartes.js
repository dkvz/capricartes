import cardStuff from './card-stuff';
import { addHtmlOption, addOptionFromTemplate, removeNodesFromElement } from './view-utils';
import playButton from '../static/play_filled.svg';
import stopButton from '../static/stop_filled.svg';
import Slides from './slides';
import DkvzTranslator from './dkvz-translator';

class Capricartes {
  constructor(window, document) {
    this.window = window;
    this.document = document;
    this.sections = document.querySelectorAll('section');
    // Yeah you can have a state without using React (????)
    // I'm not sure why I did this.
    this.state = {};
  }

  showSection(name) {
    this.sections.forEach(s => {
      s.style.display = s.id === name ? '' : 'none';
    });
  }

  translateAll() {
    this.translator.translateTree(this.document.body);
    // Translate the options and the checkboxes too.
    // The first option is the "select something" one.
    // We should not do this unless the select have been
    // initialized (also no point doing it if the form is
    // not around).
    if (this.backgroundSelect && this.imageSelect && this.effectsDiv) {
      [this.backgroundSelect, this.imageSelect].forEach(sel => {
        for (let i = 1; i < sel.options.length; i++) {
          // We can use "value" as the index here.
          // The corresponding cardStuff structure is in 
          // the data-card-stuff attribute.
          const item = cardStuff[
            sel.getAttribute('data-card-stuff')
          ][sel.options[i].value];
          sel.options[i].textContent = item.translate ?
            this.translator.t(item.name) :
            item.name
        }
      });
      // Now process the effects:
      this.effectsDiv.querySelectorAll('input').forEach(n => {
        if (cardStuff.effects[n.getAttribute('data-effect')].translate) {
          n.parentNode.querySelector('.chkbox-text').textContent = 
            this.translator.t(
              cardStuff.effects[n.getAttribute('data-effect')].name
            );
        }
      });
      // Also translate the "preview" text on the form but only
      // if something is not currently previewing.
      [this.backgroundPreview, this.imagePreview].forEach(n => {
        if (n.textContent !== '') n.textContent = this.translator.t('preview')
      });
    }
  }

  init() {
    this.slidesTemplate = this.document.getElementById('slidesTpl');
    // Load the translator, Webpack is injecting the JSON
    // data in there directly.
    this.translator = new DkvzTranslator(
      require('./locales.json')
    );
    this.translator.guessLanguageFromBrowser(this.window);
    this.translateAll();

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

    // For the moment we only use pushstate to make the back button work on
    // the card preview screen.

    // Register the event listeners for the form.
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
    this.showLinkModal = this.document.getElementById('showLinkModal');
    this.helpModal = this.document.getElementById('helpModal');
    this.previewBar = this.document.getElementById('previewBar');
    this.cardLink = this.document.getElementById('cardLink');
    this.langSelect = this.document.getElementById('langSelect');

    [this.backgroundPreview, this.imagePreview].forEach(n => 
      n.textContent = this.translator.t('preview')
    );
   
    this.loadingModal.querySelector('.close').addEventListener(
      'click', this.cancelPreview.bind(this)
    );
    this.loadingModal.querySelector('button').addEventListener(
      'click', this.cancelPreview.bind(this)
    );
    this.showLinkModal.querySelector('.close').addEventListener(
      'click', this.hideLinkDialog.bind(this)
    );
    this.showLinkModal.querySelector('button:first-child').addEventListener(
      'click', this.hideLinkDialog.bind(this)
    );
    this.showLinkModal.querySelector('button:last-child').addEventListener(
      'click', this.copyUrlToClipboard.bind(this)
    );
    this.helpModal.querySelector('.close').addEventListener(
      'click', this.hideHelpDialog.bind(this)
    );
    this.helpModal.querySelector('button').addEventListener(
      'click', this.hideHelpDialog.bind(this)
    );

    this.state.slides = [];
    this.state.selectedMusic = 0;
    this.state.musicPlaying = false;
    this.state.cancelledPreview = false;
    this.state.originalHref = this.window.location.href;

    // Populate the combo boxes:
    cardStuff.backgrounds.forEach((bg, i) => {
      addHtmlOption(
        this.backgroundSelect, 
        bg.translate ? this.translator.t(bg.name) : bg.name, 
        this.document, 
        i);
    });
    cardStuff.foregrounds.forEach((im, i) => {
      addHtmlOption(
        this.imageSelect, 
        im.translate ? this.translator.t(im.name) : im.name, 
        this.document, 
        i);
    });
    // For the moment we're not translating music names.
    cardStuff.tunes.forEach((m, i) => {
      addHtmlOption(this.musicSelect, m.name, this.document, i);
    });

    // Languages:
    this.translator.getLanguages().forEach((l, i) => {
      addHtmlOption(this.langSelect, l.toUpperCase() ,this.document, l);
      if (l === this.translator.getLanguage()) 
        this.langSelect.selectedIndex = i;
    });

    // Now add the effects as checkboxes:
    const checkboxTemplate = this.document.getElementById('chkboxTpl');
    cardStuff.effects.forEach((e, i) => {
      addOptionFromTemplate(
        this.effectsDiv,
        checkboxTemplate,
        e.translate ? this.translator.t(e.name) : e.name,
        'chkbox-text',
        i,
        'data-effect'
      );
    });


    this.backgroundSelect
      .addEventListener('change', this._previewBackground.bind(this));
    this.imageSelect
      .addEventListener('change', this._previewImage.bind(this));
    this.langSelect
      .addEventListener('change', _ => {
        this.translator.changeLanguage(this.langSelect.value);
        this.translateAll();
      });
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
    this.document
      .getElementById('generateButton')
      .addEventListener('click', this.showLinkDialog.bind(this));
    this.document
      .getElementById('helpButton')
      .addEventListener('click', this.showHelpDialog.bind(this));

    this.window
      .addEventListener('popstate', this.previewPopstateCallback.bind(this));
  }

  previewPopstateCallback(s) {
    if (s.state.preview === false) {
      // Disable the preview:
      this.closeCardPreview();
    }
  }

  showLinkDialog() {
    // We need to generate the link.
    this.state.cardUrl = this.getUrlFromForm();
    this.cardLink.textContent = this.state.cardUrl;
    this.cardLink.href = this.state.cardUrl;
    this.showLinkModal.style.display = 'block';
  }

  showHelpDialog() {
    this.helpModal.style.display = 'block';
  }

  hideHelpDialog() {
    this.helpModal.style.display = '';
  }

  getUrlFromForm() {
    this.cardFromForm();
    // Generate the URL from the state:
    const params = [];
    // This checks that title is not empty as well:
    if (this.state.title)
      params.push(
        't=' + this.window.encodeURIComponent(
          this.window.btoa(this.state.title)
        )
      );
    if (this.state.slides && this.state.slides.length > 0) {
      params.push(
        's=' + this.state.slides.map(
          i => this.window.encodeURIComponent(this.window.btoa(i))
        ).join(',')
      );
    }
    if (this.state.background !== undefined) {
      params.push('b=' + this.state.background);
    }
    if (this.state.foreground !== undefined) {
      params.push('f=' + this.state.foreground);
    }
    if (this.state.effects && this.state.effects.length > 0) {
      params.push(
        'e=' + this.state.effects.join(',')
      );
    }
    if (this.state.music !== undefined) {
      params.push('m=' + this.state.music);
    }
    return this.state.originalHref +
      'crapic?' +
      params.join('&');
  }

  showCardPreview() {
    this.state.cancelledPreview = false;
    this.cardFromForm();
    if (this.audio && !this.audio.paused) {
      this.stopMusicPreview();
    }
    this.showLoadingModal();
    this.loadGreetingCard(this.sections[2], _ => {
      this.hideLoadingDialog();
      // Change the URL so that the "back" button works:
      this.window.history.pushState(
        {preview: true}, 
        'Capricartes - Preview',
        this.state.originalHref + '?preview'
      );
      // Add the controls to go back to the form:
      this.showPreviewBar();
    });
  }

  copyUrlToClipboard() {
    const input = this.document.createElement('input');
    input.value = this.state.cardUrl;
    input.style.position = 'absolute';
    input.style.left = 0;
    input.style.top = 0;
    input.style.zIndex = -999;
    this.document.body.appendChild(input);
    input.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(input);
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
    // Apply the disable functions that may
    // be in the state:
    this.state.disableObjects.forEach(o => o.disable());
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

  hideLinkDialog() {
    this.showLinkModal.style.display = 'none';
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
      this._resetPreview(
        this.backgroundPreview, 
        this.translator.t('preview')
      );
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
      this._resetPreview(
        this.imagePreview, 
        this.translator.t('preview')
      );
    }
  }

  // You should check that this.audio exists before using
  // this method.
  stopMusicPreview() {
    this.state.musicPlaying = false;
    this.audio.currentTime = 0;
    this.audio.pause();
  }

  previewMusicClick() {
    // Check if music is currently playing:
    if (this.audio && !this.audio.paused) {
      this.stopMusicPreview();
      // We're using the 'canplay' event to remove the spinning
      // effect of the play button.
      //this.musicPreviewImg.classList.remove('spinning');
    } else {
      // Let's not recycle the audio tag,
      // we're re-creating it.
      // Because it's easier.
      // I hope the garbage collector collects the garbage.
      // Check the selected index, set it as selectedMusic
      // in the state.
      if (this.musicSelect.selectedIndex != 0) {
        this.state.musicPlaying = true;
        this.musicPreviewImg.src = playButton;
        this.musicPreviewImg.classList.add('spinning');
        // This state thing is completely useless, why is it
        // there?
        this.state.selectedMusic = this.musicSelect.selectedIndex;
        
        this.audio = cardStuff.tunes[this.state.selectedMusic - 1].enable();
        this.audio.addEventListener('canplay', _ => {
          // canplay actually also gets called every single time
          // you pause the audio (or call .pause() ofc).
          this.musicPreviewImg.classList.remove('spinning');
          this.musicPreviewImg.src = this.audio.paused ? 
            playButton : stopButton;
        });
        this.audio.play();
        
        // The following code was retired because Chrome made it so
        // that to play audio, the play() method has to be directly 
        // inside a UI event listener or it will get blocked by Chrome.
        /* **************************** */
        /*cardStuff.tunes[this.state.selectedMusic - 1].preload(_ => {
          // This event can be called when pausing...
          // Which is a problem.
          if (this.state.musicPlaying) {
            this.audio = cardStuff.tunes[this.state.selectedMusic - 1].enable();
            this.musicPreviewImg.classList.remove('spinning');
            this.musicPreviewImg.src = stopButton;
            this.audio.play();
          }
        }, true);*/

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
    this.slidesCount.innerText = 
      this.state.slides.length + ' ' + this.translator.t('slidesCountInit');
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
            this.state.title = this.window.atob(this.window.decodeURIComponent(p[1]));
            break;
          case 's':
            // My original plan was to have each slide on its own s= query parameter.
            // It changed along the way into a comma separated list.
            //this.state.slides.push(this.window.atob(this.window.decodeURIComponent(p[1])));
            this.state.slides = p[1].split(',').map(
              s => this.window.atob(this.window.decodeURIComponent(s))
            );
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
    // Prepare a list with "disable" functions used to remove
    // some effects:
    this.state.disableObjects = [];
    const addDisFn = (obj) => {
      if (obj.disable) this.state.disableObjects.push(obj);
    };

    if (this.state.background === undefined) this.state.background = 0;
    cardStuff.backgrounds[this.state.background].enable(el);
    addDisFn(cardStuff.backgrounds[this.state.background]);
    
    // We have a background.
    // Let's show the card from there.
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

    if (this.state.foreground !== undefined) {
      cardStuff.foregrounds[this.state.foreground].enable(el);
      addDisFn(cardStuff.foregrounds[this.state.foreground]);
    }
    
    if (this.state.effects) 
      this.state.effects.forEach(e => {
        cardStuff.effects[e].enable(el, this.window, this.document);
        addDisFn(cardStuff.effects[e]);
      });
    if (this.state.music !== undefined) {
      // Music used to auto-play, but Chrome (and possibly others, 
      // possibly all of them at some point) is blocking any calls
      // to play() unless it's done from a UI event listener that
      // the user has interacted with. So everything had to be
      // refactored to pop up a weird play button on the card.

      const audio = cardStuff.tunes[this.state.music].enable();
      const pb = 
          document.getElementById('playControls')
          .content.cloneNode(true);
      const fp = pb.querySelector('.floatingPlay');
      // There's like, one word to translate in that template:
      this.translator.translateTree(fp);
      
      const closePb = _ => fp.style.opacity = 0;
      const playB = fp.querySelector('.playBtn');
      fp.querySelector('.close-link').addEventListener('click', closePb);
      playB.addEventListener('click', closePb);
      playB.addEventListener('click', _ => {
        audio.play();
      });

      // For now music has a single factory method with no disable()
      // required, but we might as well make it consistent:
      addDisFn(cardStuff.tunes[this.state.music]);
      el.appendChild(audio);
      el.appendChild(pb);
      //audio.play();
    }
  }

}

export default Capricartes;
