class SearchView {
  _parentEl = document.querySelector('.search'); //selecting the parent element which will be the form with the class name: search that contains everything we need to control: input form and search button

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value; //selecting the typed search value from the form
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    //this is the Publisher - subscriber is the controllerSearchResults
    this._parentEl.addEventListener('submit', function (e) {
      // we can't call the hadnler right away bcuz whenever we submit a form we need to prevent the DEFAULT action (otherwise the page gonna reload)
      e.preventDefault();
      handler();
    }); //adding the Listener to the entire form with the submit so we can listen for click on the button or enter from keyboard
  }
}
// this class is Not going to Render anything but only Get the query and listen for the click event on the button

// Using the Publisher-Subscriber pattern again (used it with addHandlerRecipe) here like this: we're listening for the event in here (view - searchView), then pass the controller function (so the handler() function) into the method that we will build here (addHandlerSearch())

export default new SearchView();
// we Don't export that class but export an instance (an obj that was created by this class)
