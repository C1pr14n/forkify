// Presentation Logic (about the role of  this file in MVC architecture)

import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel v.2
import fracty from 'fracty';
// console.log(fracty);

// we use in this file the Event Delegation: targeting the parent element instead of the elem itself

// with this 'extends' keyword we determine that the RecipeView class is a child to the View Parent Class
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find the recipe. Please try another one!';
  _message = '';

  // this f() won't be a private one bcuz we need it to works as an API for controller module to use it
  addHandlerRender(handler) {
    // this handler function will be the controlRecipes() function we have in the controller module and that will come as a parameter in this function
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    // window.addEventListener('hashchange', controlRecipes);
    // window.addEventListener('load', controlRecipes);
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return; // through the closest() method we can check if the user clicked on the btn if not this Close Guard will return null
      console.log(btn);
      const { updateTo } = btn.dataset; //  Doing destructuring on the  'updateTo'. NOT converting to number the btn.dataset here bcuz we would convert btn.dataset and after that take the updateTo from there which will result in error
      // created data atribute (data-update-to - which translates here as updateTo, the dash '-' in html means caps letter to follow) in the html insertion in the generateMarkup() method to retain data

      if (+updateTo > 0) handler(+updateTo); //we will do here the conversion to a number
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    // all this f does is to return an html string
    return `
      <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this._generateMarkupIngridient)
              .join('')}
        </div>

        <di class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </di  
    `;
  }

  _generateMarkupIngridient(ing) {
    return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${fracty(ing.quantity)}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </li>
      `;
  }
}

export default new RecipeView(); // this way of exporting makes our class private so no file can access it
// not passing any data in so we dont even need a constructor function

// we are chaging from trully private: # to only protected: _ (regarding the programmers convention) bcuz right now with Parcel and Babel, Inheritance between this trully private (with 3 symbol) fields and methods doesn't really work yet
