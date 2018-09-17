/**
 * Why did I make this into a class?
 * I have no idea. It just wrote itself as if god was
 * whispering this code to me. I'm sure he/she/they will
 * like the result.
 */
class MovingImgEffect {

  constructor(window, document, parent, src, imageId, start = false, loadedCallback = undefined) {
    this.window = window;
    this.document = document;

    // Parameters for the animation:
    this.vx = 10;
    this.vy = 15;
    this.x = 0;
    this.y = 0;
    this.loadedCallback = loadedCallback;

    this.loaded = false;
    this.parent = parent;
    this.start = start;
    this.img = new Image();
    this.img.addEventListener('load', this.imageLoaded.bind(this));
    this.img.src = src;
    this.img.id = imageId;
    this.img.style.position = 'absolute';
  }

  imageLoaded() {
    // At this point we have the dimensions of the image.
    this.loaded = true;
    this.initialWidth = this.img.width;
    this.initialHeight = this.img.height;
    (this.loadedCallback && this.loadedCallback());
    // Set the image size according to initial viewport size:
    if (this.parent.offsetWidth < (this.initialWidth * 2)) {
      console.log('Setting size to half');
      this.img.width = this.initialWidth / 2;
      this.img.height = this.initialHeight /2;
    }
    (this.start && this.initialize());
  }

  initialize() {
    if (this.loaded === true) {
      this._reposition();
      this.parent.appendChild(this.img);
      this.window.requestAnimationFrame(this._animate.bind(this));
    }
  }

  _reposition() {
    this.img.style.bottom = this.y + 'px';
    this.img.style.left = this.x + 'px';
  }

  _animate() {
    // getComputedStyle might help me find the position if it
    // changed.
    // Actually I'm going to keep the position as a property
    // of the current object rather than trying to get it from
    // the DOM.
    this.x += this.vx;
    this.y += this.vy;
    this._reposition();
    //console.log(`xv ${this.vx} vy ${this.vy} x ${this.x} y ${this.y}`);
    if (
      (this.y <= 0 && this.vy < 0) ||
      (this.y >= this.parent.offsetHeight - this.img.height &&
        this.vy > 0)
    ) {
      this.vy = -this.vy;
    }
    if (
      (this.x <= 0 && this.vx < 0) ||
      (this.x >= this.parent.offsetWidth - this.img.width && this.vx > 0)
    ) {
      this.vx = -this.vx;
    }
    this.window.requestAnimationFrame(this._animate.bind(this));
  }

  removeImg() {
    if (this.document.getElementById(this.img.id)) {
      this.parent.removeChild(this.img);
      this.loaded = false;
    }
  }

}

module.exports = MovingImgEffect;