import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';
import { Theme } from './theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private style: HTMLLinkElement | undefined;
  private skin: string | undefined;
  private themeId: string = 'themeCSS';
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  setTheme(theme: Theme, renderer2: Renderer2) {
    this.skin = `${theme}.css`;
    this.resetStyles(renderer2, this.themeId);

    this.style = renderer2.createElement('link') as HTMLLinkElement;

    renderer2.setProperty(this.style, 'rel', 'stylesheet');
    renderer2.setProperty(this.style, 'href', this.skin);
    renderer2.setProperty(this.style, 'id', this.themeId);

    renderer2.appendChild(this.document.head, this.style);
  }

  resetStyles(renderer2: Renderer2, themeCSSID: string) {
    const themeIDHTMlElem = this.document.getElementById(themeCSSID);
    if (themeIDHTMlElem) {
      renderer2.removeChild(this.document.head, themeIDHTMlElem);
    }
  }
}