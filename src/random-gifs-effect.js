
class RandomGifsEffect {

  constructor(window, document, parent, gifs, className, loadedCallback = undefined) {
    this.window = window;
    this.document = document;
    this.parent = parent;

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
  }

  initialize() {
    // We need to calculate the size for the images.
    
  }

  _setImageSizes() {
    /**
     * Image size will depend on:
     * - Parent size
     * - Number of images we got
     */
    
  }

  stop() {

  }

}

module.exports = RandomGifsEffect;