
import MovingImgEffect from './moving-img-effect';

const imgs = {
  capriboite1: require('../static/crapic_1.png'),
  capriboite1Pv: require('../static/crapic_1_preview.png'),
  capriboite2: require('../static/crapic_2.png'),
  capriboite2Pv: require('../static/crapic_2_preview.png'),
  capriboite3: require('../static/crapic_3.png'),
  capriboite3Pv: require('../static/crapic_3_preview.png'),
  pulleurDessous: require('../static/pulleur_wp.jpg'),
  pulleurDessousPv: require('../static/pulleur_wp_preview.jpg'),
  capritet: require('../static/capritet.png'),
  patgpib: require('../static/patgpibgray.jpg'),
  patgpibPv: require('../static/patgpibgray_preview.jpg'),
  patpull: require('../static/patpull.jpg'),
  patpullPv: require('../static/patpull_preview.jpg'),
  tetedepull: require('../static/tetedepull.png'),
  tetedepull_preview: require('../static/tetedepull_preview.png'),
  hyrax: require('../static/hyrax.jpg'),
  hyraxPv: require('../static/hyrax_preview.jpg'),
  lapinet: require('../static/lapinet.png'),
  lapinetPv: require('../static/lapinet_preview.png'),
  fractal1: require('../static/fractal1.jpg'),
  fractal1Pv: require('../static/fractal1_preview.jpg'),
  pulleurGrosPlan: require('../static/pulleur_gp.jpg'),
  pulleurGrosPlanPv: require('../static/pulleur_gp_preview.jpg'),
  lapinetSourdine: require('../static/lapin_sourdine.png'),
  lapinetSourdinePv: require('../static/lapin_sourdine_preview.png'),
  capribrut: require('../static/crapicbrut.png'),
  capribrutPv: require('../static/crapicbrut_preview.png'),
  capritetdroite: require('../static/geubitetedroite.png')
};

const cardStuffFactories = {

  BackgroundCSSClass: function(name, className, src, previewSrc) {
    const ret = {};
    if (src) {
      ret.preload = (callback, preview) => 
        new Promise((resolve) => {
          cardStuffFactories._createImage(
            preview ? previewSrc : src,
            _ => {
              callback && callback();
              resolve();
            });
        });
    }
    ret.name = name;
    ret.enable = (el, preview) => {
      el.classList.add((preview && previewSrc) ? 
        className + '-preview' : className);
    };
    return ret;
  },
  BackgroundImage: function(name, src, previewSrc, positionClass) {
    const ret = {};
    ret.preload = (callback, preview) => 
    new Promise((resolve) => {
      cardStuffFactories.createImage(
        preview ? previewSrc : src,
        _ => {
          callback && callback();
          resolve();
        });
    });
    ret.name = name;
    ret.enable = (el, preview) => {
      el.style.backgroundRepeat = 'repeat-x';
      if (!preview) el.style.backgroundAttachment = 'fixed';
      el.style.backgroundSize = 'cover';
      if (positionClass) {
        el.classList.add(positionClass);
      } else {
        el.style.backgroundPosition = 'center';
      }
      el.style.backgroundImage = 
        'url("' + (preview ? previewSrc : src) + '")';
    } 
    return ret;
  },
  BackgroundPattern: function(name, src, previewSrc) {
    const ret = {};
    ret.preload = (callback, preview) => 
    new Promise((resolve) => {
      cardStuffFactories.createImage(
        preview ? previewSrc : src,
        _ => {
          callback && callback();
          resolve();
        });
    });
    ret.name = name;
    ret.enable = (el, preview) => {
      el.style.backgroundRepeat = 'repeat';
      //el.style.backgroundAttachment = 'fixed';
      el.style.backgroundImage = 
        'url("' + (preview ? previewSrc : src) + '")';
      el.style.backgroundPosition = 'top left';
    }
    return ret;
  },
  CenterImage: function(name, src, previewSrc) {
    // Don't forget to add the right vibrate effect to the image.
    const ret = {};
    ret.name = name;
    ret.preload = (callback, preview) =>
      new Promise((resolve) => {
        ret.img = cardStuffFactories.createImage(
          preview ? previewSrc : src,
          _ => {
            callback && callback();
            resolve();
          }
        );
      });
    ret.enable = (el, preview) => {
      const setImage = (img) => {
        img.className = 'center-image';
        // Calculate and set the size:
        img.style.maxWidth = 
          ((img.width / img.height) * 100).toFixed(2) + 'vh';
        img.style.maxHeight = 
          ((img.height / img.width) * 100).toFixed(2) + 'vw';
        if (img.width > img.height) {
          img.classList.add('vibrateWL');
        } else {
          img.classList.add('vibrateHT');
        }
        el.appendChild(img);
      };
      if (ret.img) setImage(ret.img);
      else {
        ret.img = cardStuffFactories.createImage(
          preview ? previewSrc: src,
          _ => {
            setImage(ret.img);
          } 
        )
      }
    };
    return ret;
  },
  Music: function(name, src) {
    const ret = {};
    ret.name = name;
    const pload = (callback, preview) => {
      const audio = new Audio();
      callback && audio.addEventListener(
        preview ? 'canplay' : 'canplaythrough', 
        callback
      );
      audio.src = src;
      return audio;
    };
    ret.preload = (callback, preview) => {
      this.audio = pload(_ => {
        callback && callback();
      }, preview);
    };
    ret.enable = _ => {
      if (this.audio && this.audio.src === src) return this.audio;
      else return pload();
    };
    return ret;
  },
  TemplateContent: function(name, templateId) {
    const ret = {};
    ret.name = name;
    ret.enable = (el, window, document) => {
      el.appendChild(
        document.getElementById(templateId).content.cloneNode(true)
      );
    };
    return ret;
  },

  getImagePromise: function(src, callback) {
    return new Promise((resolve, reject) => {
      this.createImage(src, _ => {
        (callback && callback());
        resolve(img);
      });
    });
  },
  createImage: function(src, onload) {
    // TODO In theory I should use window as an argument here and
    // use window.Image to be consistent with everything else.
    // Oh well...
    const img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
  }

};

