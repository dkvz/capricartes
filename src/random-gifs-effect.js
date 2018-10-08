/**
 * Makes random gifs appear.
 * Will produce errors if the gifs list (gifs in constructor)
 * is empty.
 */
class RandomGifsEffect {

  constructor(window, document, parent, gifs, loadedCallback = undefined) {
    this.window = window;
    this.document = document;
    this.parent = parent;
    this.loadedCallback = loadedCallback;
    this.disabled = false;

    this.loaded = false;
    // Prepare preloading all the images:
    Promise.all(
      gifs.map(
        gif => new Promise(
          resolve => {
            const img = new Image();
            img.addEventListener('load', _ => resolve(img));
            img.src = gif;
          }
        )
      )
    ).then(data => this._loaded(data));
    
  }

  _loaded(imgs) {
    this.imgs = imgs;
    this.loaded = true;
    this.loadedCallback && this.loadedCallback();
  }

  initialize() {
    this.disabled = false;
    // We need to calculate the size for the images.
    this._setImageSizes();
    this.imgs.forEach((img, i) => {
      img.style.position = 'absolute';
      img.style.opacity = 0;
      img.style.transition = 'opacity 3s';
      // Let's vary the zIndex to allow stuff to superpose:
      img.style.zIndex = 60 + (i % 2);
      this.parent.appendChild(img);
    });
    // We could use requestAnimationFrame combined with 
    // a setTimeout with a random duration, or just a 
    // setInterval with a pause in it (using setTimeout).
    this.start();
  }

  start() {
    this.window.requestAnimationFrame(this._animate.bind(this));
  }

  _animate() {
    // Select a gif, and switch its opacity.
    const img = this.imgs[
      Math.floor(Math.random() * this.imgs.length)
    ];
    // I'm using double equal because opacity might
    // actually be a string. In some browsers.
    // Maybe.
    if (img.style.opacity == 1) {
      // The image is currently showing, just hide it.
      img.style.opacity = 0;
    } else {
      img.style.top = Math.floor(
        Math.random() * (this.initialOffsetHeight - img.height)
      ) + 'px';
      img.style.left = Math.floor(
        Math.random() * (this.initialOffsetWidth - img.width)
      ) + 'px';
      img.style.opacity = 1;
    }
    // Now we need to introduce some kind of pseudo-random delay:
    if (!this.disabled) {
      // We could recalculate all the sizes here.
      // Not doing it though.
      this.window.setTimeout(
        this.start.bind(this), 
        Math.random() * 1500
      );
    }
  }

  // We could control if initialOffsetX exists and compare it
  // to current to decid if we need to run _setImageSizes again.
  _setImageSizes() {
    /**
     * Image size will depend on:
     * - Parent size
     * - Number of images we got
     */
    this.initialOffsetWidth = this.parent.offsetWidth;
    this.initialOffsetHeight = this.parent.offsetHeight;
    let dimToAdd, maxDim;
    if (this.parent.offsetWidth > this.parent.offsetHeight) {
      // Height is the smallest dimension, we use it 
      // to calculate the reduction factor.
      dimToAdd = 'height';
      maxDim = this.parent.offsetHeight;
    } else {
      dimToAdd = 'width';
      maxDim = this.parent.offsetWidth;
    }
    const totalDim = this.imgs.reduce((acc, img) => {
      return acc + img[dimToAdd];
    }, 0);
    if (totalDim > maxDim) {
      // We need to resize all images:
      const factor = maxDim / totalDim;
      this.imgs.forEach(img => {
        // Only change the size if the dimenion is smaller
        // than 64px or we're making things way too tiny.
        if (img[dimToAdd] > 64) img[dimToAdd] = 
          Math.floor(img[dimToAdd] * factor);
      });
    }
  }

  stop() {
    this.disabled = true;
  }

}

module.exports = RandomGifsEffect;