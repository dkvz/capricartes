class SkewedImgEffect {

  constructor(window, document, parent, src, className, loadedCallback = undefined) {
    this.window = window;
    this.document = document;

    this.loadedCallback = loadedCallback;
    this.loaded = false;
    this.disabled = false;
    this.parent = parent;
    // The speeds are overriden later on, 
    // in the resize() method, so these 
    // values are pretty much useless.
    this.vMin = 5;
    this.vMax = 20;
    this.vx = this.vMin;
    this.y = 0;
    // Skew min and max in deg:
    this.skewMin = 10;
    this.skewMax = 60;
    // We start from the left.
    // "right" is the direction.
    this.right = false;

    this.img = new Image();
    this.img.addEventListener('load', this._imageLoaded.bind(this));
    this.img.src = src;
    this.img.className = this.className ? className : '';
    // Additionnal img styles here:
    this.img.style.position = 'absolute';
    // My super stacking-things-up logic should not
    // be hardcoded like this.
    this.img.style.zIndex = 75;
  }

  _imageLoaded() {
    this.loaded = true;
    this.initialWidth = this.img.width;
    this.initialHeight = this.img.height;
    (this.loadedCallback && this.loadedCallback());
  }

  initialize() {
    this.disabled = false;
    // Decide the size to use.
    this.resize();
    // Append the image to the parent:
    this.parent.appendChild(this.img);
    this.start();
  }

  /**
   * I decided the image had to have a height that can
   * go 4 times into the document height minus a certain
   * margin to be defined.
   * I guess I'll forget about that margin for now.
   */
  resize() {
    // We use this.parent.offsetHeight.
    this.currentOffsetHeight = this.parent.offsetHeight;
    this.currentOffsetWidth = this.parent.offsetWidth;
    const tDim = Math.floor(this.currentOffsetHeight / 4);
    if (this.img.height > tDim) {
      // Resize:
      this.img.height = tDim;
    }
    this.minSpeed = Math.ceil(this.img.width / 4);
    this.maxSpeed = Math.ceil(this.img.width * 2.5);
  }

  /**
   * Position the image before a new animation
   * cycle.
   * We need to decide:
   * - Starting from right or left
   * - Movement speed
   * - Vertical (Y) position
   */
  _newPosition() {
    this.right = Math.random() < 0.5 ? true : false;
    this.x = this.right ? 
      this.currentOffsetWidth + this.img.width :
      -this.img.width
    this.vx = Math.ceil(
      this.vMin + Math.random() * (this.vMax - this.vMin)
    );
    // The skew angle has to change according to speed.
    // THERE BE MATh
    let skew = Math.ceil(
      ((this.vx - this.vMin) / (this.vMax - this.vMin)) * 
      (this.skewMax - this.skewMin) + this.skewMin
    );
    if (this.right) skew = -skew;
    this.img.style.transform = 'skew(' 
      + skew
      + 'deg)';
    this.y = Math.ceil(
      Math.random() * (this.currentOffsetHeight - this.img.height)
    );
    this._repositionX();
    this._repositionY();
  }

  _repositionX() {
    this.img.style.left = this.x + 'px';
  }

  _repositionY() {
    this.img.style.top = this.y + 'px';
  }

  start() {
    this._newPosition();
    this.window.requestAnimationFrame(this._animate.bind(this));
  }

  _animate() {
    this.x = this.right ? this.x - this.vx : this.x + this.vx;
    this._repositionX();
    if ((!this.right && this.x >= this.currentOffsetWidth) ||
      (this.right && this.x <= -this.img.width)) {
      this._newPosition();
    }
    if (!this.disabled) this.window.requestAnimationFrame(
      this._animate.bind(this)
    );
  }

  stop() {
    this.disabled = true;
  }

}

module.exports = SkewedImgEffect;