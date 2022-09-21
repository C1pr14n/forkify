import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX, getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
// this state obj will get update it by the loadRecipe function and will also be updated into the Controller which imports this state
// this state contains all the data we need in order to Build our Application

const createRecipeObject = function (data) {
  // Creating a new obj with our named data based on the data we get from our API
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // adding the key to the Obj: we can't simply do key: recipe.key bcuz some recipes might not have a key (A Trick to Conditionally add Properties to an Object)
    ...(recipe.key && { key: recipe.key }), // the AND (&&) operator Short Circuits, so if recipe.key is falsy value(doesn't exists), nothing will happen here (the destructuring does Nothing) but if is recipe.key is some value then the 2nd part of the operator is executed and returned (the object) and the whole expression will become that object and then we can spread that object to basically put the values here and this will be the same as if the value would be out here like this: key: recipe.key
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`); // awaiting the Promise that come from our getJSON function we created in helpers module and storing that resolved value into a new const data
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      // this method also means 'any' --- this method will loop over an array and then return true if ANY of them have true for the condition we specify
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    // Temporary error handling
    console.error(`${err} 💥💥💥💥`);
    throw err; //throwing the error so we can use it/handle it in the controller
  }
};
// this function (loadRecipe) won't actually return anything but only change our state object which will then contain the Recipe and into which the Controler will then grab and take the recipe out of there - This works bcuz of the Live connection between the exports and the imports

export const loadSearchResults = async function (query) {
  // this f() is going to be called by the controller (the controller will tell this f() what to search for and it will that through a query -like string that we can plug it into API call)
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`); // we already have a parameter ('?') so we need the '&' to continue adding the key
    console.log(data);

    // hovering over the array we receive from data and creating our own object for each object in the array
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    }); // this will return a new array with new objects that we'll store in the state object that holds our data

    // we need to also reset the page to 1 again in case the use is searching for another query while he has results already and he is on page 2, or 3 (otherwise when he looks for another query it will show the use the results on the page number he was in prev query)
    state.search.page = 1;

    //
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err; //throwing the error so we can use it/handle it in the controller
  }
};

// this is Not going to be an async f() bcuz we already have the search results loaded at this point (at the point when we will call this getSearchResultsPafe() f
// all we want for this f() is to reach into the state and get the data for the page that is being requested
export const getSearchResultsPage = function (page = state.search.page) {
  //setting page to be the default value we get from our sate object
  // this is the logic for pages

  state.search.page = page;

  //

  const start = (page - 1) * state.search.resultsPerPage; // 0; if page will be 1 it will show 0 which is perfect; if page will be 2 the result here will be 10 and so on
  const end = page * state.search.resultsPerPage; // 9; 1 will give 10, 2 will give 20 and so on

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // reach the state and increase/decrease the ingridients in the recipe
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQuant = oldQuant * newServing / oldServings // 2 * 8 / 4 = 4
  });

  // updating servings of the current recipe
  state.recipe.servings = newServings;
};

// setting the function to retain data in the local storage browser
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // key: value
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; //setting a new property on this recipe object

  persistBookmarks();
};

// COMMON PATTERN IN PROGRAMMING: when we want to add something (previus method) we add the whole data (recipe) but when we wanna delete something add only the id as our argument (following method):

export const deleteBookmark = function (id) {
  // DELETE Bookmarked
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // converting back the string to obj
};

init();

// simple function for debuging usefull only for building the project
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // 1st: taking the raw data we transformed in an Obj in addRecipeView module and turn into an OBJ similar with what we get when taking recipes from API
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1] //we do this on the ing[1] bcuz it's the 2nd element in the arrays entries (which is the value: 1st elem is the key)
        //   .replaceAll(' ', '')
        //   .split(','); // replacing all the spaces with and empty string and Splitting by ',' and destructuring this array of 3 elements we'll get
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          // in case user doesn't rescpect the ing format
          throw new Error(
            'Wrong ingredient format! Please use the correct format! :)'
          ); // error will be handled in controller

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description }; // if there's quantity, transform it into a number, if not, return null (as we get in the API where we get the recipes from)
      });
    // obj.entries() is the opposite of Object.fromEntries(dataArr) turnig the Obj into arrays entires
    // we take only the ingridients fields where those conditions in the filter method are fulfilled
    // console.log(ingredients);
    // and we only need to take the data out of these ingredient's arrays and put it into an object with the help of .map()

    // 2nd: creating the Obj that is ready to be uploaded
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);

    // 3rd: sending it to the API (we will need to create a method of sending JSON in our helpers.js module)
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe); // The '?' is to specify a list of parameters and then key we have in the config file | also, this will also send data back to us so we need to store it | sendJSON() has 2 parameters: url, data(recipe in our case)

    //store the data into the state obj:
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe); // adding the recipe created in the on bookmarks

    //
  } catch (err) {
    throw err;
  }
};
