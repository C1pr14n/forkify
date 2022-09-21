import icons from 'url:../../img/icons.svg'; // Parcel v.2

export default class View {
  _data;

  // THIS IS HOW WE WRITE JS DOCUMENTAION ABOUT THE FUNCTION WE USE:

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (ex: recipe)
   * @param {boolean} [render = true] If false create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {object} View instance
   * @author Ciprian
   * @todo Finish implementation
   */
  //Object[] means Object of arrays in the JS DOC; [render] means this is optional

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // translate as: if there is no data (null or undefined) or if there is data but in array and if it's empty (checking it with a helper function which is on Array constructor: isArray())

    // this render method will be responsible of puting the html onto the page
    this._data = data; // taking the data we receive from model.state.recipe from the controller file
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    // Attaching this html markup to the recipe container named acordingly as we can see at the top of the code (inserting it as a first child - afterbegin, to our parent element - recipe)
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // we will create here new markup but not render it (we will just generate this markup and then compare that new html to the current html and then only change texts and attributes that actually have changed from the old version to the new version)
    // but now with markup, which is just a string it will be diff to compare to the DOM elements that we curently have on the page. To fix that we can use a trick to convert this markup string to a DOM obj that it's living in the memory and that we can then use to compare with the actual DOM that's on the page

    const newDOM = document.createRange().createContextualFragment(newMarkup); //this method will convert that string into real DOM node objects
    // so newDOM will become a big Obj which is like virtual DOM (DOM that is not really living on the page but lives in our memory) and we can use this DOM as if it was the real DOM on our page
    const newElements = Array.from(newDOM.querySelectorAll('*')); // selecting all the elements in the newDOM
    // console.log(newElements);
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // with Array.from we transform the Node List we get from selecting all the elements into an actual array

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(newEl.isEqualNode(curEl));
      // comparing these 2 elements curEl - newEl with a handy method, available on all Nodes which is: isEqualNode()
      // console.log(curEl, newEl.isEqualNode(curEl)); // In each iteration we will log whether the newEl is equal Node to curEL

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // we need to select the firstChild bcuz the child node is atucally the one that contains the text and the Elements is really just an element (elem node and Not a text node)
        // and we take the text out of that child node triming it for any empty spaces
        // we also added some optional chaining on the firstchild(?.) in case in doesnt exists

        // if these 2 are diff
        curEl.textContent = newEl.textContent; // we will change the text content of the curEl to the text of the newEl (the virtual one we created) - updating the DOM only in places where it didnt change where it was about to change

        // but we only need to change the curEl where is text, NOT other elements so we need another method:
        // nodeValue() is a method available on all nodes that will give null on all the elements that are not text
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        // console.log(newEl.attributes); //logging the attributes prop of  all the elem that have changed
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        ); // transforming the newEl.attributes into an array, looping over it and replace all the attributes in the curEl by the attributes comming from the newEl
    });

    //
  }

  _clear() {
    // this method will be usable for all the views as long as all the views have a Parent Element property
    this._parentElement.innerHTML = '';
  }

  // This one will be a public method so that the Controller can Call this Method here as it Starts Fetching the data
  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
      `;

    this._clear(); // this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    // if there is not message passed in, we are simply setting a default
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

// we are now exporting the class itself, bcuz we are not gonna create any instances of this view, we will just use it as a Parent Class for the other child Views (resultsViews.js, recipeViews etc) - so we can use certain methods across all of them without repeatig
