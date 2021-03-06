
import MovingImgEffect from './moving-img-effect';
import RandomGifsEffect from './random-gifs-effect';
import SkewedImgEffect from './skewed-img-effect';

const imgs = {
  capriboite1: require('../static/crapic_1.png'),
  capriboite1Pv: require('../static/crapic_1_preview.png'),
  capriboite2: require('../static/crapic_2.png'),
  capriboite2Pv: require('../static/crapic_2_preview.png'),
  capriboite3: require('../static/crapic_3.png'),
  capriboite3Pv: require('../static/crapic_3_preview.png'),
  pullboite1: require('../static/pullboite_1.png'),
  pullboite1Pv: require('../static/pullboite_1_preview.png'),
  pulleurDessous: require('../static/pulleur_wp.jpg'),
  pulleurDessousPv: require('../static/pulleur_wp_preview.jpg'),
  pulleurLack1: require('../static/pulleur_lack_1.jpg'),
  pulleurLack1Pv: require('../static/pulleur_lack_1_preview.jpg'),
  pulleurLack2: require('../static/pulleur_lack_2.jpg'),
  pulleurLack2Pv: require('../static/pulleur_lack_2_preview.jpg'),
  pulleurLackReverse: require('../static/pulleur_lack_reverse.jpg'),
  pulleurLackReversePv: require('../static/pulleur_lack_reverse_preview.jpg'),
  yawningPull: require('../static/yawning_pull.jpg'),
  yawningPullPv: require('../static/yawning_pull_preview.jpg'),
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
  capritetdroite: require('../static/geubitetedroite.png'),
  pulleurSvg: require('../static/pulleur.svg')
};

imgs.gifs = [];
for (let i = 1; i <= 11; i++) {
  imgs.gifs.push(require('../static/' + i + '.gif'));
}

const cardStuffFactories = {

  BackgroundCSSClass: function(name, className, src, previewSrc, translate = false) {
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
    ret.translate = translate;
    ret.name = name;
    ret.enable = (el, preview) => {
      el.classList.add((preview && previewSrc) ? 
        className + '-preview' : className);
    };
    return ret;
  },
  BackgroundImage: function(name, src, previewSrc, positionClass, translate = false) {
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
    ret.translate = translate;
    ret.name = name;
    ret.enable = (el, preview) => {
      el.style.backgroundRepeat = 'repeat-x';
      if (!preview) el.style.backgroundAttachment = 'fixed';
      el.style.backgroundSize = 'cover';
      if (positionClass && !preview) {
        el.classList.add(positionClass);
      } else {
        el.style.backgroundPosition = 'center';
      }
      el.style.backgroundImage = 
        'url("' + (preview ? previewSrc : src) + '")';
    } 
    return ret;
  },
  BackgroundPattern: function(name, src, previewSrc, translate = false) {
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
    ret.translate = translate;
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
  CenterImage: function(name, src, previewSrc, translate = false) {
    // Don't forget to add the right vibrate effect to the image.
    const ret = {};
    ret.translate = translate;
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
  TemplateContent: function(name, templateId, translate = false) {
    const ret = {};
    ret.name = name;
    ret.translate = translate;
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
    cardStuffFactories.BackgroundImage(
      'Le pulleur over LACK 2',
      imgs.pulleurLack1,
      imgs.pulleurLack1Pv,
      'bg-img-3'
    ),
    cardStuffFactories.BackgroundImage(
      'Le pulleur over LACK 3',
      imgs.pulleurLackReverse,
      imgs.pulleurLackReversePv,
      'bg-img-2'
    ),
    cardStuffFactories.BackgroundImage(
      'Le pulleur over LACK 4',
      imgs.pulleurLack2,
      imgs.pulleurLack2Pv,
      'bg-img-3'
    ),
    cardStuffFactories.BackgroundImage(
      'yawningPull',
      imgs.yawningPull,
      imgs.yawningPullPv,
      'bg-img-3',
      true
    ),
    cardStuffFactories.BackgroundCSSClass(
      'bgGCC',
      'bg-cool-colors',
      undefined,
      undefined,
      true
    ),
    cardStuffFactories.BackgroundCSSClass(
      'bgColorful',
      'bg-animated-gradient',
      undefined,
      undefined,
      true
    ),
    cardStuffFactories.BackgroundCSSClass(
      'bgBrown',
      'bg-brown',
      undefined,
      undefined,
      true
    ),
    cardStuffFactories.BackgroundPattern(
      'bgPrivJoke',
      imgs.patgpib,
      imgs.patgpibPv,
      true
    ),
    cardStuffFactories.BackgroundPattern(
      'Multipull', 
      imgs.patpull, 
      imgs.patpullPv
    ),
    cardStuffFactories.BackgroundImage(
      'bgCloseUp',
      imgs.pulleurGrosPlan,
      imgs.pulleurGrosPlanPv,
      undefined,
      true
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
      'Pull boite 1',
      imgs.pullboite1,
      imgs.pullboite1Pv
    ),
    cardStuffFactories.CenterImage(
      'mondayMorning',
      imgs.tetedepull,
      imgs.tetedepull_preview,
      true
    ),
    cardStuffFactories.CenterImage(
      'notACat1',
      imgs.lapinet,
      imgs.lapinetPv,
      true
    ),
    cardStuffFactories.CenterImage(
      'notACat2',
      imgs.lapinetSourdine,
      imgs.lapinetSourdinePv,
      true
    ),
    cardStuffFactories.CenterImage(
      'artisticImpression',
      imgs.capribrut,
      imgs.capribrutPv,
      true
    )
  ],
  effects: [
    {
      name: 'bouncingHead',
      translate: true,
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
      },
      disable: function() {
        this.imgEffect && this.imgEffect.stop();
      }
    },
    cardStuffFactories.TemplateContent(
      'glowingSun',
      'svgSun',
      true
    ),
    {
      name: 'rainbow',
      translate: true,
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
      name: 'crazyRainbow',
      translate: true,
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
      enable: function(el, window, document) {
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
    },
    {
      name: 'randomGifs',
      translate: true,
      preload: function(callback, el, window, document) {
        return new Promise((resolve, reject) => {
          this.gifsEffect = new RandomGifsEffect(
            window,
            document,
            el,
            imgs.gifs,
            _ => {
              (callback && callback());
              resolve();
            }
          );
        });
      },
      enable: function(el, window, document) {
        if (!this.gifsEffect) {
          this.gifsEffect = new RandomGifsEffect(
            window,
            document,
            el,
            imgs.gifs,
            _ => {
              this.gifsEffect.initialize();
            }
          )
        } else {
          this.gifsEffect.initialize();
        }
      },
      disable: function() {
        this.gifsEffect && this.gifsEffect.stop();
      }
    },
    {
      name: 'Pull Doppler',
      preload: function(callback, el, window, document) {
        return new Promise((resolve, reject) => {
          this.skewEffect = new SkewedImgEffect(
            window,
            document,
            el,
            imgs.pulleurSvg,
            'skewed-img',
            _ => {
              (callback && callback());
              resolve();
            }
          );
        });
      },
      enable: function(el, window, document) {
        if (!this.skewEffect) {
          this.skewEffect = new SkewedImgEffect(
            window,
            document,
            el,
            imgs.pulleurSvg,
            'skewed-img',
            _ => {
              this.skewEffect.initialize();
            }
          );
        } else {
          this.skewEffect.initialize();
        }
      },
      disable: function() {
        this.skewEffect && this.skewEffect.stop();
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