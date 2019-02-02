import './styles/base.scss';

// This should exclude IE 11.
import './browser-detect';
if (!window.Modernizr.arrow || !window.Modernizr.promises) {
  document.body.innerHTML = 'Warning: this app won\'t work on your browser. Please download a modern browser.';
}

import Capricartes from './capricartes';

const app = new Capricartes(window, document);

app.init();