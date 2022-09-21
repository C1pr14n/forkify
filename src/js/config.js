// Putting all the var that should be constants and should be re-use across the project

// The Goal of Having this File (or Module) with all these vars is that will allow us to easily configure our project by simply changing some of the data here

// imagine our fetch API link const is changing its version (v3) and it will be easy to change it from here and it work across all the web app

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
// using caps in this var bcuz it will never change (common practice in programming)

export const TIMEOUT_SEC = 10;

export const RES_PER_PAGE = 10;

export const API_KEY = 'f72ea776-fb1e-4df3-9840-a095b489d12b';

export const MODAL_CLOSE_SEC = 2.5;
