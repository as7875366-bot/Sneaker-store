import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';
import { CartService } from '../cartservices.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
declare var Stripe: any; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
checkoutForm! :  FormGroup
cart : any[]=[]
subtotal : number = 0;
gst:number = 4.45;
grandtotal : number = 0;


stripe : any;
cartElement : any;
inprocessing = false;

private fb = inject(FormBuilder)
private router = inject(Router)
private orderservice = inject(OrderService)
private cartservice = inject(CartService)


 ngOnInit(): void {
    this.cart = this.cartservice.getCartItems();
    this.subtotal = this.cartservice.getSubtotal();
    
    // Total calculation: Subtotal + GST
    this.grandtotal = this.subtotal + this.gst;

    // Agar cart khali hai toh redirect karein
    if (this.cart.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.initForm();
  }


ngAfterViewInit() {
  setTimeout(() => {
    // Console mein check karein ki Stripe load hua ya nahi
    if (typeof Stripe !== 'undefined') {
      this.stripe = Stripe('pk_test_51OXLkBCgTYG0LBH1TKnX4icXnEyw1xOIEJSZvAeKlmEq6RnSPbl9uqdwqY9UWKsvRJN6m3dE05ArIp6gNJ9kxpby00rl1GahFz');
      const elements = this.stripe.elements();
      
      this.cartElement = elements.create('card', {
        hidePostalCode: true,
        style: {
          base: {
            fontSize: '18px', // Size thoda bada karke check karein
            color: '#32325d',
          }
        }
      });

      console.log("Mounting now...");
      this.cartElement.mount('#stripe-card-element');
    } else {
      console.error("Stripe script not found in index.html");
    }
  }, 1000); // 1 second ka delay dekar dekhein
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
    // 1. Order Object Structure
    const finalOrder = {
      orderId: 'ORD' + Math.floor(Math.random() * 1000000),
      date: new Date(),
      items: [...this.cart], // Cart snapshot
      total: this.grandtotal,
      paymentId: paymentId,
      status: 'Pending',
      shippingDetails: this.checkoutForm.value
    };

    // 2. Save in Service (LocalStorage)
    this.cartservice.placeOrder(finalOrder);
    
    this.inprocessing = false;

    // 3. Success Feedback
    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      text: 'Thank you for shopping with us.',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/orders']); // History page par redirect
    });
  }

    private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

}
