import { Component, inject } from '@angular/core';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
public orderservice = inject(OrderService)
myorder : any[]=[]


ngOnInit(){
  this.myorder = this.orderservice.getOrderHistory().reverse();
}
}
