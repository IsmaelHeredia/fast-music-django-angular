import { createReducer, on } from '@ngrx/store';
import { setTheme } from '../action/app.action';

export const initialState = {
  mode: 'dark',
};

export const themesReducer = createReducer(
  initialState,
  on(setTheme, (state, { mode }) => (
    {
      ...state,
      mode
    }
  )
  ),
);