const cardStuff = {

  backgrounds: [
    cardStuffFactories.BackgroundCSSClass(
      'Standard',
      'main-bg'
    ),
    cardStuffFactories.BackgroundImage(
      'Le pulleur over LACK',
      imgs.pulleurDessous,
      imgs.pulleurDessousPv,
      'bg-img-1'
    ),
    cardStuffFactories.BackgroundCSSClass(
      'Great choice of colors',
      'bg-cool-colors'
    ),
    cardStuffFactories.BackgroundCSSClass(
      'Colorful',
      'bg-animated-gradient'
    ),
    cardStuffFactories.BackgroundPattern(
      'Is that a private joke?',
      imgs.patgpib,
      imgs.patgpibPv
    ),
    cardStuffFactories.BackgroundPattern(
      'Multipull', 
      imgs.patpull, 
      imgs.patpullPv
    ),
    cardStuffFactories.BackgroundImage(
      'Close-up on Pullzorz',
      imgs.pulleurGrosPlan,
      imgs.pulleurGrosPlanPv
    ),
    cardStuffFactories.BackgroundImage(
      'Hyrax',
      imgs.hyrax,
      imgs.hyraxPv
    ),
    cardStuffFactories.BackgroundImage(
      'Dimensions',
      imgs.fractal1,
      imgs.fractal1Pv
    )
  ],
  foregrounds: [
    cardStuffFactories.CenterImage(
      'Caprice boite 1',
      imgs.capriboite1,
      imgs.capriboite1Pv
    ),
    cardStuffFactories.CenterImage(
      'Caprice boite 2',
      imgs.capriboite2,
      imgs.capriboite2Pv
    ),
    cardStuffFactories.CenterImage(
      'Caprice boite 3',
      imgs.capriboite3,
      imgs.capriboite3Pv
    ),
    cardStuffFactories.CenterImage(
      'La tête du matin',
      imgs.tetedepull,
      imgs.tetedepull_preview
    ),
    cardStuffFactories.CenterImage(
      'Not a cat',
      imgs.lapinet,
      imgs.lapinetPv
    ),
    cardStuffFactories.CenterImage(
      'Not a cat 2',
      imgs.lapinetSourdine,
      imgs.lapinetSourdinePv
    ),
    cardStuffFactories.CenterImage(
      'Artistic impression',
      imgs.capribrut,
      imgs.capribrutPv
    )
  ],
  effects: [
    {
      name: 'Bouncing head',
      preload: function(callback, el, window, document) {
        return new Promise((resolve, reject) => {
          this.imgEffect = new MovingImgEffect(
            window,
            document,
            el,
            imgs.capritet,
            'capritete',
            false,
            _ => {
              (callback && callback());
              resolve();
            }
          );
        }); 
      },
      enable: function(el, window, document) {
        if (!this.imgEffect) this.imgEffect = new MovingImgEffect(
          window,
          document,
          el,
          imgs.capritet,
          'capritete',
          true
        );
        else this.imgEffect.initialize();
      }
    },
    cardStuffFactories.TemplateContent(
      'Glowing sun',
      'svgSun'
    ),
    {
      name: 'Crazy rainbow',
      enable: function(el, window, document) {
        const rb = 
          document.getElementById('svgRainbow').content.cloneNode(true);
        rb.querySelectorAll('circle[data-ray]').forEach((c, i) => {
          c.style.animationDelay = (i * 0.75) + 's';
          c.classList.add('rainbow-ray', 'origin-bottom-center');
        });
        el.appendChild(rb);
      }
    },
    {
      name: 'Rainbow',
      enable: function(el, window, document) {
        const rb = 
          document.getElementById('svgRainbow').content.cloneNode(true);
        const svg = rb.querySelector('svg');
        svg.classList.add('rainbow-ray');
        svg.style.animationDuration = '2.5s';
        el.appendChild(rb);
      }
    },
    {
      name: 'Coucou Caprice',
      preload: function (callback) {
        return new Promise((resolve) => {
          this.img = cardStuffFactories.createImage(
            imgs.capritetdroite, 
            _ => {
              resolve();
              callback && callback();
            }
          );
        });
      },
      enable(el, window, document) {
        const setImage = (img) => {
          if (el.offsetWidth < 1000) {
            img.height = img.height / 1.6;
            img.width = img.width / 1.6;
          }
          img.className = 'pop-head';
          el.appendChild(img);
        };
        if (!this.img) this.img = cardStuffFactories.createImage(
          imgs.capritetdroite, 
          _ => {
            setImage(this.img);
          });
        else setImage(this.img);
      }
    }
  ],
  tunes: [
    cardStuffFactories.Music(
      'My Heart Will Go On TECHNO',
      'static/music/my_heart_will_go_on.mp3'
    ),
    cardStuffFactories.Music(
      'Green T & The Sushi Platters',
      'static/music/day_tentacle_green_t_and_the_sushi_platters.mp3'
    ),
    cardStuffFactories.Music(
      'El Condor Pasa',
      'static/music/el_condor_pasa.mp3'
    ),
    cardStuffFactories.Music(
      'Ave Maria',
      'static/music/ave_maria.mp3'
    ),
    cardStuffFactories.Music(
      'Santa is coming',
      'static/music/santa_jazz.mp3'
    )
  ]

};

export default cardStuff;