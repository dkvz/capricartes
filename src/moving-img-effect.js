class MovingImgEffect {

  constructor(window, document, parent, src, imageId) {
    this.window = window;
    this.document = document;

    // Parameters for the animation:
    this.vx = 10;
    this.vy = 15;
    this.x = 0;
    this.y = 0;

    this.loaded = false;
    this.parent = parent;
    this.img = new Image();
    this.img.src = src;
    this.img.id = imageId;
    this.img.style.position = 'absolute';
    this.img.addEventListener("load", this.imageLoaded.bind(this));
  }

  imageLoaded() {
    // At this point we have the dimensions of the image.
    this.loaded = true;
    this.initialize();
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