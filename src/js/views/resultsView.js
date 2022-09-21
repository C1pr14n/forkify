import View from './View.js';
import previewView from './previewView.js';

// with this 'extends' keyword we determine that the ResultsView class is a child to the View Parent Class
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
