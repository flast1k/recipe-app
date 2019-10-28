import { Actions, Effect, ofType } from '@ngrx/effects';

import * as RecipeActions from '../store/recipe.actions';
import { Recipe } from '../recipe.model';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRecipe from '../store/recipe.reducers';


@Injectable()
export class RecipeEffects {
  private url = 'https://ng-recipe-book-19bd5.firebaseio.com/recipes.json';

  @Effect()
  recipeFetch = this.actions$
    .pipe(
      ofType(RecipeActions.FETCH_RECIPES),
      switchMap((action: RecipeActions.FetchRecipes) => {
          return this.httpClient.get<Recipe[]>(this.url);
        }
      ),
      map(recipes => {
        for (const recipe of recipes) {
          if (!recipe.ingredients) {
            recipe.ingredients = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes,
        };
      }),
    );

  @Effect({dispatch: false})
  recipeStore = this.actions$
    .pipe(
      ofType(RecipeActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([action, state]) => {
          const req = new HttpRequest('PUT', this.url, state.recipes, {
            reportProgress: true,
          });
          return this.httpClient.request(req);
        }
      ),
    );

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromRecipe.FeatureState>) {
  }
}
