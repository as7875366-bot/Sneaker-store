import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';
import { CartService } from '../cartservices.service';
import { EmailService } from '../email.service'; // 1. EmailService Import kiya
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

declare var Stripe: any; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm!: FormGroup;
  cart: any[] = [];
  subtotal: number = 0;
  gst: number = 4.45;
  grandtotal: number = 0;

  stripe: any;
  cartElement: any;
  inprocessing = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderservice = inject(OrderService);
  private cartservice = inject(CartService);
  private emailService = inject(EmailService); // 2. Service Inject ki

  ngOnInit(): void {
    this.cart = this.cartservice.getCartItems();
    this.subtotal = this.cartservice.getSubtotal();
    this.grandtotal = this.subtotal + this.gst;

    if (this.cart.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.initForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (typeof Stripe !== 'undefined') {
        this.stripe = Stripe('pk_test_51OXLkBCgTYG0LBH1TKnX4icXnEyw1xOIEJSZvAeKlmEq6RnSPbl9uqdwqY9UWKsvRJN6m3dE05ArIp6gNJ9kxpby00rl1GahFz');
        const elements = this.stripe.elements();
        
        this.cartElement = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '18px',
              color: '#32325d',
            }
          }
        });

        this.cartElement.mount('#stripe-card-element');
      } else {
        console.error("Stripe script not found in index.html");
      }
    }, 1000);
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['India', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
      paymentMethod: ['card', Validators.required]
    });
  }

  async onSubmit() {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    this.inprocessing = true;
    const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;

    if (paymentMethod === 'card') {
      const { token, error } = await this.stripe.createToken(this.cartElement);
      if (error) {
        Swal.fire('Payment Error', error.message, 'error');
        this.inprocessing = false;
      } else {
        this.processFinalOrder(token.id);
      }
    } else {
      this.processFinalOrder('CASH_ON_DELIVERY');
    }
  }

  processFinalOrder(paymentId: string) {
    const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
    const shippingDetails = this.checkoutForm.value;

    const finalOrder = {
      orderId: orderId,
      date: new Date(),
      items: [...this.cart],
      total: this.grandtotal,
      paymentId: paymentId,
      status: 'Pending',
      shippingDetails: shippingDetails
    };

    // 3. Email Data Taiyar Karo
    const emailParams = {
      to_name: shippingDetails.firstName + ' ' + shippingDetails.lastName,
      order_id: orderId,
      total_amount: '₹' + this.grandtotal.toFixed(2),
      customer_email: shippingDetails.email,
      message: `Bhai, aapka order successfully place ho gaya hai! Total Items: ${this.cart.length}`
    };

    // 4. Order Place Karo
    this.cartservice.placeOrder(finalOrder);

    // 5. Confirmation Email Bhejo
    this.emailService.sendEmailData(emailParams)
      .then(() => console.log('Email Sent!'))
      .catch((err) => console.error('Email failed!', err));
    
    this.inprocessing = false;

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      text: 'Confirmation email has been sent.',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/orders']);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }
}