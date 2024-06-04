import * as model from './model.js'
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from  './views/recipeViews.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchViews from './views/searchViews.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';






// https://forkify-api.herokuapp.com/v2


//Notes For ME
/* 
to get all ingredients => we will make loop for it
and get data we need from ingredients as string by use join() method

Example : - 

${recipe.ingredients.map(ing => {
  return `
        <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="src/img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity}</div> 
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                </div>
          </li>
  
  `;
}).join('')}

* need to import icons file to appear in application
import icons from 'url:../img/icons.svg';
and we can use icons like this : -
                  <use href="${icons}#icon-clock"></use>


=> there problem for that , and solve it by => add to script file in html type="module"


* we download two packages to support old browser
  npm i core-js regenerator-runtime

 - and imported these two packages 
 import 'core-js/stable';
 import 'regenerator-runtime/runtime';

 * Many are real world Application have two special Module that are completely independent of the rest of the architecture 
  * and these are a Module for the project configuration and also Module for some general helper functions 
  *  1 - config.js => in this file we basically put all the variables that should be CONSTANTS , and should be reused across the project 
  * 2 - helper.js

* We Will Create View.js => As Parent Class for every class Views , for that it will contain all duplicated method and data and we will make to these extends from child view class
 * duplicated methods and property =>
 
*/


// get recipes from Api
const controlRecipes = async function (){
  try {
      // get hash from link
      const id = window.location.hash.slice(1);

      if(!id) return
      // render Spinner
      recipeView.renderSpinner();

       // 0 ) Update results view to mark selected search result
            resultsView.update(model.getSearchResultsPage());
      // 1) update bookmarksView
            bookmarksView.update(model.state.bookmarks);

      // 2 ) Loading recipe
        await model.loadRecipe(id);

      // 3 ) Rendering recipe
          recipeView.render(model.state.recipe);
    } catch(err){
      recipeView.renderError();
    }
};

const controlSearchResults = async function (){
try {
  resultsView.renderSpinner();

  //  1- Get search query
  const query = searchViews.getQuery();
  if(!query) return;
   
  // 2 - Load search results
  await model.loadSearchResult(query);

   //  3 - Render results 
// resultsView.render(model.state.search.results)
resultsView.render(model.getSearchResultsPage()); 

// 4 - Render initial pagination buttons 
paginationView.render(model.state.search);

 } catch (err) {
   
  throw err;
  } 
};

const controlPagination = function (goToPage) {
 //  3 - Render New results 
// resultsView.render(model.state.search.results)
resultsView.render(model.getSearchResultsPage(goToPage)); 

// 4 - Render New  pagination buttons 
paginationView.render(model.state.search);
}

// Serving Controller
const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings)
  //Update the recipe view
  //   recipeView.render(model.state.recipe);
     // create update method to up date only text and attribute in DOM .
   recipeView.update(model.state.recipe);
}

// controller bookmark
const controlAddBookmark = function (){
  // 1) Add/remove bookmark
if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
 // 2) update recipe view
recipeView.update(model.state.recipe)

// 3) render bookmarks
bookmarksView.render(model.state.bookmarks)
}


const controlBookmarks = function (){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try {
 //Show loading Spinner
 addRecipeView.renderSpinner();
 
// Upload the new Recipe data
   await model.uploadRecipe(newRecipe); 
   console.log(model.state.recipe)
   // Render recipe
   recipeView.render(model.state.recipe);
   

   // Success Message
   addRecipeView.renderMessage();

   // Render bookmark view
   bookmarksView.render(model.state.bookmarks);

   // Change ID in URL
    window.history.pushState(null , '' ,`#${model.state.recipe.id}`);

   // Close form window
   setTimeout(function(){
    addRecipeView.toggleWindow();
   }, MODEL_CLOSE_SEC * 1000);

  } catch (err){
    console.error('💥' ,err)
    addRecipeView.renderError(err.message)
    }
};


// Use Subscriber publisher Pattern 
const init = function (){
bookmarksView.addHandlerRender(controlBookmarks);
recipeView.addHandlerRender(controlRecipes);
searchViews.addHandlerSearch(controlSearchResults);
paginationView.addHandlerClick(controlPagination);
recipeView.addHandlerUpdateServings(controlServings);
recipeView.addHandlerAddBookmark(controlAddBookmark);
addRecipeView._addHandlerUpload(controlAddRecipe);
}
init();