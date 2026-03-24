import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
private productservice = inject(ProductService)

product:any[]=[];
onEditModeon=false;


productForm = {
  id:0,
  name:"",
  price:0,
  img:'',
  des:''

}

ngOnInit(){
  this.productservice.products$.subscribe(res=>{
    this.product=res;
  })
}

onSubmit(){
  if(this.onEditModeon){
    this.productservice.updateProduct({...this.productForm});
    alert("Product updated")
  } else(this.productservice.addProduct({...this.productForm}));
  alert("Product Added")
  this.resetForm();
}

onEdit(prod:any){
  this.onEditModeon=true
  this.productForm={...prod};

}

onDelete(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',   // Delete ke liye Red color
    cancelButtonColor: '#3085d6',  // Cancel ke liye Blue color
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. Service se product delete karein
      this.productservice.deleteProduct(id);

      // 2. Success message dikhayein
      Swal.fire(
        'Deleted!',
        'Your product has been removed from inventory.',
        'success'
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Optional: Agar user cancel kare toh kya dikhana hai
      Swal.fire(
        'Cancelled',
        'Your product is safe :)',
        'error'
      );
    }
  });
}

resetForm(){
  this.productForm = {id:0, name:'', price:0 , img:'', des:''}
  this.onEditModeon=false
}
}
