// Application Logic ((about the role of  this file in MVC architecture))

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilling async/await (polyfilling a term we used in preius lessons - helps make the app compatible with older browsers)

// We Don't want any DOM elements here -> They Belong to the View Module

// if (module.hot) {
//   // this is comming from parcel, won't refresh page on code changes, just clear console so it will not refresh on every word added in our code while building the app
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return; // using a guard clause in case there is no id loaded when the page refreshes

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading Recipe
    await model.loadRecipe(id); //and this f is an async one which returns a Promise but it doesnt return any value to work with so we dont need to store the result of this in a var like we usualy do when awaiting for an answer
    // this f coming from the model.js file

    // 3) Rendering Recipe
    recipeView.render(model.state.recipe); // having this render() method in which we pass in the data to render is a bit nicer than just doing this: const recipeView = new recipeView(model.state.recipe) - regarding importing the class we created in the recipeView.js
    // Passing the Data into the render() method for the class we have in the recipeView.js

    //
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  // this is the Subscriber (Publiser is in the searchView)

  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return; // adding a Guard Clause in case there is no query comming from the getQuery() method

    // 2) Load search results
    await model.loadSearchResults(query); // we dont need to store the result bcuz all this f() does is TO MANIPULATE THE STATE (same as loadRecipe()), it won't return anything

    // 3) Render results
    // resultsView.render(model.state.search.results); //this will go in the View.js in the render() method in the this._data
    // Now we only want some results per page, so:
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);

    //
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render New pagination buttons
  paginationView.render(model.state.search);
};

// this f() will activate when the user click the buttons for the increase/decrease servings ('+', '-')
const controlServings = function (newServings) {
  // Update the recipe servings (in state obj)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); // updating only texts and attrib in the DOM without rendering again the entire View
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe); // using this method again we created as an algorithm so we dont render all the page anytime we make a little change like this one where we just light the markup of the bookmarked icon when pressed (in the recipeView.js) - we pass in the brackets the data we wanna update

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe); // considering our f() is an async one and returns a promise, we need to await for it in order to work properly
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display a succes message
    addRecipeView.renderMessage(); // renderMessage is a method from parent module View.js

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks); // we are Not using update here bcuz we are really want to insert a new element (for that we use always render())

    // Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // history API of the browsers and then on this history object we can call the pushState(state, title, url) method allowing us to change the url without reloading the page
    // window.history.back();// or .forward() | we can also use this history API to go back and forth just as we were clicking the forward or back buttons in the browser (in this situation doesn't make sense)

    // Close Form Window (so we can actually see what recipe we rendered in the previosly step)
    setTimeout(function () {
      // setting a timeout so we can also put a success message after uploading and rendering our recipe data
      addRecipeView.toggleWindow(); //using the method we created in addRecipeView module
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message); // sending the err message to the function we have in the View.js module that Renders the errors
  }
};

const newFeature = function () {
  console.log('Welcome to the app!');
};

// Publisher-Subcriber method
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

//___________________________________Loading Recipe from API________________________________________________

//______________________________________Rendering the Recipe_______________________________________________

//_____________________________Listening for Load and Hashchange Events____________________________________

//_________________________________________The MVC Architecture____________________________________________

// these days programmers use a framework like React, Angular, Vue, Svelt to take care of the architecture for them

//__________________________________Helpers and Configuration Files_______________________________________

//______________________________Event Handlers in MVC: Publisher-Subscriber Pattern_______________________

// Events should be Handled in the Controller (otherwise we would have application logic in the view)
// Events should be Listened for in the View (otherwise we would need DOM elements in the controller)

// So we only call function from the controller and to do that we need the Publisher-Subsciber design Pattern

// Design Patterns in Programming are standard solutions to certain kinds of problems

// More about how Publisher-Subscriber Pattern works on Graphics: Bassically if A() -> B  - A() functions is in control if A(X) -> X; X <- B, C -- A() functions just executes the B, C functions but actually things are happening in the B(), C() functions

/*
Why cannot simply import functions from controller to the view?

1) Controller is the main module that controls what happens in the app. It delegates tasks to models and views.
2) The controller.js file is linked with the index.html file, which makes it an entry point for all other JavaScript modules.

*/

//_____________________________Implementing Search Results___________________________________________________

//______________________________Updating Recipes Servings____________________________________________________

//_________________________Deceloping a DOM Updating Arlgorithm______________________________________________

// will update the DOM only in places where it actually changed bcuz having to re-render the entire View (all of these html elements) it's a bit overkill and put too much strain on the browser (create unnecesarry work) so we will create an update() method to use in these situations  (for ex: the pages refreshes (re-renders) any time we change the number of servings)

//____________________________________Implementing Bookmarks_________________________________________________
