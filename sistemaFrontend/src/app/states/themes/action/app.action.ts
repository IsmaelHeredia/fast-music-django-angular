import { createAction, props } from '@ngrx/store';

export const setTheme = createAction('[setTheme] Set current theme', props<{ mode: string }>()); 
