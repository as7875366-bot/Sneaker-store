import { Component, inject } from '@angular/core';
import { EmailService } from '../email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  private emailService = inject(EmailService); // Service Inject ki

  onSubmit(e: Event) {
    const form = e.target as HTMLFormElement;

    this.emailService.sendForm(form)
      .then(() => {
        Swal.fire('Bheja Gaya!', 'Aapka email humein mil gaya hai. 🚀', 'success');
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'Kuch gadbad ho gayi, firse try karein.', 'error');
      });
  }

}
