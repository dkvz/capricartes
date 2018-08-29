
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
  capritet: require('../static/capritet.png')
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
      el.className = (preview && previewSrc) ? 
        className + '-preview' : className;
    };
    return ret;
  },
  BackgroundImage: function(name, src, previewSrc) {
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
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundAttachment = 'fixed';
      el.style.backgroundPosition = 'center';
      el.style.backgroundSize = 'cover';
      el.style.backgroundImage = `url('${preview ? previewSrc : src}')`;
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

  getImagePromise: function(src, callback) {
    return new Promise((resolve, reject) => {
      this.createImage(src, _ => {
        (callback && callback());
        resolve(img);
      });
    });
  },
  createImage: function(src, onload) {
    const img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
  }

};

const cardStuff = {

  backgrounds: [
    cardStuffFactories.BackgroundImage(
      'Le pulleur over LACK',
      imgs.pulleurDessous,
      imgs.pulleurDessousPv
    ),
    cardStuffFactories.BackgroundCSSClass(
      'Great choice of colors',
      'bg-cool-colors'
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
    )
  ],
  effects: [
    {
      name: 'Bouncing head',
      preload: function(callback) {
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
    }
  ],

};

export default cardStuff;