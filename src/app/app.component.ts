import { Component, Inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isDarkMode: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {
    // Check if theme is already saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  private enableDarkMode() {
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  private disableDarkMode() {
    this.renderer.removeAttribute(this.document.documentElement, 'data-theme');
    localStorage.setItem('theme', 'light');
    this.isDarkMode = false;
  }

}
