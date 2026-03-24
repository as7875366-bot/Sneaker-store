import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private usersessionkey = "currentuser"

  private getorderkey():string{
    const user = JSON.parse(localStorage.getItem(this.usersessionkey)||'{}')
    return user.email? `orders_${user.email}`:'orders_guest'
  }

  PlaceOrder(orderDetail:any){
    const key = this.getorderkey();
  const  orders = this.getOrderHistory()
  orders.push(orderDetail);
  localStorage.setItem(key, JSON.stringify(orders));

  }

  getOrderHistory(): any[] {
    const key = this.getorderkey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }


}
