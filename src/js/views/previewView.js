// This is a child class for resultsView.js and bookmarksView.js

import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel v.2

// with this 'extends' keyword we determine that the ResultsView class is a child to the View Parent Class
class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1); //taking everything expect the 1st element (starting to read from the 1st elem)

    return `
        <li class="preview">
            <a class="preview__link ${
              this._data.id === id ? 'preview__link--active' : ''
            }" href="#${this._data.id}">

              <figure class="preview__fig">
                  <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>

              <div class="preview__data">
                  <h4 class="preview__title">${this._data.title}</h4>
                  <p class="preview__publisher">${this._data.publisher}</p>
                  
                  <div class="preview__user-generated ${
                    this._data.key ? '' : 'hidden'
                  }">
                    <svg>
                    <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
              </div>
            </a>
        </li>
    `;
  }
}

export default new PreviewView();
