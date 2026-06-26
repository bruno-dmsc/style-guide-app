import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;

  // Injetamos o DOCUMENT para manipular o HTML de forma segura no Angular
  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeName = this.isDarkMode ? 'lara-dark-blue' : 'lara-light-blue';
    
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `assets/themes/${themeName}/theme.css`;
    }

    // Ativa as variáveis do modo escuro no CSS customizado
    if (this.isDarkMode) {
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
    }
  }
  
}