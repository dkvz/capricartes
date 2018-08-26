
import MovingImgEffect from './moving-img-effect';

const imgs = {
  capriboite1: require('../static/crapic_1.png'),
  capriboite2: require('../static/crapic_2.png'),
  capriboite2: require('../static/crapic_3.png'),
  capritet: require('../static/capritet.png')
};

const cardStuff = {

  backgrounds: [
    {
      name: 'Le pulleur - Du dessous',
      preload: function(callback) {
        
      },
      enable: function(el, preview) {

      }
    },
    {
      name: 'Great choice of colors',
      enable: function(el, preview) {

      }
    }
  ],
  foregrounds: [
    {
      name: 'Caprice boite 1',
      preload: function(callback) {
        return new Promise((resolve) => {
          this.img = cardStuff._createImage(
            imgs.capriboite1,
            _ => {
              callback && callback();
              resolve();
            });
        });
      },
      enable: function(el, preview) {

      }
    },
    {
      name: 'Caprice boite 2',
      preload: function(callback) {

      },
      enable: function(el, preview) {

      }
    },
    {
      name: 'Caprice boite 3',
      preload: function(callback) {

      },
      enable: function(el, preview) {

      }
    }
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

  getImagePromise: function(src, callback) {
    return new Promise((resolve, reject) => {
      this._createImage(src, _ => {
        (callback && callback());
        resolve(img);
      });
    });
  },
  _createImage: function(src, onload) {
    const img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
  }

};

export default cardStuff;