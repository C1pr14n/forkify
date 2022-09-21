import View from './View.js';
import icons from 'url:../../img/icons.svg';

// with this 'extends' keyword we determine that the ResultsView class is a child to the View Parent Class
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded! (❁´◡`❁)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // the controller won't action this method like in other modules but it will call itself with the help of this constructir function that has the super() syntax to determine that is a child | but this module still needs to be imported in the controller module so this file can run
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden'); // toggle will remove the class when it is there and add it when it is not - better then remove and then adding it again
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // binding the correct this keyword - manually setting the this keyowrd inside of the toggleWindow() f to the this keyword that we wanted to be bind. And now, this keyword here points to the current Object bcuz otherwise the this keyword will be the btn on which the Event Listener is attached to
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); // add the hidden class when pressing 'X' btn
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // or outside of the form
  }

  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // a modern browser API useful for us in selecting the values from all the fields that we need to change from or html form | we pass in a form which is the this keyword which points to the parentElem. This Api will return a weird object that we can spread into an array
      const data = Object.fromEntries(dataArr); // since ES2019 there is a new handy method: Object.fromEntries() that we can use to Convert Entries to an Object (bcuz in the dataArr we only have array entries and in an API we send data as an Object)

      // now in order to send this data when pressing the upload btn, we would need an API (which the model.js is respnsible for API calss), so we need a controller function to handler this (publisher-subscriber pattern)
      handler(data);
    });
  }

  _generateMarkup() {
    //
  }
}

export default new AddRecipeView();
