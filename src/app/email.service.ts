import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
// Apni keys yahan ek baar define kar do
  private readonly SERVICE_ID = 'service_a21vw1l';
  private readonly TEMPLATE_ID = 'template_l8fhe9d';
  private readonly PUBLIC_KEY = 'kBXCFHXWpD6TeUIbR';

  constructor() {}

  // 🟢 Method 1: Poora Form bhejne ke liye
  sendForm(formElement: HTMLFormElement) {
    return emailjs.sendForm(
      this.SERVICE_ID,
      this.TEMPLATE_ID,
      formElement,
      this.PUBLIC_KEY
    );
  }

  // 🟢 Method 2: Sirf Data (JSON) bhejne ke liye (Best for Order Success)
  sendEmailData(templateParams: any) {
    return emailjs.send(
      this.SERVICE_ID,
      this.TEMPLATE_ID,
      templateParams,
      this.PUBLIC_KEY
    );
  }
}
